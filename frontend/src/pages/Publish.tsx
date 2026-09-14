import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel, printTimetable, fetchAssignmentsFromSession } from '../utils/timetableExport';

export default function Publish() {
  const navigate = useNavigate();

  const getPublishedMap = () => {
    const data = sessionStorage.getItem('publishedTimetables');
    return data ? JSON.parse(data) : {};
  };

  const currentProjectId = sessionStorage.getItem('currentProjectId') || 'unknown';

  const [published, setPublished] = useState(() => {
    return !!getPublishedMap()[currentProjectId];
  });

  const getAssignments = () => {
    try {
      const stored = sessionStorage.getItem('realTimetableResult');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      
      const data = getSampleCollegeData();
      const cExams = Object.fromEntries(data.exams.map(e => [e.id, e]));
      const cTimeSlots = Object.fromEntries(data.time_slots.map(t => [t.id, t]));
      const cRooms = Object.fromEntries(data.rooms.map(r => [r.id, r]));
      
      return Object.entries(parsed.assignments || {}).map(([examId, assignment]: [string, any]) => {
        const exam = cExams[examId];
        const slot = cTimeSlots[assignment.time_slot_id];
        const room = cRooms[assignment.room_id];
        return {
          date: slot ? slot.date : '?',
          startTime: slot ? slot.start_time : '?',
          endTime: slot ? slot.end_time : '?',
          subject: exam ? exam.course_name : examId,
          room: room && room.building ? `${room.building} ${assignment.room_id}` : assignment.room_id,
          faculty: assignment.faculty_ids.join(', ') || '?'
        };
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handlePublish = () => {
    const map = getPublishedMap();
    if (currentProjectId !== 'unknown') {
      map[currentProjectId] = true;
      sessionStorage.setItem('publishedTimetables', JSON.stringify(map));
    }
    sessionStorage.setItem('timetableStatus', 'Published');
    setPublished(true);
  };

  return (
    <div className="font-sans flex flex-col text-slot-charcoal min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="relative inline-block mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-slot-indigo tracking-tight relative z-10">
              {published ? 'Timetable published.' : 'Ready to publish.'}
            </h1>
            <div 
              className="absolute -bottom-1 left-0 right-0 h-3 bg-slot-yellow opacity-80 -z-0"
              style={{
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                transform: 'rotate(-0.5deg)'
              }} 
            />
          </div>
          <p className="text-lg text-slot-charcoal/70 font-medium max-w-lg">
            {published 
              ? 'Your timetable is now live and can be accessed by faculty and students.' 
              : 'Your timetable has passed all mandatory verification checks and is ready to be shared.'}
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl bg-white/60 backdrop-blur-sm border border-slot-indigo/10 rounded-3xl p-8 shadow-sm flex flex-col mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slot-indigo mb-1">October 2026 End Semester</h2>
              <p className="text-slot-charcoal/60 font-medium">24 exams · 680 students · 18 rooms</p>
            </div>
            
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${published ? 'bg-slot-indigo/10 text-slot-indigo border-slot-indigo/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
              <CheckCircle2 size={14} /> 
              {published ? 'PUBLISHED' : 'VERIFIED'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-slot-indigo/10 mb-8">
             <div className="flex flex-col items-center justify-center text-center">
               <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
                 <CheckCircle2 size={16} /> 0
               </div>
               <span className="text-xs font-bold text-slot-charcoal/50 uppercase tracking-widest mt-1">Student Conflicts</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center">
               <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
                 <CheckCircle2 size={16} /> 0
               </div>
               <span className="text-xs font-bold text-slot-charcoal/50 uppercase tracking-widest mt-1">Room Collisions</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center">
               <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
                 <CheckCircle2 size={16} /> 0
               </div>
               <span className="text-xs font-bold text-slot-charcoal/50 uppercase tracking-widest mt-1">Capacity Violations</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center">
               <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
                 <CheckCircle2 size={16} /> 0
               </div>
               <span className="text-xs font-bold text-slot-charcoal/50 uppercase tracking-widest mt-1">Faculty Conflicts</span>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {!published ? (
              <motion.div
                key="publish-action"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <button 
                  onClick={handlePublish}
                  className="bg-slot-orange text-white hover:bg-slot-orange/90 shadow-md hover:-translate-y-0.5 px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                >
                  Publish timetable <ArrowRight size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success-action"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg mr-4 hidden sm:flex">
                  <CheckCircle2 size={24} /> Published
                </div>
                <button 
                  onClick={() => navigate('/result')}
                  className="bg-slot-indigo text-white hover:bg-slot-indigo/90 shadow-md hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center transition-all w-full sm:w-auto"
                >
                  View timetable
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-slot-indigo border border-slot-indigo/20 hover:bg-slot-indigo/5 px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center transition-all w-full sm:w-auto"
                >
                  Back to dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

          {/* Secondary Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            <button 
              onClick={() => exportToPDF(fetchAssignmentsFromSession(), 'Slotwise_Timetable.pdf', currentProjectId)}
              className="flex items-center gap-2 text-sm font-bold text-slot-indigo hover:text-slot-orange transition-colors" title="Export to PDF">
              <Download size={16} /> Download PDF
            </button>
            <button 
              onClick={() => exportToExcel(fetchAssignmentsFromSession())}
              className="flex items-center gap-2 text-sm font-bold text-slot-indigo hover:text-slot-orange transition-colors" title="Export to Excel">
              <FileSpreadsheet size={16} /> Download Excel
            </button>
            <button 
              onClick={printTimetable}
              className="flex items-center gap-2 text-sm font-bold text-slot-indigo hover:text-slot-orange transition-colors" title="Print Timetable">
              <Printer size={16} /> Print timetable
            </button>
          </motion.div>

      </main>
    </div>
  );
}
