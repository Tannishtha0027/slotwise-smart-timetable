const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1400 });
  
  await page.goto('http://localhost:5173/insights', { waitUntil: 'networkidle' });
  
  // Wait for initial animations
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_insights_top.png', fullPage: false });

  // Scroll down slightly to trigger whileInView animations
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot_insights_bottom.png', fullPage: true });

  await browser.close();
})();
