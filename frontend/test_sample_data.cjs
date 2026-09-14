const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/create');

  console.log("Testing Sample Data...");
  
  let apiCalled = false;
  page.on('request', request => {
    if (request.url().includes('/api/v1/schedule') && request.method() === 'POST') {
      apiCalled = true;
      console.log('API POST request detected with payload:', JSON.parse(request.postData()).exams.length, 'exams');
    }
  });

  await page.click('button:has-text("Use sample data")');
  await page.click('button:has-text("Continue")');
  
  await page.waitForURL('**/constraints', { timeout: 15000 });
  console.log("Navigated to /constraints!");
  console.log("API called?", apiCalled);

  const hasResult = await page.evaluate(() => !!sessionStorage.getItem('realTimetableResult'));
  console.log("realTimetableResult in sessionStorage?", hasResult);

  await browser.close();
})();
