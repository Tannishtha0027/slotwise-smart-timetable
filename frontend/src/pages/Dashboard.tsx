import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CircleDashed, Plus, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';

// --- DATA ---

const getProjects = () => {
  const publishedMapStr = sessionStorage.getItem('publishedTimetables');
  const publishedMap = publishedMapStr ? JSON.parse(publishedMapStr) : {};

  // For backward compatibility or if there's an old timetableStatus, we can ignore it
  // and purely rely on the map for newly published timetables.
  
  return [
    {
      id: 'p1',
      title: 'October 2026 End Semester',
      metadata: '24 exams · 680 students',
      status: publishedMap['p1'] ? 'Published' : 'Verified',
      updated: 'Today',
      actionText: 'Open timetable',
      actionRoute: '/result'
    },
    {
      id: 'p2',
      title: 'November 2026 Internal Exams',
      metadata: '16 exams · 420 students',
      status: publishedMap['p2'] ? 'Published' : 'Published', // Hardcoded as published originally
      updated: '3 days ago',
      actionText: 'Open timetable',
      actionRoute: '/result'
    },
    {
      id: 'p3',
      title: 'First Year Model Exams',
      metadata: '18 exams · 510 students',
      status: publishedMap['p3'] ? 'Published' : 'Draft',
      updated: '1 week ago',
      actionText: publishedMap['p3'] ? 'Open timetable' : 'Continue',
      actionRoute: publishedMap['p3'] ? '/result' : '/create'
    }
  ];
};

const ACTIVITY = [
  { id: 'a1', type: 'verify', title: 'Timetable verified', project: 'October 2026 End Semester', time: 'Today' },
  { id: 'a2', type: 'publish', title: 'Timetable published', project: 'November 2026 Internal Exams', time: '3 days ago' },
  { id: 'a3', type: 'create', title: 'New timetable created', project: 'First Year Model Exams', time: '1 week ago' },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Verified') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
        <CheckCircle2 size={14} /> {status}
      </div>
    );
  }
  if (status === 'Published') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slot-indigo/10 text-slot-indigo border border-slot-indigo/20 text-xs font-bold uppercase tracking-wider">
        <CheckCircle2 size={14} /> {status}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slot-charcoal/5 text-slot-charcoal/60 border border-slot-charcoal/10 text-xs font-bold uppercase tracking-wider">
      <CircleDashed size={14} /> {status}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as any }
    }
  };

  return (
    <div 
      className="min-h-screen bg-slot-cream font-sans flex flex-col text-slot-charcoal overflow-x-hidden selection:bg-slot-yellow/30 selection:text-slot-indigo relative z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(39, 32, 95, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(39, 32, 95, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      <div className="relative z-10 flex flex-col flex-grow pointer-events-none">
        <div className="pointer-events-auto flex flex-col flex-grow">
          <Navbar />
          
          <main className="flex-grow max-w-[1240px] mx-auto w-full px-6 md:px-12 pt-32 pb-24 flex flex-col">
          
          {/* Welcome Section */}
          <motion.section 
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
          </motion.section>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative" id="timetables" style={{ scrollMarginTop: '120px' }}>
            
            {/* Projects List */}
            <div className="flex-grow">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Your Timetables</h2>
                <p className="text-slot-charcoal/50 font-medium mt-1">Your saved examination schedules.</p>
              </div>
              
              {getProjects().length > 0 ? (
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                  className="flex flex-col gap-4"
                >
                  {getProjects().map(project => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <div 
                        onClick={() => {
                          sessionStorage.setItem('currentProjectId', project.id);
                          navigate(project.actionRoute);
                        }}
                        className="bg-white border border-slot-indigo/10 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-slot-indigo/20"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slot-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-xl bg-slot-indigo/5 text-slot-indigo shrink-0">
                          <Calendar size={24} strokeWidth={2.5} />
                        </div>
                        
                        <div className="flex-grow flex flex-col">
                          <h3 className="text-xl font-extrabold text-slot-indigo mb-1 group-hover:text-slot-orange transition-colors">
                            {project.title}
                          </h3>
                          <div className="text-sm font-bold text-slot-charcoal/50">
                            {project.metadata}
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slot-indigo/5 lg:border-0 shrink-0">
                          
                          <div className="flex flex-col items-start lg:items-start gap-1 w-32">
                            <StatusBadge status={project.status} />
                            <span className="text-xs font-bold text-slot-charcoal/40 mt-1">Updated {project.updated}</span>
                          </div>
                          
                          <span className="text-slot-orange font-bold text-sm flex items-center gap-1 group-hover:text-slot-orange/80 transition-colors shrink-0 w-32 justify-start lg:justify-end">
                            {project.actionText} <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Empty State Fallback (if getProjects was empty) */
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white border border-slot-indigo/10 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-slot-cream rounded-full flex items-center justify-center mb-6 text-slot-indigo/30">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slot-indigo mb-2">No timetables yet.</h3>
                  <p className="text-slot-charcoal/50 font-medium mb-8 max-w-sm">
                    Create your first examination timetable to get started.
                  </p>
                  <Link to="/create" className="bg-slot-indigo text-slot-cream px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slot-indigo/90 transition-all shadow-sm">
                    <Plus size={18} /> Create New Timetable
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Minimal Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-[340px] shrink-0 pt-2 lg:pt-0"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Recent activity</h2>
                <p className="text-sm text-slot-charcoal/50 font-medium mt-1">Latest updates from your timetables.</p>
              </div>
              <div className="flex flex-col gap-6 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-px before:bg-slot-indigo/5">
                {ACTIVITY.map(act => (
                  <div key={act.id} className="flex gap-4 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                      act.type === 'verify' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      act.type === 'publish' ? 'bg-slot-indigo/10 text-slot-indigo border-slot-indigo/20' :
                      'bg-slot-yellow/20 text-slot-orange border-slot-yellow/30'
                    }`}>
                      {act.type === 'verify' ? <CheckCircle2 size={12} strokeWidth={3} /> : 
                       act.type === 'publish' ? <CheckCircle2 size={12} strokeWidth={3} /> : 
                       <Plus size={12} strokeWidth={3} />}
                    </div>
                    <div className="pt-0.5">
                      <div className="text-sm font-bold text-slot-indigo leading-tight">{act.title}</div>
                      <div className="text-xs font-bold text-slot-charcoal/50 mt-1">{act.project}</div>
                      <div className="text-[10px] font-bold text-slot-charcoal/40 mt-1 uppercase tracking-wider">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </main>
        </div>
      </div>
    </div>
  );
}
