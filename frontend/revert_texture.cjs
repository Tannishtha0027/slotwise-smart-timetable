const fs = require('fs');

let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// Revert the Large Simulation Panel back to solid color since the image was missing.
const simSearch = `<div className="flex-grow border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(241, 235, 221, 0.4), rgba(241, 235, 221, 0.4)), url(/images/paper-texture.png)' }}>`;
const simReplace = `<div className="flex-grow bg-[#F1EBDD] border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center">`;
content = content.replace(simSearch, simReplace);

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log('Optimize.tsx reverted paper texture placeholder');
