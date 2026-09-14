import { motion } from 'framer-motion';

const HeroTimetable = () => {
  // Animation variants
  const paperVariant: any = {
    hidden: { opacity: 0, y: 40, rotate: -2 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: -1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariant: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const stickerVariant: any = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto md:ml-auto mt-12 md:mt-0 perspective-1000">
      {/* Decorative background paper */}
      <motion.div 
        initial={{ opacity: 0, rotate: 4 }}
        animate={{ opacity: 1, rotate: 3 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-white/50 border border-slot-indigo/10 rounded-3xl shadow-sm -z-10 w-full h-[500px]"
      />
      
      <motion.div 
        variants={paperVariant}
        initial="hidden"
        animate="visible"
        className="bg-[#FFFCF6] rounded-3xl p-8 border border-slot-indigo/15 shadow-paper relative h-[500px] overflow-hidden"
      >
        {/* Notebook header lines */}
        <div className="absolute top-0 left-0 w-full h-12 border-b-2 border-slot-orange/20" />
        <div className="absolute top-0 left-8 bottom-0 w-0 border-l-2 border-slot-orange/20" />

        <motion.div variants={itemVariant} className="mb-8 relative z-10 pl-6">
          <h3 className="font-extrabold text-slot-indigo tracking-tight text-xl">SLOTWISE</h3>
          <p className="text-slot-charcoal/60 font-semibold text-xs tracking-widest">EXAM TIMETABLE</p>
          <div className="mt-4 bg-slot-charcoal text-slot-cream text-xs font-bold px-3 py-1 inline-block rounded-md">
            01 OCTOBER
          </div>
        </motion.div>

        {/* Timetable entries */}
        <div className="space-y-6 relative z-10 pl-6">
          
          {/* Entry 1 */}
          <motion.div variants={itemVariant} className="relative">
            <div className="flex gap-4">
              <div className="text-xs font-bold text-slot-charcoal/50 w-24 pt-1">
                09:00 — 11:00
              </div>
              <div className="bg-slot-indigo/5 border border-slot-indigo/10 rounded-xl p-4 flex-1 relative group hover:bg-slot-indigo/10 transition-colors">
                <motion.div variants={stickerVariant} className="absolute -top-3 -right-2 bg-slot-yellow text-slot-charcoal text-[10px] font-bold px-2 py-1 rounded-md transform rotate-3 shadow-sm border border-slot-yellow/50">
                  CS101
                </motion.div>
                <h4 className="font-bold text-slot-indigo mb-1">Introduction to CS</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slot-charcoal/70">
                  <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-black/5">ROOM R101</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Entry 2 */}
          <motion.div variants={itemVariant} className="relative">
            <div className="flex gap-4">
              <div className="text-xs font-bold text-slot-charcoal/50 w-24 pt-1">
                13:00 — 15:00
              </div>
              <div className="bg-slot-indigo/5 border border-slot-indigo/10 rounded-xl p-4 flex-1 relative group hover:bg-slot-indigo/10 transition-colors">
                <motion.div variants={stickerVariant} className="absolute -top-3 -right-2 bg-slot-orange text-slot-cream text-[10px] font-bold px-2 py-1 rounded-md transform -rotate-2 shadow-sm">
                  MATH201
                </motion.div>
                <h4 className="font-bold text-slot-indigo mb-1">Calculus I</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slot-charcoal/70">
                  <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-black/5">ROOM R102</span>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>

        {/* Hand drawn annotation */}
        <motion.div 
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 right-12 text-slot-indigo z-20 pointer-events-none"
        >
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 38C15 20 40 5 55 2M55 2C50 5 45 15 48 20M55 2C45 2 30 5 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-hand text-xl absolute -top-8 -left-20 rotate-[-10deg]">Conflict free!</span>
        </motion.div>

        {/* Verified Stamp */}
        <motion.div 
          initial={{ opacity: 0, scale: 2, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1.8 }}
          className="absolute bottom-6 left-12 border-2 border-[#1E8A5C] text-[#1E8A5C] px-3 py-1 rounded font-bold text-sm tracking-widest bg-white/80 backdrop-blur-sm shadow-sm"
        >
          ✓ VERIFIED
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HeroTimetable;
