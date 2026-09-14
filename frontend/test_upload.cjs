const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Create a dummy csv file
  const testFilePath = path.join(__dirname, 'test_schedule.csv');
  fs.writeFileSync(testFilePath, 'col1,col2\nval1,val2');

  await page.goto('http://localhost:5173/create');
  
  // Wait for the upload button
  await page.waitForSelector('button:has-text("Upload CSV / Excel")');

  // We set up a Promise to wait for the file chooser popup
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('button:has-text("Upload CSV / Excel")'),
  ]);

  console.log('File chooser opened. Selecting file...');
  await fileChooser.setFiles(testFilePath);

  console.log('File selected. Waiting for UI update...');
  // The UI should now display the file name "test_schedule.csv" inside a green box where the button was.
  await page.waitForSelector('span:has-text("test_schedule.csv")');
  console.log('File name successfully rendered in the UI!');

  // Check that the data cards display "Ready to parse"
  const readyToParseCount = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('span')).filter(el => el.innerText === 'Ready to parse').length;
  });
  console.log(`Found ${readyToParseCount} "Ready to parse" labels.`);

  // Verify the "Continue" button is enabled
  const isContinueEnabled = await page.evaluate(() => {
    const btn = document.querySelector('button:has-text("Continue")');
    return btn && !btn.disabled;
  });
  console.log('Is Continue button enabled?', isContinueEnabled);

  // Clean up
  fs.unlinkSync(testFilePath);
  await browser.close();
})();
