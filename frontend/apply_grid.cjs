const fs = require('fs');
const path = require('path');

const pagesToStrip = [
  'CreateTimetable.tsx',
  'SetConstraints.tsx',
  'Optimize.tsx',
  'TimetableResult.tsx',
  'VerifySchedule.tsx',
  'ProjectIntelligence.tsx',
  'Publish.tsx'
];

pagesToStrip.forEach(page => {
  const filePath = path.join(__dirname, 'src', 'pages', page);
  let content = fs.readFileSync(filePath, 'utf8');
  // Strip 'bg-slot-cream' from the root div
  content = content.replace(/className="([^"]*)bg-slot-cream([^"]*)"/g, (match, p1, p2) => {
    return `className="${p1.trim()} ${p2.trim()}".replace(/\s+/g, ' ')`;
  });
  
  // Actually, a simpler regex is just to replace ' bg-slot-cream ' or similar.
  // Let's just do a string replace since it's usually `className="min-h-screen bg-slot-cream ..."`
  let newContent = fs.readFileSync(filePath, 'utf8');
  newContent = newContent.replace(' bg-slot-cream', '');
  fs.writeFileSync(filePath, newContent);
  console.log(`Stripped bg-slot-cream from ${page}`);
});

// Create GridBackgroundLayout.tsx
const layoutContent = `import React from 'react';
import { Outlet } from 'react-router-dom';

export default function GridBackgroundLayout() {
  return (
    <div className="min-h-screen relative font-sans text-slot-charcoal bg-slot-cream selection:bg-slot-yellow/30 selection:text-slot-indigo">
      {/* Grid Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: \`
            linear-gradient(to right, rgba(39, 32, 95, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(39, 32, 95, 0.04) 1px, transparent 1px)
          \`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'GridBackgroundLayout.tsx'), layoutContent);
console.log('Created GridBackgroundLayout.tsx');

// Modify App.tsx to use Layout
let appContent = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');

// Add import
appContent = appContent.replace(
  "import Publish from './pages/Publish';",
  "import Publish from './pages/Publish';\nimport GridBackgroundLayout from './components/GridBackgroundLayout';"
);

// Group routes
const routesSearch = `<Route path="/create" element={<CreateTimetable />} />
        <Route path="/constraints" element={<SetConstraints />} />
        <Route path="/optimize" element={<Optimize />} />
        <Route path="/result" element={<TimetableResult />} />
        <Route path="/verify" element={<VerifySchedule />} />
        <Route path="/insights" element={<ProjectIntelligence />} />
        <Route path="/publish" element={<Publish />} />`;

const routesReplacement = `<Route element={<GridBackgroundLayout />}>
          <Route path="/create" element={<CreateTimetable />} />
          <Route path="/constraints" element={<SetConstraints />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/result" element={<TimetableResult />} />
          <Route path="/verify" element={<VerifySchedule />} />
          <Route path="/insights" element={<ProjectIntelligence />} />
          <Route path="/publish" element={<Publish />} />
        </Route>`;

appContent = appContent.replace(routesSearch, routesReplacement);
fs.writeFileSync(path.join(__dirname, 'src', 'App.tsx'), appContent);
console.log('Updated App.tsx routes');
