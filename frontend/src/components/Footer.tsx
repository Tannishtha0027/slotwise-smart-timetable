
const Footer = () => {
  return (
    <footer className="bg-slot-charcoal text-slot-cream/60 py-12 border-t-8 border-slot-indigo">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slot-cream/10 rounded flex items-center justify-center">
            <span className="text-slot-cream font-bold text-sm leading-none">S</span>
          </div>
          <span className="font-extrabold tracking-tight text-slot-cream text-lg">SLOTWISE</span>
        </div>

        <div className="text-sm font-medium">
          © {new Date().getFullYear()} Slotwise. Smart Exam Timetable Generator.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
