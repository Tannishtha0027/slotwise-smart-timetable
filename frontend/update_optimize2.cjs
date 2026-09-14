const fs = require('fs');

let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// 1. Large Simulation Panel
const simSearch = `<div className="flex-grow bg-[#F1EBDD] border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center">`;
const simReplace = `<div className="flex-grow border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(241, 235, 221, 0.4), rgba(241, 235, 221, 0.4)), url(/images/paper-texture.png)' }}>`;
content = content.replace(simSearch, simReplace);

// 2. Subject/Exam Cards
// First let's find the exact current string for the cards. It should be:
const cardSearch = "className={`bg-[#FFF8E8] border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full ${progress >= 20 && progress < 25 && (i === 0 || i === 2 || i === 1 || i === 4) ? 'border-slot-orange shadow-slot-orange/20' : 'border-[#E8D9B8]'}`}";
const cardReplace = "className={`bg-[#FFC94A] border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full ${progress >= 20 && progress < 25 && (i === 0 || i === 2 || i === 1 || i === 4) ? 'border-slot-orange shadow-slot-orange/20' : 'border-[#EBA834]/40'}`}";

// We might need to handle regex replace in case spacing is different
content = content.replace(/bg-\[#FFF8E8\]/g, 'bg-[#FFC94A]');
content = content.replace(/border-\[#E8D9B8\]/g, 'border-[#EBA834]/40');

// 3. Right Metrics Panel
const rightSearch = `className="w-full lg:w-[320px] shrink-0 bg-[#EEEAF8] border border-slot-indigo/10 rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit"`;
const rightReplace = `className="w-full lg:w-[320px] shrink-0 bg-[#FFF7D9] border border-[#EBE3C5] rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit"`;
content = content.replace(rightSearch, rightReplace);

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log('Optimize.tsx second refinement applied');
