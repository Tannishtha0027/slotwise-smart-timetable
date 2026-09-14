const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const activityRegex = /<motion\.div[\s\S]*?className="lg:w-72 shrink-0 pt-2 lg:pt-0"[\s\S]*?<h3 className="text-\[10px\] font-extrabold tracking-widest uppercase text-slot-charcoal\/40 mb-6">[\s\S]*?Recent Activity[\s\S]*?<\/h3>/;

const activityReplacement = `<motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-[340px] shrink-0 pt-2 lg:pt-0"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Recent activity</h2>
              <p className="text-slot-charcoal/50 font-medium mt-1">Latest updates from your timetables.</p>
            </div>`;

content = content.replace(activityRegex, activityReplacement);
fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Updated activity');
