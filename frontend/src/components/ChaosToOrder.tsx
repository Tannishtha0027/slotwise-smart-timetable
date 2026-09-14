import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Real academic photography fragments
const photoFragments = [
  { url: '/images/media_1789199855476.jpg', aspect: 'aspect-[4/3]', hero: true }, // Students taking exam
  { url: '/images/media_1789199876360.jpg', aspect: 'aspect-[3/4]' }, // Study desk
  { url: '/images/media_1789199891802.jpg', aspect: 'aspect-square' }, // Planners and desk
  { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop', aspect: 'aspect-[4/3]' }, // Writing
  { url: '/images/media_1789199838776.jpg', aspect: 'aspect-square', hero: true }, // Pencil on answer sheet
  { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop', aspect: 'aspect-video' }, // Class/Books
  { url: '/images/media_1789199899037.jpg', aspect: 'aspect-[3/4]', hero: true }, // Student studying by window
  { url: '/images/media_1789199855476.jpg', aspect: 'aspect-[4/3]' }, // Students taking exam
  { url: '/images/media_1789199876360.jpg', aspect: 'aspect-square' }, // Study desk with laptop
  { url: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=400&auto=format&fit=crop', aspect: 'aspect-video' }, // Notebook
  { url: '/images/media_1789199891802.jpg', aspect: 'aspect-[4/3]' }, // Planners
  { url: '/images/media_1789199838776.jpg', aspect: 'aspect-[3/4]' }, // Answer sheet
  { url: '/images/media_1789199899037.jpg', aspect: 'aspect-square', hero: true } // Student studying
];

// Generate a random but consistent column of items, duplicated for infinite scroll
const generateColumn = (seedOffset: number) => {
  const shuffled = [...photoFragments].sort((a, b) => {
    // simple deterministic shuffle based on seed
    const hashA = a.url.length + seedOffset;
    const hashB = b.url.length + seedOffset;
    return (hashA % 5) - (hashB % 5); 
  });
  // duplicate for infinite marquee effect
  return [...shuffled, ...shuffled];
};

const TileRenderer = (item: any, i: number) => {
  // Deterministic randomness for depth and rotation
  const rot = (i % 7) - 3; // -3 to +3 degrees
  const scale = 0.9 + (i % 5) * 0.08; // 0.9 to 1.3 for variation
  const opacity = 0.75 + (i % 4) * 0.06; // 0.75 to 0.99
  const animDelay = (i % 7) * -1.5; // Stagger hero animations

  const style = {
    transform: `rotate(${rot}deg) scale(${scale})`,
    opacity: opacity,
    animationDelay: `${animDelay}s`,
  };

  const interactionClass = item.hero 
    ? "animate-hero-lift" 
    : "hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:opacity-100 transition-all duration-500 hover:z-20";

  return (
    <div 
      key={i} 
      className={`shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slot-indigo/5 bg-slot-cream relative cursor-default ${interactionClass}`} 
      style={style}
    >
      <img 
        src={item.url} 
        alt="Academic photography" 
        className={`w-full ${item.aspect} object-cover pointer-events-none`} 
        loading="lazy"
      />
      {/* Subtle inner ring to make it feel like a tactile photograph */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl sm:rounded-2xl pointer-events-none"></div>
    </div>
  );
};

const ChaosToOrder = () => {
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rAF: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Map to slight rotation degrees (max 6 degrees)
      targetX = x * 6;
      targetY = y * 6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const update = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (wallRef.current) {
        // Apply perspective and rotation
        wallRef.current.style.transform = `perspective(1000px) rotateX(${-currentY}deg) rotateY(${currentX}deg) rotateZ(-1deg) scale(1.15)`;
      }
      
      rAF = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rAF);
    };
  }, []);

  return (
    <section id="product" className="scroll-mt-24 relative w-full h-[80vh] min-h-[600px] md:min-h-[850px] overflow-hidden bg-slot-cream flex items-center justify-center">
      
      {/* DriftWall Background Layer with Chaos->Order Entrance */}
      <motion.div 
        initial={{ filter: 'blur(12px)', opacity: 0, scale: 1.1 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center"
      >
        {/* Wall Container (handles continuous rAF rotation) */}
        <div 
          ref={wallRef} 
          className="w-[150%] md:w-[120%] h-[200%] md:h-[150%] flex gap-4 md:gap-6 p-4" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-4 md:gap-8 animate-scroll-up" style={{ animationDuration: '45s' }}>
            {generateColumn(0).map(TileRenderer)}
          </div>
          
          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-4 md:gap-8 animate-scroll-down" style={{ animationDuration: '55s' }}>
            {generateColumn(1).map(TileRenderer)}
          </div>
          
          {/* Column 3 */}
          <div className="flex-1 flex flex-col gap-4 md:gap-8 animate-scroll-up" style={{ animationDuration: '40s' }}>
            {generateColumn(2).map(TileRenderer)}
          </div>
          
          {/* Column 4 (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 flex-col gap-4 md:gap-8 animate-scroll-down" style={{ animationDuration: '50s' }}>
            {generateColumn(3).map(TileRenderer)}
          </div>
          
          {/* Column 5 (Hidden on tablet/mobile) */}
          <div className="hidden lg:flex flex-1 flex-col gap-4 md:gap-8 animate-scroll-up" style={{ animationDuration: '60s' }}>
            {generateColumn(4).map(TileRenderer)}
          </div>
        </div>
      </motion.div>

      {/* Foreground Radial Gradient Mask */}
      {/* Creates the natural readability clearing behind the typography. */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(247,243,234, 0.9) 0%, rgba(247,243,234, 0.6) 35%, rgba(247,243,234, 0) 75%)' 
        }} 
      />

      {/* Foreground Typography */}
      <div className="relative z-20 text-center max-w-4xl px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slot-indigo mb-6 tracking-tight leading-[1.1] drop-shadow-sm"
        >
          Too many constraints to <br className="hidden md:block"/> solve manually.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.35 }}
          className="text-base sm:text-lg md:text-xl text-slot-charcoal/90 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
        >
          Slotwise automatically organizes the chaos into a <br className="hidden md:block"/> mathematically verified schedule.
        </motion.p>
      </div>
      
    </section>
  );
};

export default ChaosToOrder;
