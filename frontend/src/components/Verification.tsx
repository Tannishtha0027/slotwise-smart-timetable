import { ShieldCheck } from 'lucide-react';
import VerificationChecklist from './VerificationChecklist';

const Verification = () => {
  return (
    <section className="py-24 md:py-32 bg-slot-indigo text-slot-cream relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slot-yellow/20 text-slot-yellow font-bold text-xs tracking-widest mb-6 border border-slot-yellow/30 uppercase">
            <ShieldCheck size={14} />
            Zero-Trust Architecture
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Slotwise checks that the timetable <span className="text-slot-yellow">actually works.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slot-cream/80 leading-relaxed font-medium mb-8">
            Unlike standard AI tools that hallucinate, Slotwise doesn't blindly trust its own generated output. Every schedule runs through an independent mathematical validation engine to ensure flawless execution.
          </p>

          <p className="text-base text-slot-cream/60 font-medium max-w-md">
            The verification process actively inspects all hard constraints before a schedule is published for student use.
          </p>
        </div>

        {/* Right Visual: The New Animated Checklist */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <VerificationChecklist />
        </div>

      </div>
    </section>
  );
};

export default Verification;
