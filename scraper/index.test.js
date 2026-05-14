import { describe, it, expect } from 'vitest';
import { deduplicateQuestions, runScraper } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('deduplicateQuestions', () => {
  it('should remove duplicate questions based on text hash', () => {
    const questions = [
      { text: 'What is EC2?', options: [] },
      { text: 'What is S3?', options: [] },
      { text: 'What is EC2?', options: [] } // duplicate
    ];
    
    const result = deduplicateQuestions(questions);
    
    expect(result.length).toBe(2);
    expect(result[0].text).toBe('What is EC2?');
    expect(result[1].text).toBe('What is S3?');
    // Ensure ID is added
    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
  });
});

describe('Integration Scraper Test', () => {
  it('should scrape successfully from a local html file', async () => {
    // Set env var so we don't overwrite real data
    const outputPath = path.join(__dirname, 'test-output.json');
    process.env.SCRAPER_OUTPUT_PATH = outputPath;

    // Run the scraper which uses the mock.html configured in selectors.json
    await runScraper();
    
    // Verify output file
    expect(fs.existsSync(outputPath)).toBe(true);
    
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    // Since mock.html has 2 identical questions, it should deduplicate to 1
    expect(data.length).toBe(1);
    expect(data[0].text).toBe('What is Amazon S3?');
    expect(data[0].options[0].isCorrect).toBe(true);
    expect(data[0].options[1].isCorrect).toBe(false);
  });
});
