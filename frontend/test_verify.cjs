const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to an empty page on localhost to set sessionStorage
  await page.goto('http://localhost:5173/');

  // TEST 1: SUCCESS STATE
  console.log("=== TEST 1: VALID RESULT ===");
  await page.evaluate(() => {
    sessionStorage.setItem('realTimetableResult', JSON.stringify({
      status: 'OPTIMAL',
      validation: {
        is_valid: true,
        violations: []
      },
      assignments: {
        'CS101': { time_slot_id: 'TS1', room_id: 'R1', faculty_ids: ['F1'] }
      }
    }));
  });

  await page.goto('http://localhost:5173/verify');
  
  // Wait for the animation to finish (10 steps)
  // Max wait around 10s
  console.log("Waiting for verification complete modal...");
  await page.waitForSelector('h3:has-text("Verification Complete")', { timeout: 15000 });
  console.log("Success modal appeared!");

  // TEST 2: FAILED STATE
  console.log("\n=== TEST 2: INVALID RESULT ===");
  await page.evaluate(() => {
    sessionStorage.setItem('realTimetableResult', JSON.stringify({
      status: 'INFEASIBLE',
      validation: {
        is_valid: false,
        violations: [
          { type: 'ROOM_CAPACITY', message: 'Room R1 is too small for CS101.' }
        ]
      },
      assignments: {}
    }));
  });

  await page.goto('http://localhost:5173/verify');
  
  console.log("Waiting for verification failed modal...");
  await page.waitForSelector('h3:has-text("Verification Failed")', { timeout: 15000 });
  console.log("Failed modal appeared!");

  // Check the summary block for 1 violation
  const violationsFound = await page.evaluate(() => {
    return document.querySelector('.text-red-500')?.innerText;
  });
  console.log("Violations found in summary:", violationsFound);

  await browser.close();
})();
