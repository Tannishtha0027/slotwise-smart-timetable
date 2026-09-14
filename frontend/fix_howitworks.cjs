const fs = require('fs');

let content = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
content = content.replace(/\{steps\.map\(\(step, __idx\) => \(/g, '{steps.map((step, _idx) => (');
fs.writeFileSync('src/components/HowItWorks.tsx', content);

console.log("Fixed _idx in HowItWorks.tsx");
