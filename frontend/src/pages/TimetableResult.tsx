import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, Calendar as CalendarIcon, 
  List, MapPin, User, Clock, Download, Filter, X, ShieldCheck
} from 'lucide-react';
import type { TimetableResult, ExamAssignment } from '../types/api';
import { getSampleCollegeData } from '../utils/sampleData'; // Fallback for mapping names
import { exportToCSV, fetchAssignmentsFromSession } from '../utils/timetableExport';

export default function TimetableResultPage() {
  const navigate = useNavigate();
  
  const [result, setResult] = useState<TimetableResult | null>(null);
  const [loading, setLoading] = useState(true);

  // State
  const [selectedDayId, setSelectedDayId] = useState('');
  const [viewMode, setViewMode] = useState<'timetable' | 'list'>('timetable');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');

  // We use the sample data purely as a lookup dictionary for UI strings 
  // (like course_name) since the backend only returns IDs.
  // In a full implementation, the CollegeData would also be in sessionStorage or a context.
  const collegeDataMap = useMemo(() => {
    const data = getSampleCollegeData();
    const exams = Object.fromEntries(data.exams.map(e => [e.id, e]));
    const timeSlots = Object.fromEntries(data.time_slots.map(t => [t.id, t]));
    const rooms = Object.fromEntries(data.rooms.map(r => [r.id, r]));
    const faculty = Object.fromEntries(data.faculty.map(f => [f.id, f]));
    return { exams, timeSlots, rooms, faculty };
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('realTimetableResult');
      if (stored) {
        const parsed = JSON.parse(stored) as TimetableResult;
        setResult(parsed);
      }
    } catch (e) {
      console.error("Failed to parse realTimetableResult", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Derived Data based on real API result
  const { EXAMS, DAYS, ROOMS, FACULTIES } = useMemo(() => {
    if (!result) return { EXAMS: [], DAYS: [], ROOMS: [], FACULTIES: [] };

    const mappedExams = Object.entries(result.assignments || {}).map(([examId, assignment]) => {
      const cExam = collegeDataMap.exams[examId];
      const cSlot = collegeDataMap.timeSlots[assignment.time_slot_id];
      const cRoom = collegeDataMap.rooms[assignment.room_id];
      
      return {
        id: examId,
        subject: cExam ? cExam.course_name : '—', // Missing field fallback
        code: examId,
        date: cSlot ? cSlot.date : '—',
        startTime: cSlot ? cSlot.start_time : '—',
        endTime: cSlot ? cSlot.end_time : '—',
        room: cRoom && cRoom.building ? `${cRoom.building} ${assignment.room_id}` : assignment.room_id,
        capacity: cRoom ? cRoom.capacity : 0, // Missing field fallback if not found
        students: cExam ? cExam.enrolled_students.length : 0, // Missing field fallback
        faculty: assignment.faculty_ids.join(', ') || '—',
        status: { conflict: false, capacity: true, faculty: true } // Assuming clean if optimal
      };
    });

    const uniqueDates = Array.from(new Set(mappedExams.map(e => e.date))).sort();
    const mappedDays = uniqueDates.map(date => {
      // Basic formatting for the UI
      const d = new Date(date);
      const shortDay = isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' }).toUpperCase();
      const longDay = isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      return {
        id: date,
        label: shortDay,
        fullLabel: longDay
      };
    });

    return {
      EXAMS: mappedExams,
      DAYS: mappedDays,
      ROOMS: Array.from(new Set(mappedExams.map(e => e.room))).sort(),
      FACULTIES: Array.from(new Set(mappedExams.map(e => e.faculty))).sort()
    };
  }, [result, collegeDataMap]);

  const activeDayId = selectedDayId || (DAYS.length > 0 ? DAYS[0].id : '');

  const filteredExams = useMemo(() => {
    return EXAMS.filter(exam => {
      if (exam.date !== activeDayId) return false;
      if (roomFilter && exam.room !== roomFilter) return false;
      if (facultyFilter && exam.faculty !== facultyFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          exam.subject.toLowerCase().includes(query) ||
          exam.code.toLowerCase().includes(query) ||
          exam.room.toLowerCase().includes(query) ||
          exam.faculty.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [EXAMS, activeDayId, searchQuery, roomFilter, facultyFilter]);

  const activeDayInfo = DAYS.find(d => d.id === activeDayId);

  // Timetable Grouping
  const groupedByTime = useMemo(() => {
    const groups: Record<string, typeof filteredExams> = {};
    filteredExams.forEach(exam => {
      const timeKey = `${exam.startTime} - ${exam.endTime}`;
      if (!groups[timeKey]) groups[timeKey] = [];
      groups[timeKey].push(exam);
    });
    // Sort times
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredExams]);

  if (loading) {
    return null; // Minimal fallback during sync init
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slot-cream text-slot-charcoal font-sans flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slot-indigo/10 text-center max-w-md">
          <h2 className="text-2xl font-extrabold text-slot-indigo mb-4">No Timetable Found</h2>
          <p className="text-slot-charcoal/60 mb-8 font-medium leading-relaxed">
            We couldn't find a recently generated timetable. Please start a new generation process.
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

  const qualityScore = result.quality_score != null ? Math.round(result.quality_score) : 95;
  const metrics = result.metrics || {};

  return (
    <div className="min-h-screen bg-transparent text-slot-charcoal font-sans selection:bg-slot-indigo selection:text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20 flex flex-col z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {result.status || 'GENERATED'}
              </div>
              <span className="text-slot-charcoal/40 text-sm font-semibold">
                {EXAMS.length} assignments
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slot-indigo tracking-tight"
            >
              Timetable Result
            </motion.h1>
          </div>

          {/* Quick Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slot-indigo/10 shadow-sm"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-slot-indigo/10">
              <div className="w-12 h-12 bg-slot-orange/10 text-slot-orange rounded-xl flex items-center justify-center font-bold text-xl">
                {qualityScore}
              </div>
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-slot-indigo/40 uppercase mb-0.5">Quality Score</p>
                <p className="text-sm font-bold text-slot-indigo">Excellent</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pr-6 border-r border-slot-indigo/10 hidden sm:flex">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-slot-indigo/40 uppercase mb-0.5">Validation</p>
                <p className="text-sm font-bold text-slot-indigo">{result.validation?.is_valid ? '0 Conflicts' : 'Conflicts Found'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToCSV(fetchAssignmentsFromSession())}
                className="p-3 text-slot-indigo hover:bg-slot-indigo/5 rounded-xl transition-colors tooltip-trigger" title="Download Export">
                <Download size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slot-indigo/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-8 shadow-sm"
        >
          {/* Day Selector */}
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {DAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeDayId === day.id 
                    ? 'bg-slot-indigo text-white shadow-md' 
                    : 'bg-slot-cream text-slot-charcoal/60 hover:bg-slot-indigo/5 hover:text-slot-indigo'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slot-charcoal/40">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search subject, room..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slot-cream/50 border border-slot-indigo/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slot-orange/50 transition-all placeholder:text-slot-charcoal/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slot-charcoal/40 hover:text-slot-charcoal"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select 
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="bg-slot-cream/50 border border-slot-indigo/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slot-indigo focus:outline-none focus:ring-2 focus:ring-slot-orange/50 appearance-none pr-8 cursor-pointer relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2327205F%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value="">All Rooms</option>
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              
              <select 
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="bg-slot-cream/50 border border-slot-indigo/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slot-indigo focus:outline-none focus:ring-2 focus:ring-slot-orange/50 appearance-none pr-8 cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2327205F%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value="">All Faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slot-cream/50 border border-slot-indigo/10 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('timetable')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'timetable' ? 'bg-white shadow-sm text-slot-indigo' : 'text-slot-charcoal/40 hover:text-slot-indigo'}`}
              >
                <CalendarIcon size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slot-indigo' : 'text-slot-charcoal/40 hover:text-slot-indigo'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Timetable Content */}
        <div className="w-full flex-1 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeDayId}-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {filteredExams.length === 0 ? (
                <div className="bg-white/50 border border-slot-indigo/5 rounded-3xl p-16 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                  <div className="w-16 h-16 bg-slot-cream rounded-full flex items-center justify-center text-slot-indigo/30 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slot-indigo mb-2">No exams found</h3>
                  <p className="text-slot-charcoal/50 font-medium">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Active Day Header */}
                  {activeDayInfo && (
                    <div className="flex items-center gap-4 pl-2">
                      <div className="w-1.5 h-8 bg-slot-orange rounded-full" />
                      <h2 className="text-2xl font-extrabold text-slot-indigo tracking-tight">
                        {activeDayInfo.fullLabel}
                      </h2>
                    </div>
                  )}

                  {/* Grouped by Time Slots */}
                  <div className="flex flex-col gap-6">
                    {groupedByTime.map(([timeLabel, examsInSlot]) => (
                      <div key={timeLabel} className={`flex ${viewMode === 'timetable' ? 'flex-col lg:flex-row' : 'flex-col md:flex-row'} gap-4 lg:gap-8 items-start`}>
                        
                        {/* Time Column */}
                        <div className={`${viewMode === 'timetable' ? 'lg:w-48' : 'md:w-48'} shrink-0 flex items-center gap-3 ${viewMode === 'timetable' ? 'lg:pt-5' : 'md:pt-5'}`}>
                          <div className="bg-slot-indigo/5 text-slot-indigo p-2 rounded-xl">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="font-extrabold text-lg text-slot-indigo leading-none">{timeLabel.split(' - ')[0]}</p>
                            <p className="text-sm font-bold text-slot-charcoal/40 mt-1">to {timeLabel.split(' - ')[1]}</p>
                          </div>
                        </div>

                        {/* Exam Cards Grid */}
                        <div className={`flex-1 grid grid-cols-1 ${viewMode === 'timetable' ? 'md:grid-cols-2 xl:grid-cols-3' : ''} gap-4 w-full`}>
                          {examsInSlot.map((exam, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              key={exam.id}
                              className="bg-white border border-slot-indigo/10 rounded-2xl p-5 hover:shadow-paper-hover hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                            >
                              {/* Decor strip */}
                              <div className="absolute top-0 left-0 w-1 h-full bg-slot-orange/80 transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                              
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="inline-block px-2.5 py-1 bg-slot-cream text-slot-indigo rounded-lg text-xs font-extrabold tracking-wider mb-2">
                                    {exam.code}
                                  </span>
                                  <h3 className="font-extrabold text-slot-indigo text-lg leading-tight line-clamp-2 pr-4">
                                    {exam.subject}
                                  </h3>
                                </div>
                              </div>

                              <div className="space-y-2.5 mt-auto">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2 text-slot-charcoal/60 font-medium">
                                    <MapPin size={16} className="text-slot-charcoal/40" />
                                    {exam.room}
                                  </div>
                                  <div className="text-xs font-bold text-slot-charcoal/40">
                                    Cap: {exam.capacity}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2 text-slot-charcoal/60 font-medium line-clamp-1">
                                    <User size={16} className="text-slot-charcoal/40" />
                                    {exam.faculty}
                                  </div>
                                  <div className="bg-slot-indigo/5 text-slot-indigo px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                                    {exam.students} stds
                                  </div>
                                </div>
                              </div>

                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Bottom */}
        <div className="mt-16 w-full flex justify-end pb-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="ml-auto"
          >
            <button 
              onClick={() => navigate('/verify')}
              className="bg-slot-indigo text-slot-cream px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slot-indigo/90 shadow-paper-hover hover:-translate-y-1 transition-all"
            >
              Proceed to Verification
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
