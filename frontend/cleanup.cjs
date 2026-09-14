const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(search, replacement);
        fs.writeFileSync(fullPath, content);
    }
}

// Fix TS Ref errors in HowItWorks and VerificationChecklist
replaceInFile('src/components/HowItWorks.tsx', /ref=\{\(el\) => \(stepRefs\.current\[idx\] = el\)\}/g, 'ref={(el) => { stepRefs.current[idx] = el; }}');
replaceInFile('src/components/HowItWorks.tsx', /ref=\{el => itemRefs\.current\[idx\] = el\}/g, 'ref={el => { itemRefs.current[idx] = el; }}');
replaceInFile('src/components/VerificationChecklist.tsx', /ref=\{el => itemRefs\.current\[idx\] = el\}/g, 'ref={el => { itemRefs.current[idx] = el; }}');

// Fix Optimize.tsx Framer Motion error
replaceInFile('src/pages/Optimize.tsx', /type: shouldReduceMotion \? false : "spring"/g, 'type: shouldReduceMotion ? "tween" : "spring", duration: shouldReduceMotion ? 0 : undefined');

// Remove unused 'React' imports
const files = [
    'src/App.tsx', 'src/components/FinalCTA.tsx', 'src/components/Footer.tsx',
    'src/components/GridBackgroundLayout.tsx', 'src/components/Hero.tsx', 'src/components/HeroTimetable.tsx',
    'src/components/HowItWorks.tsx', 'src/pages/CreateTimetable.tsx', 'src/pages/Landing.tsx',
    'src/pages/Optimize.tsx', 'src/pages/ProjectIntelligence.tsx', 'src/pages/Publish.tsx',
    'src/pages/TimetableResult.tsx', 'src/pages/VerifySchedule.tsx'
];
files.forEach(f => {
    replaceInFile(f, /import React[, ]*\{?.*\}? from 'react';\n/g, (match) => {
        // If it imports hooks like { useState }, keep them but remove React
        if (match.includes('{')) {
            return match.replace(/React,\s*/, '');
        }
        return '';
    });
});

console.log("Cleanup script completed.");
