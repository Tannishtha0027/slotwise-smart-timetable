const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Go to Create Timetable page
  await page.goto('http://localhost:5173/create');
  
  // Click "Use sample data"
  console.log("Clicking 'Use sample data'");
  await page.click('button:has-text("Use sample data")');
  
  // Wait for button to change to "Continue"
  await page.waitForTimeout(500);

  // Click "Continue" (which is now handleProceed)
  console.log("Clicking 'Continue' to trigger API request...");
  
  // Intercept the API request to confirm it gets sent
  page.on('request', request => {
    if (request.url().includes('/api/v1/schedule')) {
      console.log('Intercepted Request to:', request.url(), request.method());
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/v1/schedule')) {
      console.log('Received Response from backend:', response.status());
      const body = await response.json();
      console.log('Response status from engine:', body.status);
      console.log('Objective Value:', body.objective_value);
      console.log('Number of assignments:', Object.keys(body.assignments).length);
    }
  });

  await page.click('button:has-text("Continue")');
  
  console.log("Waiting for navigation to /constraints...");
  await page.waitForURL('http://localhost:5173/constraints', { timeout: 10000 });
  
  console.log("Successfully navigated to /constraints!");
  
  // Verify that the real timetable result is in sessionStorage
  const sessionStorageData = await page.evaluate(() => sessionStorage.getItem('realTimetableResult'));
  if (sessionStorageData) {
      console.log("Result was successfully saved to sessionStorage!");
  } else {
      console.log("Result was NOT saved to sessionStorage!");
  }

  await browser.close();
})();
