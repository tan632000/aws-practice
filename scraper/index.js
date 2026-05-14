import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const selectorsPath = path.join(__dirname, 'selectors.json');
const outputPath = path.join(__dirname, '../public/data/questions.json');

function generateHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function deduplicateQuestions(questions) {
  const seenHashes = new Set();
  const uniqueQuestions = [];

  for (const q of questions) {
    const hash = generateHash(q.text);
    if (!seenHashes.has(hash)) {
      seenHashes.add(hash);
      // Use hash as the ID for QuestionSchema
      uniqueQuestions.push({ ...q, id: hash });
    }
  }

  return uniqueQuestions;
}

export async function runScraper() {
  let selectors;
  try {
    const rawData = fs.readFileSync(selectorsPath, 'utf8');
    selectors = JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading selectors.json:', error.message);
    process.exit(1);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting scraper...');
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Config delay in case of network issues (Risk Mitigation)
    page.setDefaultNavigationTimeout(30000);
    
    let targetUrl = selectors.targetUrl;
    if (targetUrl.startsWith('./')) {
      targetUrl = 'file://' + path.resolve(__dirname, targetUrl);
    }
    
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    console.log('Extracting questions...');
    const questions = await page.evaluate((sel) => {
      const results = [];
      const containers = document.querySelectorAll(sel.questionContainer);
      
      if (!containers || containers.length === 0) {
        return null; // Indicates no data found based on selector
      }

      containers.forEach(container => {
        const textEl = container.querySelector(sel.questionText);
        const explanationEl = container.querySelector(sel.explanation);
        const trickEl = sel.trick ? container.querySelector(sel.trick) : null;
        const domainEl = sel.domain ? container.querySelector(sel.domain) : null;
        
        const optionEls = container.querySelectorAll(sel.options);
        const options = Array.from(optionEls).map((opt, index) => {
          const optTextEl = opt.querySelector(sel.optionText) || opt;
          return {
            id: `opt-${index}`,
            text: optTextEl.textContent.trim(),
            isCorrect: opt.classList.contains(sel.isCorrectClass)
          };
        });

        if (textEl) {
          results.push({
            text: textEl.textContent.trim(),
            options: options,
            explanation: explanationEl ? explanationEl.textContent.trim() : 'No explanation provided.',
            trick: trickEl ? trickEl.textContent.trim() : undefined,
            domain: domainEl ? domainEl.textContent.trim() : undefined
          });
        }
      });
      return results;
    }, selectors);

    if (!questions) {
      console.error('Missing data: Could not find any questions using the provided selectors.');
      await browser.close();
      process.exit(0);
    }

    const uniqueQuestions = deduplicateQuestions(questions);
    
    fs.writeFileSync(outputPath, JSON.stringify(uniqueQuestions, null, 2), 'utf8');
    console.log(`Successfully scraped and saved ${uniqueQuestions.length} unique questions to ${outputPath}`);
    
  } catch (error) {
    console.error('Network or Execution Error:', error.message);
    // Exit gracefully as required
    process.exit(0);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Only run automatically if this is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runScraper();
}
