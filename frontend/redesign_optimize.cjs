const fs = require('fs');

let content = fs.readFileSync('src/pages/Optimize.tsx', 'utf8');

// 1. Update the Header Section
const oldHeaderRegex = /<div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-12">[\s\S]*?<\/div>/;
const newHeader = `<div className="flex flex-col items-start justify-center w-full mb-8 relative">
            <button 
              onClick={() => navigate(-1)} 
              className="mb-6 flex items-center gap-2 text-sm font-bold text-slot-charcoal/50 hover:text-slot-indigo transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="relative inline-block mb-3">
              <h1 className="text-4xl lg:text-5xl font-black text-slot-indigo tracking-tight relative z-10">
                Optimizing your timetable...
              </h1>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#FFC94A] rounded-full opacity-60 -z-0 translate-y-1/2" />
            </div>
            <p className="text-base lg:text-lg font-medium text-slot-charcoal/60 mt-2">
              Assigning subjects, time slots and rooms while satisfying all constraints.
            </p>
          </div>`;
content = content.replace(oldHeaderRegex, newHeader);


// 2. Update the Large Visual Simulation Panel (Background)
const oldSimPanel = `<div className="flex-grow bg-[#F1EBDD] border border-[#E5DED0] rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-6 items-center justify-center">`;
const newSimPanel = `<div className="flex-grow border border-slot-indigo/10 rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-8 items-center justify-center shadow-sm bg-cover bg-center" style={{ backgroundImage: "url('/images/paper.jpg')" }}>
              <div className="absolute inset-0 bg-[#F7F3EA]/80 z-0" />
              
              <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--slot-indigo) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />`;

// First remove the old inner grid to prevent duplication
content = content.replace(/<div className="absolute inset-0 opacity-\[0\.03\] pointer-events-none" style={{ backgroundImage:\s*'radial-gradient\(var\(--slot-indigo\) 1px, transparent 1px\)', backgroundSize: '24px 24px' }} \/>/, '');
content = content.replace(oldSimPanel, newSimPanel);


// 3. Update the Visual Simulation Header inside the panel
const oldSimHeader = `<div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slot-charcoal/40 uppercase">
                <LayoutDashboard size={12} />
                Visual Simulation
              </div>`;
const newSimHeader = `<div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
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
// Just in case LayoutDashboard is missing, check if it's imported (wait, LayoutDashboard was already there in oldSimHeader).
content = content.replace(oldSimHeader, newSimHeader);


// 4. Update the Schedule Containers (slots)
const oldSlotMap = `<div className="absolute text-[10px] font-bold text-slot-charcoal/30 -top-5 left-0">`;
const newSlotMap = `<div className="absolute text-[10px] font-bold text-slot-charcoal/40 -top-5 left-0">`;
content = content.replace(/<div className="absolute text-\[10px\] font-bold text-slot-charcoal\/30 -top-5 left-0">/g, newSlotMap);

const oldSlotBorder = `className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-slot-indigo/10 rounded-2xl flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all duration-300"`;
const newSlotBorder = `className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-slot-charcoal/15 rounded-2xl flex items-center justify-center transition-all duration-300"`;
content = content.replace(oldSlotBorder, newSlotBorder);


// 5. Progress Bar in Metrics Panel
// Right Panel background update was #FFF7D9, need #F0EEFA now
const rightSearch = `className="w-full lg:w-[320px] shrink-0 bg-[#FFF7D9] border border-[#EBE3C5] rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit"`;
const rightReplace = `className="w-full lg:w-[320px] shrink-0 bg-[#F0EEFA] border border-slot-indigo/10 rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit relative z-10"`;
content = content.replace(rightSearch, rightReplace);

// Inject Progress Bar under Iterations
const iterationsBlock = `<div>
              <div className="text-[10px] font-bold text-slot-charcoal/40 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Iterations</span>
                {progress < 100 && <Activity size={12} className="text-slot-orange animate-pulse" />}
              </div>
              <div className="text-3xl font-mono font-extrabold text-slot-indigo tabular-nums">
                {iteration.toLocaleString().padStart(5, '0')}
              </div>
            </div>`;

const newIterationsBlock = `<div>
              <div className="text-[10px] font-bold text-slot-charcoal/40 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Iterations</span>
                {progress < 100 && <Activity size={12} className="text-slot-orange animate-pulse" />}
              </div>
              <div className="text-3xl font-mono font-extrabold text-slot-indigo tabular-nums mb-4">
                {iteration.toLocaleString().padStart(5, '0')}
              </div>
              
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slot-indigo uppercase">
                  <span>Finding the best possible schedule...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFC94A] transition-all duration-100 ease-out" style={{ width: \`\${progress}%\` }} />
                </div>
              </div>
            </div>`;
content = content.replace(iterationsBlock, newIterationsBlock);


// Make sure subject cards have Z-index so they appear above the overlay
// The old subject cards have `bg-[#FFC94A] border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full`
content = content.replace(/className=\{`bg-\[\#FFC94A\] border shadow-sm rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full /g, "className={`bg-[#FFC94A] border shadow-md rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full relative z-10 ");

// Ensure the floating UI elements (like current stage display) have z-10
content = content.replace(/className="absolute top-6 right-6 z-10"/g, 'className="absolute top-12 right-6 z-20"'); 

// Actually, wait, the Optimizer Circle in center needs relative z-10 too.
content = content.replace(/className="w-32 h-32 rounded-full border-2 border-slot-indigo\/10 bg-white flex flex-col items-center justify-center shadow-sm z-10"/g, 'className="w-32 h-32 rounded-full border border-slot-indigo/10 bg-[#F7F3EA] flex flex-col items-center justify-center shadow-md relative z-10"');

// Fix LayoutDashboard import if missing
if (!content.includes('LayoutDashboard')) {
    content = content.replace('import { CheckCircle2, ArrowLeft', 'import { CheckCircle2, ArrowLeft, LayoutDashboard');
}

fs.writeFileSync('src/pages/Optimize.tsx', content);
console.log('Optimize.tsx full visual redesign applied');
