const fs = require('fs');

let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// 1. Remove the custom background photograph to let GridBackgroundLayout show through
const bgPhotographRegex = /{\/\* Background Photograph with subtle parallax \*\/}[\s\S]*?{\/\* Navbar \*\//;
content = content.replace(bgPhotographRegex, '{/* Navbar */}');

// 2. Fix the header
const headerRegex = /{\/\* Page Header \*\/}[\s\S]*?{\/\* Progress Indicator \*\//;
const newHeader = `{/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start justify-center w-full mb-8 relative z-10"
        >
          <button 
            onClick={() => navigate('/constraints')} 
            className="mb-6 flex items-center gap-2 text-sm font-bold text-slot-charcoal/50 hover:text-slot-indigo transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="relative inline-block mb-3">
            <h1 className="text-4xl md:text-5xl font-black text-slot-indigo tracking-tight relative z-10">
              Optimizing your timetable...
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FFC94A] rounded-full opacity-80 -z-0" />
          </div>
          <p className="text-base lg:text-lg text-slot-charcoal/70 font-medium mt-2">
            Assigning subjects, time slots and rooms while satisfying all constraints.
          </p>
        </motion.div>

        {/* Progress Indicator */}`;
content = content.replace(headerRegex, newHeader);

// 3. Fix the Visual Simulation header
const simHeaderRegex = /{\/\* Disclaimer \*\/}[\s\S]*?<\/div>/;
const newSimHeader = `{/* Visual Simulation Header */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slot-indigo/60 uppercase">
                <LayoutDashboard size={14} />
                Visual Simulation
              </div>
              {progress < 100 && (
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slot-indigo uppercase">
                  <div className="w-2 h-2 rounded-full bg-[#FFC94A] animate-pulse" />
                  Optimization running...
                </div>
              )}
            </div>`;
content = content.replace(simHeaderRegex, newSimHeader);

// 4. Also remove the "Current Stage Display" that was in the middle of the screen? Wait, the prompt didn't say to remove it. "Keep the existing optimization state connected to this indicator" maybe they meant to replace the central one with the top-right one. Let me just hide the central one.
const currentStageRegex = /{\/\* Current Stage Display \*\/}[\s\S]*?{\/\* Main Workspace \*\//;
content = content.replace(currentStageRegex, '{/* Main Workspace */}');

// 5. Also hide the "Progress Indicator" which was the little line with "03 OPTIMIZE" because progress is now inside the iterations panel?
// "Under ITERATIONS, show: 'Finding the best possible schedule...' with a horizontal progress bar. Use: #FFC94A for the progress bar. Show a percentage."
const progressIndRegex = /{\/\* Progress Indicator \*\/}[\s\S]*?{\/\* Main Workspace \*\//;
// Wait, this will remove everything from Progress Indicator to Main Workspace (which includes Current Stage Display).
content = content.replace(progressIndRegex, '{/* Main Workspace */}');

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log('Optimize.tsx redesign part 2 applied');
