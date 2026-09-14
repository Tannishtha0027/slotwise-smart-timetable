const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/dashboard');
  
  // Go to publish page
  await page.evaluate(() => sessionStorage.setItem('currentProjectId', 'p3'));
  await page.evaluate(() => {
    // Inject a dummy timetable
    sessionStorage.setItem('realTimetableResult', JSON.stringify({
      assignments: {
        'CS101': { time_slot_id: 'ts1', room_id: 'R101', faculty_ids: ['F1'] }
      }
    }));
  });
  
  await page.goto('http://localhost:5173/result');
  console.log("On TimetableResult. Testing View modes...");
  
  // Click list mode
  await page.click('button:has-text("")'); // Actually wait, buttons use icons
  // Let's just evaluate
  await page.evaluate(() => document.querySelectorAll('button')[1].click());
  
  // Testing CSV
  page.on('download', download => console.log('Downloaded:', download.suggestedFilename()));
  await page.click('button[title="Download Export"]');
  await page.waitForTimeout(1000);

  // Testing Publish Page
  await page.goto('http://localhost:5173/publish');
  
  // PDF
  await page.click('button:has-text("Download PDF")');
  await page.waitForTimeout(1000);
  
  // Excel
  await page.click('button:has-text("Download Excel")');
  await page.waitForTimeout(1000);

  console.log("Finished tests.");
  await browser.close();
})();
