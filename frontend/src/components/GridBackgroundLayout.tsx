import { Outlet } from 'react-router-dom';

export default function GridBackgroundLayout() {
  return (
    <div 
      className="min-h-screen w-full font-sans text-slot-charcoal bg-[#F7F3EA] selection:bg-slot-yellow/30 selection:text-slot-indigo"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(20, 20, 20, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(20, 20, 20, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        backgroundAttachment: 'local' // ensures it scrolls with the page naturally
      }}
    >
      <Outlet />
    </div>
  );
}
