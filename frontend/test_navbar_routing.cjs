const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test from Dashboard
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForTimeout(1000);
  await page.click('a[aria-label="Go to Slotwise home"]');
  await page.waitForURL('http://localhost:5173/');
  console.log("Success: Dashboard -> Landing");

  // Test from Optimize
  await page.goto('http://localhost:5173/optimize');
  await page.waitForTimeout(1000);
  await page.click('a[aria-label="Go to Slotwise home"]');
  await page.waitForURL('http://localhost:5173/');
  console.log("Success: Optimize -> Landing");
  
  await browser.close();
})();
