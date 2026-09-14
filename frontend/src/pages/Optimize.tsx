import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, LayoutDashboard, Check, ArrowRight, Activity, Zap, Layers, Users, MapPin, UserCircle, Beaker } from 'lucide-react';

const examData = [
  { id: 'e1', name: 'DSA', room: 'Room 201', faculty: 'Fac 04', type: 'Core' },
  { id: 'e2', name: 'DBMS', room: 'Room 204', faculty: 'Fac 07', type: 'Core' },
  { id: 'e3', name: 'OS', room: 'Room 102', faculty: 'Fac 12', type: 'Core' },
  { id: 'e4', name: 'NET', room: 'Room 305', faculty: 'Fac 02', type: 'Elective' },
  { id: 'e5', name: 'AI', room: 'Room 110', faculty: 'Fac 09', type: 'Elective' },
];

const slots = [
  { day: 'MON', time: '9:00 AM' },
  { day: 'MON', time: '2:00 PM' },
  { day: 'TUE', time: '9:00 AM' },
  { day: 'TUE', time: '2:00 PM' },
  { day: 'WED', time: '9:00 AM' },
];

const iconMap = {
  'EXAMS': <Layers size={14} />,
  'STUDENTS': <Users size={14} />,
  'ROOMS': <MapPin size={14} />,
  'FACULTY': <UserCircle size={14} />
};

export default function Optimize() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  
  // Auto-progress from 0 to 100
  const [progress, setProgress] = useState(0);

  // Simulation Loop - smooth auto progression
  useEffect(() => {
    if (progress >= 100) return;
    const interval = setInterval(() => {
      setProgress(p => Math.min(100, p + 0.5)); // 0.5 every 50ms = 1 per 100ms = 10s total
    }, 50);
    return () => clearInterval(interval);
  }, [progress]);

  // Calculated state
  const iteration = Math.floor(progress * progress * 1.5);
  const qualityScore = progress < 70 ? null : Math.floor(72 + (progress - 70) * (23 / 30));
  
  let stageText = "RAW DATA";
  if (progress >= 15 && progress < 30) { stageText = "CONFLICT MAPPING"; }
  else if (progress >= 30 && progress < 55) { stageText = "REARRANGING"; }
  else if (progress >= 55 && progress < 65) { stageText = "ROOM ASSIGNMENT"; }
  else if (progress >= 65 && progress < 75) { stageText = "FACULTY ASSIGNMENT"; }
  else if (progress >= 75 && progress < 100) { stageText = "QUALITY IMPROVEMENT"; }
  else if (progress >= 100) { stageText = "OPTIMIZED SCHEDULE"; }

  // Positions logic for Grid Shuffle
  const getScrambledPositions = (p: number) => {
    if (p < 36) return [1, 4, 0, 2, 3];
    if (p < 43) return [4, 1, 2, 0, 3];
    if (p < 50) return [2, 0, 1, 4, 3];
    return [0, 1, 2, 3, 4]; // Final settles slightly before allocating
  };
  const positions = getScrambledPositions(progress);

  // Search ghost logic
  // Render brief faded versions of elements in empty slots to show "searching"
  const showGhosts = progress >= 32 && progress < 48;
  const ghostSlot1 = progress % 10 < 5 ? 3 : 0;
  const ghostSlot2 = progress % 8 < 4 ? 4 : 1;

  const spring = { type: shouldReduceMotion ? "tween" : "spring", duration: shouldReduceMotion ? 0 : undefined, stiffness: 200, damping: 20 };

  return (
    <div className="min-h-screen font-sans flex flex-col overflow-x-hidden relative">
      
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow w-full max-w-[1140px] mx-auto px-6 md:px-12 pt-28 pb-32 relative z-10">
        
        {/* Page Header */}
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
            <div 
              className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FFC94A] opacity-80 -z-0"
              style={{
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                transform: 'rotate(-0.5deg)'
              }} 
            />
          </div>
          <p className="text-base lg:text-lg text-slot-charcoal/70 font-medium mt-2">
            Assigning subjects, time slots and rooms while satisfying all constraints.
          </p>
        </motion.div>

        {/* Main Workspace */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Visual Simulation Area */}
          <div className="flex-grow border border-slot-indigo/10 rounded-3xl relative min-h-[450px] lg:min-h-[550px] overflow-hidden flex flex-col p-8 items-center justify-center shadow-sm bg-cover bg-center" style={{ backgroundImage: "url('/images/paper.jpg')" }}>
              <div className="absolute inset-0 bg-[#F7F3EA]/80 z-0" />
              
              <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--slot-indigo) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Background Grid Pattern (Subtle) */}
            
            
            {/* Visual Simulation Header */}
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
            </div>

            {/* STAGE 1: Data Stream */}
            <AnimatePresence>
              {progress < 15 && (
                <motion.div 
                  initial={{ opacity: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-full max-w-lg max-h-lg flex items-center justify-center">
                    
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], boxShadow: ['0px 0px 0px rgba(39,32,95,0)', '0px 0px 30px rgba(39,32,95,0.1)', '0px 0px 0px rgba(39,32,95,0)'] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-32 h-32 rounded-full border border-slot-indigo/10 bg-[#F7F3EA] flex flex-col items-center justify-center shadow-md relative z-10"
                    >
                      <div className="w-24 h-24 rounded-full bg-slot-indigo text-slot-cream flex flex-col items-center justify-center shadow-xl">
                        <Zap size={24} className="mb-1" />
                        <span className="text-[10px] font-extrabold tracking-widest text-center leading-tight">SLOTWISE<br/>OPTIMIZER</span>
                      </div>
                    </motion.div>

                    {['EXAMS', 'STUDENTS', 'ROOMS', 'FACULTY'].map((label, idx) => {
                      const pos = [
                        { top: '15%', left: '15%' },
                        { top: '15%', right: '15%' },
                        { bottom: '15%', left: '15%' },
                        { bottom: '15%', right: '15%' }
                      ][idx];
                      
                      return (
                        <motion.div
                          key={label}
                          initial={{ ...pos, opacity: 0 }}
                          animate={{ 
                            top: progress > 2 ? '50%' : pos.top, 
                            left: progress > 2 ? (pos.left ? '50%' : 'auto') : pos.left,
                            right: progress > 2 ? (pos.right ? '50%' : 'auto') : pos.right,
                            bottom: progress > 2 ? 'auto' : pos.bottom,
                            opacity: progress > 2 ? 0 : 1,
                            scale: progress > 2 ? 0.5 : 1,
                            translateX: progress > 2 ? (pos.left ? '-50%' : '50%') : '0%',
                            translateY: progress > 2 ? (pos.top ? '-50%' : '50%') : '0%',
                          }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="absolute bg-white px-3 py-2 rounded-full border border-slot-indigo/10 shadow-sm text-xs font-extrabold text-slot-indigo flex items-center gap-2 whitespace-nowrap"
                        >
                          <span className="text-slot-orange">{iconMap[label as keyof typeof iconMap]}</span> {label}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 2: Graph & Grid */}
            {(progress >= 15) && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                
                {/* Grid Background (Appears at 30) */}
                <AnimatePresence>
                  {progress >= 30 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      className="absolute inset-0 flex flex-col items-center justify-center w-full max-w-3xl"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full px-2 sm:px-4">
                        {slots.map((slot, index) => (
                          <div key={index} className="h-28 md:h-32 border-2 border-dashed border-slot-indigo/10 rounded-2xl bg-slot-cream/30 p-2 sm:p-3 flex flex-col relative overflow-hidden">
                            <span className="text-[10px] font-extrabold text-slot-indigo/40 tracking-wider mb-2">{slot.day} • {slot.time}</span>
                            {/* Drop zone for blocks */}
                            <div className="flex-grow w-full h-full relative" />
                            
                            {/* Search Ghosts (Visual metaphor for searching) */}
                            {showGhosts && (index === ghostSlot1 || index === ghostSlot2) && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="absolute top-8 left-2 right-2 bottom-2 bg-slot-indigo/10 border border-slot-indigo/20 rounded-xl"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Graph SVG Lines (Visible 15-30) */}
                <AnimatePresence>
                  {progress >= 15 && progress < 30 && (
                    <motion.svg 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute w-[340px] h-[340px] pointer-events-none hidden sm:block"
                    >
                      {examData.map((_, i) => {
                        return examData.map((_, j) => {
                          if (i >= j) return null;
                          const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
                          const a2 = (j / 5) * Math.PI * 2 - Math.PI / 2;
                          const r = 120;
                          const x1 = 170 + Math.cos(a1) * r;
                          const y1 = 170 + Math.sin(a1) * r;
                          const x2 = 170 + Math.cos(a2) * r;
                          const y2 = 170 + Math.sin(a2) * r;
                          
                          // Simulate conflict highlight (20-25)
                          const isConflict = progress >= 20 && progress < 25 && ((i === 0 && j === 2) || (i === 1 && j === 4));
                          
                          return (
                            <motion.line 
                              key={`${i}-${j}`}
                              x1={x1} y1={y1} x2={x2} y2={y2}
                              stroke={isConflict ? 'var(--slot-orange)' : 'var(--slot-indigo)'}
                              strokeWidth={isConflict ? 3 : 1}
                              strokeOpacity={isConflict ? 1 : 0.15}
                              animate={{ strokeWidth: isConflict ? 3 : 1, strokeOpacity: isConflict ? 1 : 0.15 }}
                              transition={{ duration: 0.3 }}
                            />
                          );
                        });
                      })}
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* The Exam Blocks */}
                <div className={progress < 30 ? "relative w-[340px] h-[340px] hidden sm:block" : "absolute inset-0 flex flex-col items-center justify-center w-full max-w-3xl pointer-events-none"}>
                  <div className={progress >= 30 ? "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full px-2 sm:px-4 h-[240px] md:h-[272px]" : "w-full h-full"}>
                    {examData.map((exam, i) => {
                      let style: any = {};
                      let slotIndex = -1;
                      
                      if (progress < 30) {
                        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                        style = { 
                          position: 'absolute',
                          top: `calc(50% + ${Math.sin(angle) * 120}px - 28px)`, 
                          left: `calc(50% + ${Math.cos(angle) * 120}px - 44px)`,
                          width: '88px',
                          margin: 0
                        };
                      } else {
                        slotIndex = positions.indexOf(i);
                      }

                      return (
                        <div key={exam.id} style={progress < 30 ? style : {}} className={progress >= 30 && slotIndex !== -1 ? "relative w-full h-full p-2 sm:p-3 pointer-events-auto" : "pointer-events-auto z-10"}>
                          <motion.div
                            layout={!shouldReduceMotion}
                            transition={spring}
                            className={`bg-[#FFC94A] border shadow-md rounded-xl p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full relative z-10 ${progress >= 20 && progress < 25 && (i === 0 || i === 2 || i === 1 || i === 4) ? 'border-slot-orange shadow-slot-orange/20' : 'border-[#EBA834]/40'}`}
                            style={progress >= 30 ? { position: 'absolute', top: '32px', left: '8px', width: 'calc(100% - 16px)' } : {}}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slot-indigo text-xs sm:text-sm">{exam.name}</span>
                              <div className="w-2 h-2 rounded-full bg-slot-orange/40" />
                            </div>
                            
                            {/* Allocations */}
                            <div className="flex flex-col gap-1 overflow-hidden">
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: progress >= 55 ? 1 : 0, height: progress >= 55 ? 'auto' : 0 }}
                                className="bg-slot-cream rounded px-1.5 py-0.5 text-[9px] font-bold text-slot-charcoal/60 flex items-center justify-between"
                              >
                                <span className="truncate">{exam.room}</span>
                                {progress >= 60 && <Check size={10} className="text-emerald-500 shrink-0 ml-1" />}
                              </motion.div>
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: progress >= 65 ? 1 : 0, height: progress >= 65 ? 'auto' : 0 }}
                                className="bg-slot-indigo/5 rounded px-1.5 py-0.5 text-[9px] font-bold text-slot-indigo flex items-center justify-between"
                              >
                                <span className="truncate">{exam.faculty}</span>
                                {progress >= 70 && <Check size={10} className="text-emerald-500 shrink-0 ml-1" />}
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Fallback for Graph phase */}
                {progress >= 15 && progress < 30 && (
                  <div className="sm:hidden text-slot-indigo flex flex-col items-center">
                    <Activity size={32} className="text-slot-orange animate-pulse mb-4" />
                    <span className="text-xs font-bold tracking-widest text-slot-charcoal/40 uppercase">Mapping Conflicts</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Final Lock-in Overlay */}
            <AnimatePresence>
              {progress >= 100 && (
                <motion.div 
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                  className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-20"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="bg-white border border-slot-indigo/10 shadow-xl rounded-3xl p-8 flex flex-col items-center text-center max-w-sm mx-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slot-indigo mb-2 uppercase tracking-wide">Schedule optimized</h3>
                    <p className="text-slot-charcoal/60 font-medium text-sm mb-8">
                      Ready for independent verification.
                    </p>
                    <button 
                      onClick={() => navigate('/result')}
                      className="w-full bg-slot-orange text-white hover:bg-slot-orange/90 shadow-md hover:-translate-y-0.5 h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
                    >
                      View timetable
                      <ArrowRight size={18} />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Sidebar Stats Area */}
          <div className="w-full lg:w-[320px] shrink-0 bg-[#F0EEFA] border border-slot-indigo/10 rounded-3xl shadow-sm p-6 flex flex-col gap-8 h-fit relative z-10">
            
            {/* Iterations */}
            <div>
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
                  <div className="h-full bg-[#FFC94A] transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Quality Score */}
            <div>
              <div className="text-[10px] font-bold text-slot-charcoal/40 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Quality Score</span>
              </div>
              <div className="text-4xl font-extrabold text-slot-orange tabular-nums flex items-end gap-2">
                {qualityScore === null ? <span className="text-slot-indigo/20">--</span> : qualityScore}
                {qualityScore !== null && <span className="text-sm font-bold text-slot-charcoal/40 mb-1">/ 100</span>}
              </div>
            </div>

            <div className="w-full h-px bg-slot-indigo/5" />

            {/* Constraint Checks */}
            <div>
              <div className="text-[10px] font-bold text-slot-charcoal/40 uppercase tracking-widest mb-4">
                Mandatory Constraints
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'No student conflicts', t: 75 },
                  { label: 'Room capacity', t: 80 },
                  { label: 'No room collisions', t: 85 },
                  { label: 'Faculty availability', t: 90 },
                  { label: 'Exam duration', t: 95 },
                ].map((c, i) => {
                  const passed = progress >= c.t;
                  return (
                    <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${passed ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slot-indigo/5 text-slot-indigo/20'}`}>
                        {passed ? <Check size={12} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-current opacity-60" />}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${passed ? 'text-slot-indigo' : 'text-slot-charcoal/50'}`}>
                        {c.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
