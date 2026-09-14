import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleDashed, Loader2, ShieldCheck } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const checks = [
  "No student conflicts",
  "Room capacity verified",
  "No room collisions",
  "Faculty availability verified",
  "Invigilator counts matched"
];

const VerificationChecklist = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [checkingIndex, setCheckingIndex] = useState(-1);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Sequential Checking Animation
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    
    // Initial delay before starting the check sequence
    const timeout = setTimeout(() => {
      setCheckingIndex(i);
      
      const interval = setInterval(() => {
        i++;
        setCheckingIndex(i);
        if (i >= checks.length) {
          clearInterval(interval);
        }
      }, 700); // 700ms per item check
      
      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(timeout);
  }, [isInView]);

  // LineSidebar Proximity Effect
  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let targetY = -1000;
    let currentY = -1000;
    let isHovering = false;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate mouse Y relative to the container
        targetY = e.clientY - rect.top;
        isHovering = true;
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetY = -1000; // Move target far away to reset effect smoothly
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    const update = () => {
      // Smoothly interpolate currentY towards targetY
      if (isHovering || Math.abs(currentY - targetY) > 0.5) {
        currentY += (targetY - currentY) * 0.1;
      }

      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        // Calculate item center Y relative to the container
        const itemCenterY = (rect.top - containerRect.top) + rect.height / 2;
        const distance = Math.abs(currentY - itemCenterY);
        const maxDistance = 120; // Proximity radius

        let targetEffect = 0;
        if (isHovering && distance < maxDistance) {
          // Calculate effect (1 at center, 0 at maxDistance)
          targetEffect = 1 - (distance / maxDistance);
          // Ease the effect slightly for a softer feel
          targetEffect = Math.sin((targetEffect * Math.PI) / 2); 
        }

        const currentEffect = parseFloat(el.style.getPropertyValue('--effect') || '0');
        // Smoothly approach the target effect
        const nextEffect = currentEffect + (targetEffect - currentEffect) * 0.15;
        
        el.style.setProperty('--effect', nextEffect.toFixed(3));
      });
      
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="bg-slot-cream rounded-2xl shadow-2xl p-8 md:p-10 border border-slot-indigo/10 relative overflow-hidden w-full max-w-lg mx-auto"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")" }} 
      />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h3 className="font-extrabold text-slot-indigo text-lg md:text-xl tracking-tight mb-2 flex items-center gap-2">
          <ShieldCheck size={24} className="text-slot-orange" />
          SLOTWISE VERIFICATION
        </h3>
        <p className="text-slot-charcoal/60 font-medium text-sm">
          Generated timetable is being independently checked.
        </p>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-6 relative z-10">
        {checks.map((item, index) => {
          // Determine the logical status of this row based on the sequence
          const status = index < checkingIndex ? 'verified' : index === checkingIndex ? 'active' : 'inactive';

          return (
            <div 
              key={index}
              ref={el => itemRefs.current[index] = el}
              className="flex items-center gap-4 group"
              style={{ '--effect': 0 } as React.CSSProperties} // Initialize CSS variable
            >
              {/* Marker Line */}
              <div 
                className="h-[3px] rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `calc(${status === 'inactive' ? '16px' : '48px'} + var(--effect) * 12px)`,
                  backgroundColor: status === 'verified' ? '#27205F' : status === 'active' ? '#F59A3D' : 'rgba(39, 32, 95, 0.15)',
                }}
              />

              {/* Icon Container */}
              <div 
                className="w-6 h-6 flex items-center justify-center shrink-0 transition-transform duration-300 ease-out"
                style={{ transform: `scale(calc(1 + var(--effect) * 0.15))` }}
              >
                {status === 'verified' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <CheckCircle2 size={22} className="text-slot-indigo" strokeWidth={2.5} />
                  </motion.div>
                )}
                {status === 'active' && (
                  <Loader2 size={20} className="text-slot-orange animate-spin" strokeWidth={2.5} />
                )}
                {status === 'inactive' && (
                  <CircleDashed size={18} className="text-slot-indigo/20" />
                )}
              </div>

              {/* Text */}
              <div 
                className="transition-all duration-300 ease-out text-[15px]"
                style={{
                  transform: `translateX(calc(var(--effect) * 4px))`,
                  color: status === 'verified' ? '#202020' : status === 'active' ? '#27205F' : 'rgba(32, 32, 32, 0.4)',
                  fontWeight: status === 'verified' ? 600 : status === 'active' ? 700 : 500,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationChecklist;
