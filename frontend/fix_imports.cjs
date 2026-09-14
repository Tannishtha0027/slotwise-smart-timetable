const fs = require('fs');

function replace(file, search, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replaceStr);
  fs.writeFileSync(file, content);
}

replace('src/services/api.ts', /import \{ CollegeData, TimetableResult \} from '\.\.\/types\/api';/g, "import type { CollegeData, TimetableResult } from '../types/api';");
replace('src/utils/sampleData.ts', /import \{ CollegeData \} from '\.\.\/types\/api';/g, "import type { CollegeData } from '../types/api';");

// Check CreateTimetable.tsx
replace('src/pages/CreateTimetable.tsx', /import \{ generateSchedule, APIError \} from '\.\.\/services\/api';/g, "import { generateSchedule, APIError } from '../services/api';");

console.log("Fixed type imports!");
