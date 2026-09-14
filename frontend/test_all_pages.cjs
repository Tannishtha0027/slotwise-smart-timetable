const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Checking Landing Page...");
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  console.log("Checking Dashboard...");
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForTimeout(1000);

  console.log("Checking Create...");
  await page.goto('http://localhost:5173/create');
  await page.waitForTimeout(1000);

  console.log("Checking Constraints...");
  await page.goto('http://localhost:5173/constraints');
  await page.waitForTimeout(1000);

  console.log("Checking Optimize...");
  await page.goto('http://localhost:5173/optimize');
  await page.waitForTimeout(1000);

  console.log("Checking Result...");
  await page.goto('http://localhost:5173/result');
  await page.waitForTimeout(1000);

  console.log("Checking Verify...");
  await page.goto('http://localhost:5173/verify');
  await page.waitForTimeout(1000);

  console.log("Checking Publish...");
  await page.goto('http://localhost:5173/publish');
  await page.waitForTimeout(1000);

  console.log("All pages loaded successfully without crashing!");
  await browser.close();
})();
