import React, { useEffect, useRef } from 'react';

interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  className?: string;
}

const DotField: React.FC<DotFieldProps> = ({
  dotRadius = 1.3,
  dotSpacing = 16,
  bulgeStrength = 50,
  glowRadius = 150,
  sparkle = false,
  waveAmplitude = 0,
  cursorRadius = 450,
  cursorForce = 0.08,
  bulgeOnly = true,
  gradientFrom = "rgba(39, 32, 95, 0.22)",
  gradientTo = "rgba(245, 154, 61, 0.16)",
  glowColor = "#27205F",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; bx: number; by: number; a: number; vx: number; vy: number }[] = [];
    
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseInCanvas = false;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      initDots();
    };

    const initDots = () => {
      dots = [];
      const cols = Math.floor(width / dotSpacing);
      const rows = Math.floor(height / dotSpacing);
      const offsetX = (width - cols * dotSpacing) / 2;
      const offsetY = (height - rows * dotSpacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * dotSpacing;
          const y = offsetY + j * dotSpacing;
          dots.push({
            x,
            y,
            bx: x,
            by: y,
            a: Math.random() * Math.PI * 2,
            vx: 0,
            vy: 0
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      // We consider the mouse "in canvas" if it's over the window, 
      // since the canvas might be behind other pointer-events:auto elements.
      isMouseInCanvas = true; 
    };

    const onMouseLeave = () => {
      isMouseInCanvas = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);

    resize();

    let rAF: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, gradientFrom);
      gradient.addColorStop(1, gradientTo);
      ctx.fillStyle = gradient;

      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        
        let dx = p.bx;
        let dy = p.by;

        if (!reducedMotion) {
          let dist = Math.hypot(mouseX - p.bx, mouseY - p.by);
          
          if (dist < cursorRadius && isMouseInCanvas) {
            const force = (cursorRadius - dist) / cursorRadius;
            const angle = Math.atan2(p.by - mouseY, p.bx - mouseX);
            
            if (bulgeOnly) {
              const push = force * bulgeStrength;
              dx += Math.cos(angle) * push;
              dy += Math.sin(angle) * push;
            } else {
              p.vx += Math.cos(angle) * force * cursorForce;
              p.vy += Math.sin(angle) * force * cursorForce;
            }
          }

          if (!bulgeOnly) {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.85; 
            p.vy *= 0.85;
            p.vx += (p.bx - p.x) * 0.05;
            p.vy += (p.by - p.y) * 0.05;
            dx = p.x;
            dy = p.y;
          }

          if (waveAmplitude > 0) {
            dy += Math.sin(time + p.bx * 0.01 + p.by * 0.01) * waveAmplitude;
          }
        }

        let radius = dotRadius;
        if (sparkle && !reducedMotion) {
          radius += Math.sin(time * 3 + p.a) * (dotRadius * 0.5);
        }

        ctx.beginPath();
        ctx.arc(dx, dy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isMouseInCanvas && glowRadius > 0 && !reducedMotion) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.15;
        const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
        mouseGlow.addColorStop(0, glowColor);
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rAF = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      cancelAnimationFrame(rAF);
    };
  }, [
    dotRadius, dotSpacing, bulgeStrength, glowRadius, sparkle, 
    waveAmplitude, cursorRadius, cursorForce, bulgeOnly, 
    gradientFrom, gradientTo, glowColor
  ]);

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block pointer-events-none" />
    </div>
  );
};

export default DotField;
