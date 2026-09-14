const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/create', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(__dirname, 'screenshot_create.png') });
  await browser.close();
})();
