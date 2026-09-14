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

  // Add import if not present
  if (!content.includes("import Navbar")) {
    content = content.replace(/(import React.*)/, "$1\nimport Navbar from '../components/Navbar';");
  }

  // Replace header with Navbar
  // The header looks like <header className="..."> ... </header>
  // We'll use a regex to match from <header to </header>
  content = content.replace(/<header[\s\S]*?<\/header>/, '<Navbar />');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${page}`);
}
