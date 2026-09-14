import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, } from 'lucide-react';

const fadeUp: any = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)', 
    transition: { duration: 0.7, ease: 'easeOut' } 
  }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const SubMetric = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1 border-l-2 border-slot-indigo/10 pl-5">
    <span className="text-4xl font-extrabold text-slot-indigo tracking-tight">{value}</span>
    <span className="text-[10px] font-bold text-slot-charcoal/50 uppercase tracking-widest">{label}</span>
  </div>
);

const DataRow = ({ label, value, bar, distribution }: { label: string, value: string, bar?: number, distribution?: number[] }) => (
  <div className="flex flex-col gap-2.5 border-b border-slot-indigo/5 pb-4">
    <div className="flex justify-between items-end">
       <span className="text-sm font-bold text-slot-charcoal/60">{label}</span>
       <span className="text-base font-extrabold text-slot-indigo tracking-tight">{value}</span>
    </div>
    {bar !== undefined && (
       <div className="w-full h-1 bg-slot-indigo/5 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           whileInView={{ width: `${bar}%` }}
           viewport={{ once: true, margin: '-50px' }}
           transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
           className="h-full bg-slot-orange rounded-full" 
         />
       </div>
    )}
    {distribution && (
      <div className="flex items-end gap-1 h-6 mt-1">
        {distribution.map((h, i) => (
           <motion.div 
             key={i} 
             initial={{ height: 0 }}
             whileInView={{ height: `${h}%` }}
             viewport={{ once: true, margin: '-50px' }}
             transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
             className="flex-1 rounded-t-sm" 
             style={{ backgroundColor: h > 80 ? '#27205F' : h > 40 ? 'rgba(39, 32, 95, 0.3)' : 'rgba(39, 32, 95, 0.1)' }}
           />
        ))}
      </div>
    )}
  </div>
);

const Observation = ({ num, title, text }: { num: string, title: string, text: string }) => (
  <motion.div variants={fadeUp} className="flex flex-col gap-3">
     <div className="flex items-center gap-3">
       <div className="w-6 h-6 shrink-0 rounded-full border border-slot-indigo/20 flex items-center justify-center text-[10px] font-extrabold text-slot-indigo">
         0{num}
       </div>
       <h4 className="text-sm font-extrabold text-slot-indigo uppercase tracking-wider">{title}</h4>
     </div>
     <p className="text-slot-charcoal/70 font-medium text-sm pl-9 leading-relaxed">{text}</p>
  </motion.div>
);

export default function ProjectIntelligence() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slot-cream font-sans flex flex-col items-center text-slot-charcoal overflow-x-hidden selection:bg-slot-orange/20">
      
      {/* Navbar */}
      <Navbar />

      <main className="w-full max-w-[1100px] px-6 md:px-12 pt-16 md:pt-28 pb-32 flex flex-col">
        
        {/* Page Header */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <div className="text-[10px] font-bold tracking-widest uppercase text-slot-orange mb-4">
            Project Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slot-indigo tracking-tight mb-6 leading-tight">
            Understand your timetable.
          </h1>
          <p className="text-lg md:text-xl text-slot-charcoal/70 font-medium max-w-2xl leading-relaxed">
            See how the generated schedule performs across students, rooms, faculty, and scheduling preferences.
          </p>
        </motion.section>

        {/* Overall Quality Score */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="flex flex-col md:flex-row items-start md:items-end gap-12 md:gap-24 border-t border-b border-slot-indigo/10 py-16 md:py-20 mb-16 md:mb-24"
        >
          <div className="flex flex-col">
            <div className="flex items-start gap-1">
               <span className="text-8xl md:text-[140px] font-extrabold text-slot-indigo tracking-tighter leading-none">98</span>
               <span className="text-4xl md:text-6xl font-bold text-slot-indigo tracking-tighter mt-3 md:mt-6">.4</span>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
               <div className="text-xs font-bold text-slot-indigo tracking-widest uppercase">Schedule Quality</div>
            </div>
            <p className="text-slot-charcoal/60 font-medium mt-2 max-w-xs">Excellent schedule quality</p>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 w-full pb-2">
            <SubMetric label="Student comfort" value="94" />
            <SubMetric label="Room efficiency" value="91" />
            <SubMetric label="Constraint compliance" value="100" />
          </div>
        </motion.section>

        {/* 3-Column Metrics Grid */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 border-b border-slot-indigo/10 pb-16 md:pb-24 mb-16 md:mb-24"
        >
          {/* Student Experience */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Student experience</h3>
              <p className="text-sm text-slot-charcoal/60 font-medium leading-relaxed">Most students have sufficient spacing between examinations.</p>
            </div>
            <div className="flex flex-col gap-4">
              <DataRow label="Back-to-back exams" value="2" />
              <DataRow label="Students with 3+ exams/day" value="0" />
              <DataRow label="Average gap between exams" value="2h 15m" />
            </div>
          </motion.div>

          {/* Room Utilization */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Room utilization</h3>
              <p className="text-sm text-slot-charcoal/60 font-medium leading-relaxed">Room capacity is being used efficiently without creating collisions.</p>
            </div>
            <div className="flex flex-col gap-4">
              <DataRow label="Rooms used" value="14 / 18" />
              <DataRow label="Average utilization" value="78%" bar={78} />
              <DataRow label="Peak utilization" value="92%" bar={92} />
            </div>
          </motion.div>

          {/* Faculty Workload */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-slot-indigo tracking-tight">Faculty workload</h3>
              <p className="text-sm text-slot-charcoal/60 font-medium leading-relaxed">Faculty are distributed evenly without availability conflicts.</p>
            </div>
            <div className="flex flex-col gap-4">
              <DataRow label="Faculty assigned" value="32" distribution={[10, 20, 60, 100, 80, 40, 15]} />
              <DataRow label="Highest assignments" value="4" />
              <DataRow label="Availability conflicts" value="0" />
            </div>
          </motion.div>
        </motion.section>

        {/* Observations */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="flex flex-col gap-10 mb-20"
        >
          <motion.h3 variants={fadeUp} className="text-[10px] font-bold tracking-widest uppercase text-slot-charcoal/40">
            Schedule Observations
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <Observation 
              num="1" 
              title="Strong student spacing" 
              text="Most students have at least one free slot between examinations." 
            />
            <Observation 
              num="2" 
              title="Balanced room usage" 
              text="Most assigned rooms operate below their maximum capacity." 
            />
            <Observation 
              num="3" 
              title="No critical conflicts" 
              text="The timetable passed all mandatory validation checks." 
            />
          </div>
        </motion.section>

        {/* Footer Actions */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-6 pt-12 mt-12 border-t border-slot-indigo/10"
        >
          <button 
            onClick={() => navigate('/publish')}
            className="w-full sm:w-auto bg-slot-orange text-white hover:bg-slot-orange/90 shadow-md hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slot-orange"
          >
            Publish timetable
            <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={() => navigate('/verify')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-transparent text-slot-indigo hover:bg-slot-indigo/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slot-indigo/20"
          >
            Back to verification
          </button>
        </motion.section>

      </main>
    </div>
  );
}
