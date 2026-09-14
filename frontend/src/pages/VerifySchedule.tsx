import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ArrowRight, ShieldCheck, Activity, Loader2, XCircle, AlertTriangle } from 'lucide-react';
import type { TimetableResult, Violation } from '../types/api';

const STEPS = [
  {
    id: 1,
    checkingTitle: 'Checking student conflicts...',
    title: 'No student conflicts',
    failedTitle: 'Student conflicts detected',
    subtitle: 'Every student has at most one exam in each time slot.',
    failedSubtitle: 'Overlapping examinations found for individual students.',
    detail: 'Slotwise compared student exam assignments across all time slots and found no overlapping examinations for any individual student.',
    violationKeys: ['STUDENT_CONFLICT']
  },
  {
    id: 2,
    checkingTitle: 'Checking room capacity...',
    title: 'Room capacity verified',
    failedTitle: 'Room capacity exceeded',
    subtitle: 'Every assigned room can accommodate the students taking the exam.',
    failedSubtitle: 'Number of registered students exceeds maximum seating capacity.',
    detail: 'The number of registered students was verified against the maximum seating capacity of each assigned room. No capacity limits were exceeded.',
    violationKeys: ['ROOM_CAPACITY']
  },
  {
    id: 3,
    checkingTitle: 'Checking room collisions...',
    title: 'No room collisions',
    failedTitle: 'Room collisions detected',
    subtitle: 'No room is assigned to multiple exams at the same time.',
    failedSubtitle: 'Multiple exams are assigned to the same room concurrently.',
    detail: 'Each room operates a single examination per time slot, ensuring no spatial conflicts occur during the exam period.',
    violationKeys: ['ROOM_COLLISION', 'ROOM_UNAVAILABLE', 'INVALID_ROOM']
  },
  {
    id: 4,
    checkingTitle: 'Checking faculty availability...',
    title: 'Faculty availability verified',
    failedTitle: 'Faculty conflicts detected',
    subtitle: 'All assigned faculty are available during their invigilation periods.',
    failedSubtitle: 'Faculty double-booked or assigned during blackout periods.',
    detail: 'Faculty schedules were cross-referenced to ensure no professor is double-booked or assigned during their designated blackout periods.',
    violationKeys: ['FACULTY_UNAVAILABLE', 'FACULTY_DOUBLE_BOOKED', 'INVALID_FACULTY']
  },
  {
    id: 5,
    checkingTitle: 'Checking invigilator counts...',
    title: 'Invigilator counts matched',
    failedTitle: 'Invigilator shortage',
    subtitle: 'Every exam has the required number of invigilators.',
    failedSubtitle: 'Required invigilator ratios were not met.',
    detail: 'Required invigilator ratios (e.g., 1 per 30 students) were calculated and successfully met for every scheduled examination room.',
    violationKeys: ['INVIGILATOR_COUNT', 'MISSING_ASSIGNMENT', 'EXTRA_ASSIGNMENT', 'INVALID_TIME_SLOT']
  },
];

export default function VerifySchedule() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<TimetableResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('realTimetableResult');
      if (stored) {
        setResult(JSON.parse(stored) as TimetableResult);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const isValid = result?.validation?.is_valid ?? false;
  const violations = result?.validation?.violations || [];

  const getViolationsForStep = (step: typeof STEPS[0]): Violation[] => {
    return violations.filter(v => step.violationKeys.includes(v.type));
  };

  // Verification sequence animation (presentation only)
  useEffect(() => {
    if (!result) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    
    if (activeStep < STEPS.length * 2) {
      timeout = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, activeStep % 2 === 0 ? 1200 : 800);
    } else if (activeStep === STEPS.length * 2) {
      timeout = setTimeout(() => {
        setShowModal(true);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [activeStep, result]);

  if (loading) return null;

  if (!result) {
    return (
      <div className="min-h-screen bg-slot-cream text-slot-charcoal font-sans flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slot-indigo/10 text-center max-w-md">
          <h2 className="text-2xl font-extrabold text-slot-indigo mb-4">No Timetable Found</h2>
          <p className="text-slot-charcoal/60 mb-8 font-medium leading-relaxed">
            We couldn't find a timetable to verify. Please generate one first.
          </p>
          <button 
            onClick={() => navigate('/create')}
            className="bg-slot-orange text-white px-8 py-4 rounded-xl font-bold w-full hover:bg-slot-orange/90 transition-colors shadow-paper-hover hover:-translate-y-0.5"
          >
            Go to Create Timetable
          </button>
        </div>
      </div>
    );
  }

  const numExams = Object.keys(result.assignments || {}).length;
  // Compute unique rooms and faculty from assignments
  const uniqueRooms = new Set();
  const uniqueFaculty = new Set();
  Object.values(result.assignments || {}).forEach(a => {
    if (a.room_id) uniqueRooms.add(a.room_id);
    a.faculty_ids.forEach(f => uniqueFaculty.add(f));
  });

  return (
    <div className="min-h-screen bg-slot-cream text-slot-charcoal font-sans selection:bg-slot-indigo selection:text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col z-10 relative">
        
        {/* Header */}
        <section className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="bg-slot-indigo/5 text-slot-indigo px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Activity size={14} className="text-slot-orange" />
              Automated Validation
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slot-indigo tracking-tight mb-4"
          >
            Verifying Schedule
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slot-charcoal/60 font-medium text-lg max-w-xl"
          >
            Running final independent checks on the generated assignments to guarantee zero conflicts.
          </motion.p>
        </section>

        {/* The Verification List */}
        <section className="w-full relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slot-indigo/5 hidden sm:block" />
          
          <div className="flex flex-col gap-6">
            {STEPS.map((step, index) => {
              const stepIndex = index * 2;
              const isWaiting = activeStep < stepIndex;
              const isChecking = activeStep === stepIndex;
              const isSettled = activeStep > stepIndex;
              
              const stepViolations = getViolationsForStep(step);
              const hasFailed = isSettled && stepViolations.length > 0;
              const isSuccess = isSettled && !hasFailed;
              
              const isExpanded = expandedId === step.id;

              return (
                <div key={step.id} className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={{ 
                      opacity: isWaiting ? 0.3 : 1,
                      x: isWaiting ? -10 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white border ${
                      isChecking 
                        ? 'border-slot-orange shadow-md' 
                        : hasFailed
                        ? 'border-red-200'
                        : isSettled
                        ? 'border-emerald-200 shadow-sm'
                        : 'border-slot-indigo/5'
                    } rounded-3xl p-6 md:p-8 flex flex-col cursor-pointer transition-all duration-300 group`}
                    onClick={() => {
                      if (isSettled) {
                        setExpandedId(isExpanded ? null : step.id);
                      }
                    }}
                  >
                    
                    {/* Status Icon */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden sm:flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-slot-cream border-4 border-slot-cream flex items-center justify-center">
                        {isWaiting && <div className="w-2.5 h-2.5 rounded-full bg-slot-indigo/20" />}
                        {isChecking && <Loader2 size={16} className="text-slot-orange animate-spin" />}
                        {isSuccess && <Check size={16} className="text-emerald-500" />}
                        {hasFailed && <XCircle size={16} className="text-red-500" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-1 sm:pl-8">
                      {/* Mobile icon fallback */}
                      <div className="sm:hidden">
                        {isWaiting && <div className="w-2 h-2 rounded-full bg-slot-indigo/20" />}
                        {isChecking && <Loader2 size={14} className="text-slot-orange animate-spin" />}
                        {isSuccess && <Check size={14} className="text-emerald-500" />}
                        {hasFailed && <XCircle size={14} className="text-red-500" />}
                      </div>
                      <h3 className={`text-xl md:text-2xl font-extrabold transition-colors ${
                        isChecking 
                          ? 'text-slot-orange' 
                          : hasFailed 
                          ? 'text-red-600'
                          : 'text-slot-indigo'
                        } ${isSettled && !hasFailed ? 'group-hover:text-slot-orange' : ''}`}
                      >
                        {isChecking ? step.checkingTitle : hasFailed ? step.failedTitle : step.title}
                      </h3>
                      {isSettled && <ChevronDown className={`w-5 h-5 text-slot-charcoal/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                    </div>
                    
                    <motion.p 
                      className="text-slot-charcoal/60 font-medium text-sm md:text-base sm:pl-8"
                      animate={{ opacity: isChecking ? 0.5 : 1 }}
                    >
                      {hasFailed ? step.failedSubtitle : step.subtitle}
                    </motion.p>
                    
                    <AnimatePresence>
                      {isExpanded && isSettled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden sm:pl-8"
                        >
                          <div className="pt-4 pb-2 space-y-3">
                            <div className="text-sm font-bold text-slot-charcoal/80 bg-white p-5 rounded-2xl border border-slot-indigo/5 shadow-sm leading-relaxed">
                              {step.detail}
                            </div>
                            {hasFailed && stepViolations.length > 0 && (
                              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-red-700 text-sm font-medium space-y-2">
                                <p className="font-bold mb-2">Detailed Violations:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  {stepViolations.map((v, i) => (
                                    <li key={i}>{v.message}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Verification Summary */}
        <AnimatePresence>
          {activeStep >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-slot-indigo/10 p-8 md:p-10 rounded-3xl shadow-sm mt-4 max-w-4xl mx-auto w-full"
            >
              <h4 className="text-[10px] font-bold text-slot-charcoal/40 uppercase tracking-widest mb-6 md:mb-8">
                Verification Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slot-charcoal/50 uppercase">Exams checked</span>
                  <span className="text-2xl font-extrabold text-slot-indigo">{numExams}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slot-charcoal/50 uppercase">Rooms checked</span>
                  <span className="text-2xl font-extrabold text-slot-indigo">{uniqueRooms.size}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slot-charcoal/50 uppercase">Faculty checked</span>
                  <span className="text-2xl font-extrabold text-slot-indigo">{uniqueFaculty.size}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slot-charcoal/50 uppercase">Violations found</span>
                  <span className={`text-2xl font-extrabold ${violations.length === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{violations.length}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Overlay for SUCCESS */}
        <AnimatePresence>
          {showModal && isValid && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-slot-indigo/40 backdrop-blur-sm z-[60]" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }} 
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }} 
                exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }} 
                className="fixed top-1/2 left-1/2 bg-white rounded-3xl shadow-2xl z-[70] w-[calc(100%-2rem)] max-w-sm p-8 flex flex-col items-center text-center"
              >
                 <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-5">
                   <ShieldCheck size={32} />
                 </div>
                 <h3 className="text-2xl font-extrabold text-slot-indigo mb-2">Verification Complete</h3>
                 <p className="text-slot-charcoal/60 font-medium text-sm mb-6">Your timetable has passed all mandatory constraint checks.</p>
                 
                 <div className="w-full flex flex-col gap-3 mb-8 text-left bg-slot-cream/30 p-5 rounded-2xl border border-slot-indigo/5">
                    <div className="flex items-center gap-3 text-sm font-bold text-slot-indigo"><Check size={16} className="text-emerald-500"/> 0 student conflicts</div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slot-indigo"><Check size={16} className="text-emerald-500"/> 0 room collisions</div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slot-indigo"><Check size={16} className="text-emerald-500"/> 0 capacity violations</div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slot-indigo"><Check size={16} className="text-emerald-500"/> 0 faculty conflicts</div>
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                   <button 
                     onClick={() => navigate('/publish')}
                     className="w-full bg-slot-orange text-white hover:bg-slot-orange/90 shadow-md hover:-translate-y-0.5 h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slot-orange"
                   >
                     Publish timetable <ArrowRight size={18} />
                   </button>
                   <button 
                     onClick={() => setShowModal(false)}
                     className="w-full bg-transparent text-slot-indigo hover:bg-slot-indigo/5 h-12 rounded-xl font-bold text-sm transition-colors"
                   >
                     View verification details
                   </button>
                 </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal Overlay for FAILURE */}
        <AnimatePresence>
          {showModal && !isValid && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-red-900/40 backdrop-blur-sm z-[60]" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }} 
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }} 
                exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }} 
                className="fixed top-1/2 left-1/2 bg-white rounded-3xl shadow-2xl z-[70] w-[calc(100%-2rem)] max-w-sm p-8 flex flex-col items-center text-center"
              >
                 <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5">
                   <AlertTriangle size={32} />
                 </div>
                 <h3 className="text-2xl font-extrabold text-slot-indigo mb-2">Verification Failed</h3>
                 <p className="text-slot-charcoal/60 font-medium text-sm mb-6">The generated timetable contains {violations.length} critical violation{violations.length !== 1 ? 's' : ''}.</p>
                 
                 <div className="w-full flex flex-col gap-3 mb-8 text-left bg-red-50/50 p-5 rounded-2xl border border-red-100">
                    <p className="text-sm font-bold text-red-700">Please review the checklist details to identify the issues. You may need to adjust constraints or data before generating again.</p>
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                   <button 
                     onClick={() => setShowModal(false)}
                     className="w-full bg-slot-indigo text-white hover:bg-slot-indigo/90 shadow-md hover:-translate-y-0.5 h-12 rounded-xl font-bold text-base flex items-center justify-center transition-all"
                   >
                     Review violations
                   </button>
                   <button 
                     onClick={() => navigate('/constraints')}
                     className="w-full bg-transparent text-slot-indigo hover:bg-slot-indigo/5 h-12 rounded-xl font-bold text-sm transition-colors"
                   >
                     Adjust constraints
                   </button>
                 </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Fallback Footer Actions */}
        <AnimatePresence>
          {activeStep >= 10 && !showModal && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-6 mt-2 justify-center"
            >
              {isValid ? (
                <button 
                  onClick={() => navigate('/publish')}
                  className="w-full sm:w-auto bg-slot-orange text-white hover:bg-slot-orange/90 shadow-md hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slot-orange"
                >
                  Publish timetable
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/constraints')}
                  className="w-full sm:w-auto bg-slot-indigo text-white hover:bg-slot-indigo/90 shadow-md hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
                >
                  Adjust Constraints
                </button>
              )}
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
