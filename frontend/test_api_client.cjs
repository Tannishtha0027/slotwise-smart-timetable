const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const payload = JSON.parse(fs.readFileSync('../payload.json', 'utf8'));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to frontend (runs on 5173, make sure it is running)
  await page.goto('http://localhost:5173/');
  
  console.log("Injecting fetch request to http://localhost:8000/api/v1/schedule from frontend origin...");
  
  const result = await page.evaluate(async (data) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return { success: false, status: response.status, body: await response.text() };
      }
      return { success: true, status: response.status, body: await response.json() };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, payload);

  console.log("Result:", JSON.stringify(result, null, 2));

  if (result.success) {
      console.log("Success! Status is", result.status);
      console.log("Assignments generated:", Object.keys(result.body.assignments).length);
  } else {
      console.log("Failed!", result);
  }

  await browser.close();
})();
