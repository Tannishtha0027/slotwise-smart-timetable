const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Remove LeafDecoration component
content = content.replace(/const LeafDecoration[\s\S]*?\/\/ --- DATA ---/, '// --- DATA ---');

// 2. Remove LeafDecoration elements
content = content.replace(/\{\/\*\s*Decorative Fixed Leaves\s*\*\/\}[\s\S]*?<div className="relative z-10 flex flex-col flex-grow">/, '<div className="relative z-10 flex flex-col flex-grow">');

// 3. Welcome Section Header Layout and Yellow Underline
const welcomeSearch = `<motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slot-yellow/20 text-slot-orange font-bold text-xs tracking-widest uppercase mb-6 border border-slot-yellow/30">
            Slotwise Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slot-indigo tracking-tight mb-4 leading-tight">
            Your scheduling workspace.
          </h1>
          <p className="text-lg md:text-xl text-slot-charcoal/60 font-medium mb-10 leading-relaxed max-w-xl">
            Create, manage, and revisit your examination timetables in one place.
          </p>
          <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-slot-orange text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-slot-orange/90 transition-all shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slot-orange">
            <Plus size={20} /> Create New Timetable <ArrowRight size={18} className="ml-1" />
          </Link>
        </motion.section>`;

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

content = content.replace(welcomeSearch, welcomeReplacement);

// 4. Timetable Cards Layout
const cardSearch = `<div 
                      onClick={() => navigate(project.actionRoute)}
                      className="bg-white border border-slot-indigo/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-slot-indigo/20"
                    >
                      {/* Left colored accent bar on hover */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slot-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex flex-col">
                        <h3 className="text-xl font-extrabold text-slot-indigo mb-2 group-hover:text-slot-orange transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slot-charcoal/50">
                          <span className="flex items-center gap-1.5 text-slot-charcoal/70">
                            <Calendar size={14} /> {project.metadata}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slot-charcoal/20"></span>
                          <span>Updated {project.updated}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center gap-4 lg:gap-8 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-slot-indigo/5 md:border-0 justify-between md:justify-end">
                        <StatusBadge status={project.status} />
                        <span className="text-slot-orange font-bold text-sm flex items-center gap-1 group-hover:text-slot-orange/80 transition-colors shrink-0">
                          {project.actionText} <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>`;

const cardReplacement = `<div 
                      onClick={() => navigate(project.actionRoute)}
                      className="bg-white border border-slot-indigo/10 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-slot-indigo/20"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slot-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="hidden lg:flex items-center justify-center w-14 h-14 rounded-2xl bg-slot-indigo/5 text-slot-indigo shrink-0">
                        <Calendar size={28} strokeWidth={2} />
                      </div>
                      
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-xl font-extrabold text-slot-indigo mb-1 group-hover:text-slot-orange transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-sm font-bold text-slot-charcoal/50">
                          {project.metadata}
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-12 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slot-indigo/5 lg:border-0 shrink-0">
                        
                        <div className="flex flex-col items-start lg:items-start gap-1 w-32">
                          <StatusBadge status={project.status} />
                          <span className="text-xs font-bold text-slot-charcoal/40 mt-1">Updated {project.updated}</span>
                        </div>
                        
                        <span className="text-slot-orange font-bold text-sm flex items-center gap-1 group-hover:text-slot-orange/80 transition-colors shrink-0 w-32 justify-start lg:justify-end">
                          {project.actionText} <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>`;

content = content.replace(cardSearch, cardReplacement);

// 5. Recent Activity Update
const activitySearch = `<motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-72 shrink-0 pt-2 lg:pt-0"
          >
            <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-slot-charcoal/40 mb-6">
              Recent Activity
            </h3>`;

const activityReplacement = `<motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-80 shrink-0 pt-2 lg:pt-0"
          >
            <div className="mb-8">
              <h2 className="text-xl font-extrabold text-slot-indigo tracking-tight">Recent activity</h2>
              <p className="text-sm text-slot-charcoal/50 font-medium mt-1">Latest updates from your timetables.</p>
            </div>`;

content = content.replace(activitySearch, activityReplacement);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Updated Dashboard layout');
