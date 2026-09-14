const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/publish');
  await page.waitForTimeout(2000); // let animations settle
  await page.screenshot({ path: 'screenshot_publish_initial.png' });
  console.log("Screenshot initial saved.");

  // Click Publish
  const publishBtn = page.locator('button', { hasText: 'Publish timetable' });
  if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await page.waitForTimeout(1000); // let success animation settle
      await page.screenshot({ path: 'screenshot_publish_success.png' });
      console.log("Screenshot success saved.");

      // Verify dashboard updates
      const backBtn = page.locator('button', { hasText: 'Back to dashboard' });
      await backBtn.click();
      await page.waitForURL('**/dashboard');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshot_publish_dashboard.png' });
      console.log("Screenshot dashboard saved.");
  }

  await browser.close();
})();
