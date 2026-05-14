import puppeteer from 'puppeteer';
import fs from 'fs';

async function dump() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://tutorialsdojo.com/aws-certified-solutions-architect-associate-saa-c03/', { waitUntil: 'networkidle2' });
  const html = await page.content();
  fs.writeFileSync('dump.html', html);
  await browser.close();
}
dump();
