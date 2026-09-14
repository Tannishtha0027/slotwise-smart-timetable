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

// 1. Unused imports in Dashboard
replaceInFile('src/pages/Dashboard.tsx', /import { useState, useEffect } from 'react';\n/, '');
replaceInFile('src/pages/Dashboard.tsx', /Menu, X, /, '');

// 2. Unused imports in CreateTimetable
replaceInFile('src/pages/CreateTimetable.tsx', /import { Link } from 'react-router-dom';\n/, '');
replaceInFile('src/pages/CreateTimetable.tsx', /import { motion, AnimatePresence } from 'framer-motion';/g, "import { motion } from 'framer-motion';");
replaceInFile('src/pages/CreateTimetable.tsx', /ArrowLeft, /, '');
replaceInFile('src/pages/CreateTimetable.tsx', /ArrowLeft } from 'lucide-react';/g, "} from 'lucide-react';");

// 3. Unused imports in ProjectIntelligence
replaceInFile('src/pages/ProjectIntelligence.tsx', /import { Link } from 'react-router-dom';\n/, '');
replaceInFile('src/pages/ProjectIntelligence.tsx', /ArrowLeft, /, '');
replaceInFile('src/pages/ProjectIntelligence.tsx', /ArrowLeft } from 'lucide-react';/g, "} from 'lucide-react';");

// 4. Unused imports in VerifySchedule
replaceInFile('src/pages/VerifySchedule.tsx', /import { Link, useNavigate } from 'react-router-dom';/g, "import { useNavigate } from 'react-router-dom';");
replaceInFile('src/pages/VerifySchedule.tsx', /ArrowLeft, /, '');
replaceInFile('src/pages/VerifySchedule.tsx', /ArrowLeft } from 'lucide-react';/g, "} from 'lucide-react';");

// 5. Unused imports in Optimize
replaceInFile('src/pages/Optimize.tsx', /import { Link, useNavigate } from 'react-router-dom';/g, "import { useNavigate } from 'react-router-dom';");
replaceInFile('src/pages/Optimize.tsx', /Beaker, /, '');

// 6. Unused imports in TimetableResult
replaceInFile('src/pages/TimetableResult.tsx', /import { Link, useNavigate } from 'react-router-dom';/g, "import { useNavigate } from 'react-router-dom';");
replaceInFile('src/pages/TimetableResult.tsx', /ArrowLeft, /, '');
replaceInFile('src/pages/TimetableResult.tsx', /ArrowLeft } from 'lucide-react';/g, "} from 'lucide-react';");

// 7. Unused imports in SetConstraints
replaceInFile('src/pages/SetConstraints.tsx', /import { Link, useNavigate } from 'react-router-dom';/g, "import { useNavigate } from 'react-router-dom';");
replaceInFile('src/pages/SetConstraints.tsx', /ArrowLeft, /, '');
replaceInFile('src/pages/SetConstraints.tsx', /ArrowLeft } from 'lucide-react';/g, "} from 'lucide-react';");

// 8. Unused variable in Optimize.tsx
replaceInFile('src/pages/Optimize.tsx', /let stageText = "RAW DATA";\n\s*if \(progress >= 15 && progress < 30\) \{ stageText = "CONFLICT MAPPING"; \}\n\s*else if \(progress >= 30 && progress < 55\) \{ stageText = "REARRANGING"; \}\n\s*else if \(progress >= 55 && progress < 65\) \{ stageText = "ROOM ASSIGNMENT"; \}\n\s*else if \(progress >= 65 && progress < 75\) \{ stageText = "FACULTY ASSIGNMENT"; \}\n\s*else if \(progress >= 75 && progress < 100\) \{ stageText = "QUALITY IMPROVEMENT"; \}\n\s*else if \(progress >= 100\) \{ stageText = "OPTIMIZED SCHEDULE"; \}/g, '');

// 9. Fix React Hook Warning in VerificationChecklist
// Need to copy ref to a variable inside useEffect
replaceInFile('src/components/VerificationChecklist.tsx', 
`    return () => {
      if (itemRefs.current[idx]) {
        observer.unobserve(itemRefs.current[idx]!);
      }
    };`, 
`    const node = itemRefs.current[idx];
    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };`);

// 10. Clean up `_idx` in HowItWorks
replaceInFile('src/components/HowItWorks.tsx', /\(step, idx\)/g, '(step, _idx)');
replaceInFile('src/components/HowItWorks.tsx', /_idx\)/g, '_idx)'); // just making sure it's valid if there was a problem

console.log("Lint cleanup completed.");
