const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot_dashboard.png', fullPage: true });
  await browser.close();
})();
