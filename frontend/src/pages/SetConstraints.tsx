import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle2, Sliders, ChevronDown, Check } from 'lucide-react';

const SetConstraints = () => {
  const navigate = useNavigate();
  const [softConstraints, setSoftConstraints] = useState({
    backToBack: true,
    maxPerDay: '2',
    studentWorkload: 50,
    roomUtilization: true,
    facultyWorkload: true,
  });

  const handleToggle = (key: keyof typeof softConstraints) => {
    setSoftConstraints(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoftConstraints(prev => ({
      ...prev,
      studentWorkload: parseInt(e.target.value)
    }));
  };

  const hardConstraints = [
    { title: "No student exam conflicts", desc: "Students cannot be scheduled for overlapping examinations." },
    { title: "Room capacity must be sufficient", desc: "Assigned rooms must have enough seats for all registered students." },
    { title: "No room collisions", desc: "A room can host only one examination at a given time." },
    { title: "Faculty availability", desc: "Invigilators are scheduled only during their available periods." },
    { title: "Exam duration must fit", desc: "Exams must fit entirely within their allocated time block." },
    { title: "Blocked periods / holidays", desc: "No exams will be scheduled during blocked periods or holidays." },
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow w-full max-w-[1140px] mx-auto px-6 md:px-12 pt-28 pb-32">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-7 md:mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slot-indigo tracking-tight mb-4">
            Set your constraints
          </h1>
          <p className="text-lg text-slot-charcoal/70 font-medium">
            Tell Slotwise what cannot be broken — and what can be optimized.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-3 md:gap-6 text-xs font-bold tracking-widest text-slot-indigo/40 mb-10 md:mb-11 uppercase"
        >
          <div className="flex items-center gap-2 pb-1 text-slot-charcoal/40">
            <CheckCircle2 size={16} /> DATA
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="flex items-center gap-2 text-slot-indigo border-b-2 border-slot-orange pb-1">
            <span className="text-slot-orange">02</span> CONSTRAINTS
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <span>03</span> OPTIMIZE
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <span>04</span> VERIFY
          </div>
        </motion.div>

        <div className="flex flex-col gap-8 md:gap-9">
          
          {/* HARD CONSTRAINTS SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4 md:mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slot-indigo mb-2 flex items-center gap-3">
                  <span className="text-slot-charcoal/30 font-bold text-xl md:text-2xl">01</span> HARD CONSTRAINTS
                </h2>
                <p className="text-slot-charcoal/70 font-medium text-base">These rules are mandatory. Slotwise will never violate them.</p>
              </div>
              <div className="text-sm font-bold text-slot-indigo bg-slot-indigo/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-slot-indigo/10 shrink-0">
                <Lock size={14} />
                Non-negotiable
              </div>
            </div>

            <div className="bg-white border border-slot-indigo/10 rounded-2xl overflow-hidden shadow-sm">
              {hardConstraints.map((constraint, idx) => (
                <div key={idx} className={`px-6 md:px-8 py-5 md:py-6 flex items-start gap-4 md:gap-6 ${idx !== hardConstraints.length - 1 ? 'border-b border-slot-indigo/5' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-slot-indigo/5 flex items-center justify-center shrink-0 mt-0.5 text-slot-indigo">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-extrabold text-slot-indigo mb-1.5 text-lg">{constraint.title}</h4>
                    <p className="text-base text-slot-charcoal/70 font-medium leading-relaxed">{constraint.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* SOFT CONSTRAINTS SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-4 md:mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slot-indigo mb-2 flex items-center gap-3">
                  <span className="text-slot-charcoal/30 font-bold text-xl md:text-2xl">02</span> SCHEDULING PREFERENCES
                </h2>
                <p className="text-slot-charcoal/70 font-medium text-base">These preferences improve timetable quality without overriding mandatory rules.</p>
              </div>
              <div className="text-xs font-bold text-slot-orange/90 bg-transparent px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-slot-orange/20 shrink-0">
                <Sliders size={13} />
                Affects quality score
              </div>
            </div>

            <div className="bg-white w-full border border-slot-orange/20 rounded-2xl shadow-sm flex flex-col">
              
              {/* Avoid back-to-back exams */}
              <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-slot-cream/30 transition-colors border-b border-slot-indigo/5">
                <div className="flex-grow pr-4 md:pr-8">
                  <h4 className="font-extrabold text-slot-indigo mb-1.5 text-base md:text-lg">Avoid back-to-back exams</h4>
                  <p className="text-sm md:text-base leading-snug text-slot-charcoal/60 font-medium">Minimize consecutive exams for the same student group.</p>
                </div>
                <div className="shrink-0 flex items-center md:justify-end w-full md:w-48 mt-2 md:mt-0">
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={softConstraints.backToBack}
                    onClick={() => handleToggle('backToBack')}
                    className={`relative inline-flex items-center h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slot-orange focus-visible:ring-offset-2 ${softConstraints.backToBack ? 'bg-slot-orange' : 'bg-slot-indigo/15'}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${softConstraints.backToBack ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Limit exams per day */}
              <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-slot-cream/30 transition-colors border-b border-slot-indigo/5">
                <div className="flex-grow pr-4 md:pr-8">
                  <h4 className="font-extrabold text-slot-indigo mb-1.5 text-base md:text-lg">Limit exams per day</h4>
                  <p className="text-sm md:text-base leading-snug text-slot-charcoal/60 font-medium">Set the maximum number of exams a student can have in one day.</p>
                </div>
                <div className="shrink-0 flex items-center md:justify-end w-full md:w-48 mt-2 md:mt-0">
                  <div className="relative w-full max-w-xs md:w-24 shrink-0">
                    <select 
                      value={softConstraints.maxPerDay}
                      onChange={(e) => setSoftConstraints(prev => ({ ...prev, maxPerDay: e.target.value }))}
                      className="w-full appearance-none bg-slot-cream border border-slot-indigo/10 rounded-lg pl-4 pr-9 py-2 text-slot-indigo font-bold focus:outline-none focus:ring-2 focus:ring-slot-orange/50 cursor-pointer text-base"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slot-indigo/60">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance student workload (Slider) */}
              <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-slot-cream/30 transition-colors border-b border-slot-indigo/5">
                <div className="flex-grow pr-4 md:pr-8">
                  <h4 className="font-extrabold text-slot-indigo mb-1.5 text-base md:text-lg">Balance student workload</h4>
                  <p className="text-sm md:text-base leading-snug text-slot-charcoal/60 font-medium">Prioritize even spacing of exams throughout the exam period.</p>
                </div>
                <div className="shrink-0 flex items-center md:justify-end w-full md:w-48 mt-2 md:mt-0">
                  <div className="flex items-center gap-3 w-full max-w-xs md:w-48">
                    <span className="text-[11px] font-bold text-slot-charcoal/40">LOW</span>
                    <div className="flex-grow relative h-1.5 bg-slot-indigo/10 rounded-full flex items-center">
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={softConstraints.studentWorkload} 
                        onChange={handleSlider}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="absolute h-full bg-slot-orange rounded-full pointer-events-none" style={{ width: `${softConstraints.studentWorkload}%` }} />
                      <div 
                        className="w-4 h-4 bg-white border-2 border-slot-orange rounded-full absolute -ml-2 pointer-events-none shadow-sm transition-transform"
                        style={{ left: `${softConstraints.studentWorkload}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slot-orange">HIGH</span>
                  </div>
                </div>
              </div>

              {/* Optimize room utilization */}
              <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-slot-cream/30 transition-colors border-b border-slot-indigo/5">
                <div className="flex-grow pr-4 md:pr-8">
                  <h4 className="font-extrabold text-slot-indigo mb-1.5 text-base md:text-lg">Optimize room utilization</h4>
                  <p className="text-sm md:text-base leading-snug text-slot-charcoal/60 font-medium">Prefer assigning exams to rooms that closely match their capacity.</p>
                </div>
                <div className="shrink-0 flex items-center md:justify-end w-full md:w-48 mt-2 md:mt-0">
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={softConstraints.roomUtilization}
                    onClick={() => handleToggle('roomUtilization')}
                    className={`relative inline-flex items-center h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slot-orange focus-visible:ring-offset-2 ${softConstraints.roomUtilization ? 'bg-slot-orange' : 'bg-slot-indigo/15'}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${softConstraints.roomUtilization ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Balance faculty workload */}
              <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-slot-cream/30 transition-colors">
                <div className="flex-grow pr-4 md:pr-8">
                  <h4 className="font-extrabold text-slot-indigo mb-1.5 text-base md:text-lg">Balance faculty workload</h4>
                  <p className="text-sm md:text-base leading-snug text-slot-charcoal/60 font-medium">Distribute invigilation duties evenly across available faculty.</p>
                </div>
                <div className="shrink-0 flex items-center md:justify-end w-full md:w-48 mt-2 md:mt-0">
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={softConstraints.facultyWorkload}
                    onClick={() => handleToggle('facultyWorkload')}
                    className={`relative inline-flex items-center h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slot-orange focus-visible:ring-offset-2 ${softConstraints.facultyWorkload ? 'bg-slot-orange' : 'bg-slot-indigo/15'}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${softConstraints.facultyWorkload ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

            </div>
          </motion.section>
        </div>

        {/* Action Area */}
        <div className="mt-8 w-full flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button 
              onClick={() => navigate('/optimize')}
              className="bg-slot-orange text-white hover:bg-slot-orange/90 shadow-paper-hover hover:-translate-y-0.5 px-6 h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default SetConstraints;
