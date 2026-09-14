const fs = require('fs');

function replace(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
}

replace('src/pages/Dashboard.tsx', /import \{ useState, useEffect \} from 'react';\n/g, '');
replace('src/pages/Dashboard.tsx', /import \{ useState \} from 'react';\n/g, '');
replace('src/pages/CreateTimetable.tsx', /import \{ Link \} from 'react-router-dom';\n/g, '');
replace('src/pages/ProjectIntelligence.tsx', /import \{ Link \} from 'react-router-dom';\n/g, '');
replace('src/pages/Optimize.tsx', / Beaker,/g, '');
replace('src/pages/Optimize.tsx', /let stageText = "RAW DATA";\n/g, '');
replace('src/pages/Optimize.tsx', /\s*stageText = "[^"]+";\n/g, '');
replace('src/components/HowItWorks.tsx', /idx/g, '_idx'); // fix the warning
