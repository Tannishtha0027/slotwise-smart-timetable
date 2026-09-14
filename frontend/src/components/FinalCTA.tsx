import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShinyText from './ShinyText';

const FinalCTA = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-slot-yellow opacity-50 rotate-[-15deg]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div className="absolute bottom-10 right-20 text-slot-orange opacity-50 rotate-[20deg]">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold text-slot-indigo mb-6 tracking-tight">
          Ready to stop fighting <br className="hidden md:block"/>
          with <ShinyText text="timetables?" speed={3} delay={1} />
        </h2>
        
        <p className="text-xl text-slot-charcoal/70 mb-12 font-medium max-w-2xl mx-auto">
          Let Slotwise handle the scheduling.
        </p>
        
        <Link to="/create" className="bg-slot-yellow text-slot-indigo px-10 py-5 rounded-2xl font-black text-xl inline-flex items-center gap-3 hover:bg-[#F2BD40] transition-all hover:shadow-paper-hover transform hover:-translate-y-1 group">
          Generate Your Timetable
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
};

export default FinalCTA;
