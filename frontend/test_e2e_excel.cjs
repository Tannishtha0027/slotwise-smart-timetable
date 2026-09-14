const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/create');

  async function uploadFile(filename) {
    const filePath = path.join(__dirname, filename);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('button:has-text("Upload Excel")'), // partial match is fine
    ]);
    await fileChooser.setFiles(filePath);
    await page.waitForSelector(`span:has-text("${filename}")`);
  }

  // 1. Missing sheet
  console.log("Testing bad_missing_sheet.xlsx...");
  await uploadFile('bad_missing_sheet.xlsx');
  await page.click('button:has-text("Continue")');
  await page.waitForSelector('p:has-text("Parse Error: Missing required sheet: Exams")');
  console.log("Missing sheet caught.");

  // Reset file input by reloading
  await page.goto('http://localhost:5173/create');

  // 2. Missing column
  console.log("Testing bad_missing_column.xlsx...");
  await uploadFile('bad_missing_column.xlsx');
  await page.click('button:has-text("Continue")');
  await page.waitForSelector('p:has-text("Parse Error: Missing required column in Exams row 2. Required: id, course_name, duration_minutes.")');
  console.log("Missing column caught.");

  await page.goto('http://localhost:5173/create');

  // 3. Unknown exam
  console.log("Testing bad_unknown_exam.xlsx...");
  await uploadFile('bad_unknown_exam.xlsx');
  await page.click('button:has-text("Continue")');
  await page.waitForSelector('p:has-text("Parse Error: Student S1 references unknown exam: FAKE99")');
  console.log("Unknown exam caught.");

  await page.goto('http://localhost:5173/create');

  // 4. Valid workbook -> Backend -> Success
  console.log("Testing test_sample_data.xlsx...");
  
  // Intercept the backend API call to ensure it actually fires with CollegeData
  let apiCalled = false;
  page.on('request', request => {
    if (request.url().includes('/api/v1/schedule') && request.method() === 'POST') {
      apiCalled = true;
      console.log('API POST request detected with payload:', JSON.parse(request.postData()).exams.length, 'exams');
    }
  });

  await uploadFile('test_sample_data.xlsx');
  await page.click('button:has-text("Continue")');
  
  // Wait for navigation to /constraints
  await page.waitForURL('**/constraints', { timeout: 15000 });
  console.log("Navigated to /constraints!");
  console.log("API called?", apiCalled);

  // Let's also check if session storage got populated with 'realTimetableResult'
  const hasResult = await page.evaluate(() => {
    return !!sessionStorage.getItem('realTimetableResult');
  });
  console.log("realTimetableResult in sessionStorage?", hasResult);

  await browser.close();
})();
