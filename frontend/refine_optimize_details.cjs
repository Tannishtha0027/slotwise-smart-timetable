const fs = require('fs');
let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// Upgrade the underline to be organic
const plainUnderline = '<div className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FFC94A] rounded-full opacity-80 -z-0" />';
const organicUnderline = `<div 
              className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FFC94A] opacity-80 -z-0"
              style={{
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                transform: 'rotate(-0.5deg)'
              }} 
            />`;

if (content.includes(plainUnderline)) {
    content = content.replace(plainUnderline, organicUnderline);
}

// Make sure checklist has subtle neutral pending state (currently it's text-slot-charcoal/30 with a dot. Let's ensure it's a circle)
const checklistPending = `{passed ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}`;
const checklistNeutral = `{passed ? <Check size={12} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-current opacity-60" />}`;
if (content.includes(checklistPending)) {
    content = content.replace(checklistPending, checklistNeutral);
}

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log("Optimize page refined with organic underline and checklist styling.");
