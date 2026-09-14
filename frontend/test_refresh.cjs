const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/dashboard');

  console.log("1. On Dashboard. Checking initial state...");
  let p3Status = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'First Year Model Exams')
      ?.parentElement?.parentElement?.querySelector('.text-xs.uppercase')?.textContent?.trim();
  });
  console.log("Initial P3 status:", p3Status);

  console.log("2. Setting state as if we clicked project 3 and went to Publish...");
  await page.evaluate(() => {
    sessionStorage.setItem('currentProjectId', 'p3');
  });

  await page.goto('http://localhost:5173/publish');
  
  console.log("3. On /publish. Clicking 'Publish timetable'...");
  await page.waitForSelector('button:has-text("Publish timetable")');
  await page.click('button:has-text("Publish timetable")');
  
  await page.waitForSelector('h1:has-text("Timetable published.")');
  console.log("4. Published successfully.");

  console.log("5. Returning to Dashboard...");
  await page.goto('http://localhost:5173/dashboard');

  console.log("6. On Dashboard. Checking published state...");
  p3Status = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'First Year Model Exams')
      ?.parentElement?.parentElement?.querySelector('.text-xs.uppercase')?.textContent?.trim();
  });
  console.log("Post-publish P3 status:", p3Status);
  if (p3Status.toLowerCase() !== 'published') throw new Error("Not published!");

  console.log("7. Refreshing the browser...");
  await page.reload();
  await page.waitForLoadState('networkidle');

  console.log("8. Checking published state after refresh...");
  p3Status = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'First Year Model Exams')
      ?.parentElement?.parentElement?.querySelector('.text-xs.uppercase')?.textContent?.trim();
  });
  console.log("Post-refresh P3 status:", p3Status);
  if (p3Status.toLowerCase() !== 'published') throw new Error("Failed to persist after refresh!");

  console.log("9. Checking other projects...");
  let p1Status = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'October 2026 End Semester')
      ?.parentElement?.parentElement?.querySelector('.text-xs.uppercase')?.textContent?.trim();
  });
  console.log("P1 status:", p1Status);
  if (p1Status.toLowerCase() === 'published') throw new Error("P1 was wrongly published!");

  await browser.close();
  console.log("ALL TESTS PASSED!");
})();
