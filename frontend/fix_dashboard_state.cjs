const fs = require('fs');
const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// I need to change how PROJECTS is defined or used so it's dynamic.
// Right now it's defined as a global const PROJECTS = [...]
// We can just use a function `getProjects()` instead.
content = content.replace(
  /const PROJECTS = \[/g, 
  'const getProjects = () => ['
);
// Now we have to replace the usages of `PROJECTS.map` with `getProjects().map`
content = content.replace(/PROJECTS\.map/g, 'getProjects().map');

fs.writeFileSync(file, content);
console.log('Dashboard dynamically reads sessionStorage.');
