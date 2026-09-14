const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go directly to Verify page
  await page.goto('http://localhost:5173/verify');
  
  // Wait for the verification to complete (it has a mock loading state)
  // Or we can just wait for the button "Publish timetable" to appear.
  // The verification takes about 4 seconds (from previous context, usually it iterates over rules).
  await page.waitForTimeout(6000); 

  console.log("Looking for 'Publish timetable' button...");
  const publishBtn = page.locator('button', { hasText: 'Publish timetable' }).first();
  if (await publishBtn.isVisible()) {
      console.log("Button is visible, clicking it...");
      await publishBtn.click();
      
      // Wait for navigation
      await page.waitForURL('**/publish');
      console.log("Navigated to:", page.url());
      await page.screenshot({ path: 'screenshot_publish.png' });
      console.log("Screenshot saved.");
  } else {
      console.log("Button not found. Trying to see what is on page.");
      await page.screenshot({ path: 'screenshot_verify_fail.png' });
  }

  await browser.close();
})();
