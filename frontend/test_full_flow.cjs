const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 1. Open /create
  await page.goto('http://localhost:5173/create');
  
  // 2. Use the sample data
  console.log("Clicking 'Use sample data'");
  await page.click('button:has-text("Use sample data")');
  await page.waitForTimeout(500);

  // 3. Click Continue (wait for /constraints)
  console.log("Clicking 'Continue'...");
  await page.click('button:has-text("Continue")');
  await page.waitForURL('http://localhost:5173/constraints', { timeout: 10000 });
  
  // 7. Continue through Constraints
  console.log("At Constraints. Clicking 'Continue'...");
  await page.waitForTimeout(500);
  await page.click('button:has-text("Continue")');
  
  // 8. Continue through Optimize
  console.log("At Optimize. Waiting for simulation to finish...");
  await page.waitForURL('http://localhost:5173/result', { timeout: 60000 });
  
  console.log("Reached /result!");
  
  // 11. Confirm the timetable displayed is based on the REAL backend response.
  await page.waitForSelector('h1:has-text("Timetable Result")');

  // Let's get the text of all rendered exam subjects
  const subjects = await page.evaluate(() => {
      const els = document.querySelectorAll('h3');
      return Array.from(els).map(el => el.innerText.trim()).filter(t => t.length > 0);
  });
  
  console.log("Rendered exam subjects:", subjects);

  const qualityScoreText = await page.evaluate(() => {
      const el = document.querySelector('.text-xl.font-bold');
      return el ? el.innerText.trim() : null;
  });
  console.log("Displayed Quality Score:", qualityScoreText);
  
  const statusText = await page.evaluate(() => {
      // Find the div with the green pill that shows the status
      const el = document.querySelector('.bg-green-100');
      return el ? el.innerText.trim() : null;
  });
  console.log("Displayed Status:", statusText);

  await browser.close();
})();
