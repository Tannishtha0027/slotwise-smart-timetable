import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'ADD DATA', desc: 'Add exams, students, rooms and faculty.' },
  { num: '02', title: 'SET CONSTRAINTS', desc: 'Define availability and scheduling requirements.' },
  { num: '03', title: 'OPTIMIZE', desc: 'Slotwise finds a timetable satisfying the hard constraints while optimizing quality.' },
  { num: '04', title: 'VERIFY', desc: 'The generated timetable is independently mathematically checked.' },
  { num: '05', title: 'PUBLISH', desc: 'Review and use the final timetable.' },
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      
      // Animate the main timeline vertical line to draw downwards
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            }
          }
        );
      }

      stepsRefs.current.forEach((stepEl, _idx) => {
        if (!stepEl) return;
        
        const card = stepEl.querySelector('.timeline-card-wrapper');
        const circle = stepEl.querySelector('.timeline-circle');
        const dot = stepEl.querySelector('.timeline-dot');

        if (prefersReducedMotion) {
          // Fallback for reduced motion
          gsap.fromTo(stepEl, 
            { opacity: 0 },
            { 
              opacity: 1, 
              duration: 0.6, 
              scrollTrigger: {
                trigger: stepEl,
                start: "top 85%",
              } 
            }
          );
          return;
        }

        // Setup initial state visually
        gsap.set(card, {
          opacity: 0,
          x: -70,
          y: 40,
          rotation: -3,
          scale: 0.96,
          filter: 'blur(5px)',
        });

        gsap.set(circle, {
          opacity: 0.4,
          scale: 0.9,
          borderColor: 'rgba(39, 32, 95, 0.2)'
        });
        
        gsap.set(dot, { scale: 0, opacity: 0 });

        // Animation Timeline for each step
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stepEl,
            start: "top 85%",
            toggleActions: "play none none reverse", // or 'play none none none' if we don't want it to reverse
          }
        });

        // Easing matching a premium physical float
        tl.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: "power3.out"
        }, 0)
        .to(circle, {
          opacity: 1,
          scale: 1,
          borderColor: 'rgba(39, 32, 95, 1)',
          duration: 0.6,
          ease: "back.out(1.4)"
        }, 0.1)
        .to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(2)"
        }, 0.3);

      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="scroll-mt-24 py-24 md:py-32 relative bg-slot-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12" ref={containerRef}>
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slot-indigo mb-4 tracking-tight">How Slotwise Works</h2>
          <div className="w-24 h-2 bg-slot-yellow rounded-full"></div>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-6 md:left-8 w-1 h-[calc(100%-60px)] bg-slot-indigo/10 rounded-full hidden sm:block overflow-hidden">
            <div ref={lineRef} className="w-full h-full bg-slot-indigo/30 rounded-full"></div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, _idx) => (
              <div 
                key={_idx}
                ref={el => stepsRefs.current[_idx] = el}
                className="flex flex-col sm:flex-row items-start gap-6 sm:gap-12 relative"
              >
                {/* Number Badge */}
                <div className="timeline-circle relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slot-cream border-2 rounded-full flex items-center justify-center font-bold text-slot-indigo text-lg md:text-xl shadow-sm">
                  {step.num}
                  {/* Decorative tiny dot */}
                  <div className="timeline-dot absolute -right-1 -top-1 w-3 h-3 bg-slot-orange rounded-full border border-slot-cream"></div>
                </div>

                {/* Content Card Wrapper for GSAP */}
                <div className="timeline-card-wrapper flex-1 max-w-2xl">
                  {/* Content Card with Tailwind Hover */}
                  <div className="timeline-card bg-white border border-slot-indigo/10 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative">
                    {/* Optional hover accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slot-yellow to-slot-orange opacity-0 group-hover:opacity-100 rounded-t-2xl transition-opacity duration-300"></div>
                    
                    <h3 className="font-extrabold text-xl md:text-2xl text-slot-indigo mb-3 group-hover:text-slot-orange transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slot-charcoal/70 font-medium text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
