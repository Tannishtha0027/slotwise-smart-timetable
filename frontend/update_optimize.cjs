const fs = require('fs');

let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// 1. Large Visual Simulation Panel
const simSearch = `className="flex-grow bg-white/90 backdrop-blur-md border border-slot-indigo/10 rounded-3xl shadow-lg relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center"`;
const simReplace = `className="flex-grow bg-[#F1EBDD] border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center"`;
content = content.replace(simSearch, simReplace);

// 2. Subject/Exam Cards
const cardSearch = `className={\`bg-white border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full \${progress >= 20 && progress < 25 && (i === 0 || i === 2 || i === 1 || i === 4) ? 'border-slot-orange shadow-slot-orange/20' : 'border-slot-indigo/10'}\`}`;
const cardReplace = `className={\`bg-[#FFF8E8] border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full \${progress >= 20 && progress < 25 && (i === 0 || i === 2 || i === 1 || i === 4) ? 'border-slot-orange shadow-slot-orange/20' : 'border-[#E8D9B8]'}\`}`;
content = content.replace(cardSearch, cardReplace);

// 3. Right Metrics Panel
const rightSearch = `className="w-full lg:w-[320px] shrink-0 bg-white/90 backdrop-blur-md border border-slot-indigo/10 rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit"`;
const rightReplace = `className="w-full lg:w-[320px] shrink-0 bg-[#EEEAF8] border border-slot-indigo/10 rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit"`;
content = content.replace(rightSearch, rightReplace);

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log('Optimize.tsx colors updated');
