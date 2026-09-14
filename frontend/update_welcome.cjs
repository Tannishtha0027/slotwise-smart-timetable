const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 3. Welcome Section Header Layout and Yellow Underline
const welcomeRegex = /<motion\.section[\s\S]*?className="max-w-2xl mb-20"[\s\S]*?<\/motion\.section>/;
const welcomeReplacement = `<motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 relative"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slot-yellow/20 text-slot-orange font-bold text-xs tracking-widest uppercase mb-6 border border-slot-yellow/30">
              SLOTWISE WORKSPACE
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slot-indigo tracking-tight mb-4 leading-tight relative inline-block">
              Your scheduling workspace.
              <svg className="absolute -bottom-2 left-0 w-[65%] h-3 text-[#FFC94A] pointer-events-none" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                 <path d="M2,8 Q50,2 100,6 T198,8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
               </svg>
            </h1>
            <p className="text-lg md:text-xl text-slot-charcoal/60 font-medium leading-relaxed max-w-xl mt-4">
              Create, manage, and revisit your examination timetables in one place.
            </p>
          </div>
          <Link to="/create" className="shrink-0 inline-flex items-center justify-center gap-2 bg-slot-orange text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-slot-orange/90 transition-all shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slot-orange">
            <Plus size={20} /> Create New Timetable <ArrowRight size={18} className="ml-1" />
          </Link>
        </motion.section>`;

content = content.replace(welcomeRegex, welcomeReplacement);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Updated Dashboard welcome section');
