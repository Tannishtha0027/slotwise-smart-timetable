import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-24 pb-20 md:pb-32 flex flex-col md:flex-row items-center justify-between min-h-[85vh]">
      
      {/* Left Text Content */}
      <div className="w-full md:w-1/2 flex flex-col items-start z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slot-yellow/20 text-slot-orange font-bold text-xs tracking-wide mb-6 border border-slot-yellow/30">
            <span className="w-2 h-2 rounded-full bg-slot-orange animate-pulse"></span>
            SMART TIMETABLE GENERATOR
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slot-indigo leading-[1.05] tracking-tight mb-6">
            Turn exam chaos <br className="hidden md:block"/>
            into a timetable <br className="hidden md:block"/>
            <span className="relative">
              that just works.
              <svg className="absolute -bottom-2 left-0 w-full text-slot-yellow" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C100 2 200 2 298 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slot-charcoal/70 leading-relaxed max-w-lg mb-10 font-medium">
            Slotwise builds conflict-free exam schedules by automatically balancing students, rooms, faculty, and strict time constraints.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/dashboard" className="w-full sm:w-auto bg-slot-indigo text-slot-cream px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slot-indigo/90 transition-all hover:shadow-paper-hover transform hover:-translate-y-1 group">
              Generate Timetable
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-transparent text-slot-charcoal px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black/5 transition-all cursor-pointer"
            >
              <PlayCircle size={22} className="text-slot-orange" />
              See How It Works
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Visual Component */}
      <div className="w-full md:w-1/2 relative mt-16 md:mt-0 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-[320px] md:max-w-[350px] mx-auto flex justify-center"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)',
            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
          }}
        >
          <video 
            src="/videos/slotwise-hero.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-auto object-cover mix-blend-multiply pointer-events-none"
          />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
