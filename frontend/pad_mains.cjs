const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pagesToUpdate = [
  'CreateTimetable.tsx',
  'SetConstraints.tsx',
  'Optimize.tsx',
  'TimetableResult.tsx',
  'VerifySchedule.tsx',
  'ProjectIntelligence.tsx',
  'Publish.tsx'
];

for (const page of pagesToUpdate) {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace pt-X with pt-24 or pt-32 where appropriate on <main>
  // A simple replace: if it has pt-12 or pt-8 or pt-4 on <main className="...">, change to pt-28
  content = content.replace(/(<main[^>]*className="[^"]*)pt-\d+([^"]*")/, '$1pt-28$2');

  fs.writeFileSync(filePath, content);
  console.log(`Padded ${page}`);
}
