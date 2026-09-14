const fs = require('fs');
const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Dashboard contains:
// status: 'Verified',
// updated: 'Today',
content = content.replace(/status:\s*'Verified',/, "status: sessionStorage.getItem('timetableStatus') || 'Verified',");
fs.writeFileSync(file, content);
console.log('Dashboard patched.');
