const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('http://localhost:5173/result', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot_result_clean.png', fullPage: true });
  await browser.close();
})();
