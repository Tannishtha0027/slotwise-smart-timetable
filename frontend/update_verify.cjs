const fs = require('fs');
let content = fs.readFileSync('src/pages/VerifySchedule.tsx', 'utf8');

// The primary button is navigating to /result right now.
// There seem to be two instances of "Continue to timetable" navigating to /result in this file.
// We'll replace both to ensure consistency across the page's success states.
content = content.replace(/Continue to timetable/g, 'Publish timetable');
content = content.replace(/navigate\('\/result'\)/g, "navigate('/publish')");

fs.writeFileSync('src/pages/VerifySchedule.tsx', content);
console.log('VerifySchedule.tsx updated.');
