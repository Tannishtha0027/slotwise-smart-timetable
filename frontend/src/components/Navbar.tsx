import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = location.pathname === '/';
  const generateTimetableRoute = isLanding ? '/dashboard' : '/create';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slot-cream/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          aria-label="Go to Slotwise home"
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-slot-indigo focus:ring-offset-2 rounded-lg"
        >
          <div className="w-8 h-8 bg-slot-indigo rounded-lg flex items-center justify-center transform rotate-3">
            <span className="text-slot-cream font-bold text-xl leading-none -rotate-3">S</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slot-indigo">SLOTWISE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slot-charcoal/80">
          <Link to="/dashboard" className="hover:text-slot-indigo transition-colors relative group cursor-pointer">
            <span className={location.pathname === '/dashboard' ? 'text-slot-indigo font-bold' : ''}>Dashboard</span>
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-slot-yellow transition-all ${location.pathname === '/dashboard' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <a href="#how-it-works" onClick={(e) => {
            if (isLanding) {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = '/#how-it-works';
            }
          }} className="hover:text-slot-indigo transition-colors relative group cursor-pointer">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slot-yellow transition-all group-hover:w-full"></span>
          </a>
          <Link to="/result" className="hover:text-slot-indigo transition-colors relative group cursor-pointer">
            Timetable
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slot-yellow transition-all group-hover:w-full"></span>
          </Link>
          
          <Link to={generateTimetableRoute} className="bg-slot-indigo text-slot-cream px-6 py-2.5 rounded-full font-semibold hover:bg-slot-indigo/90 hover:shadow-paper transition-all transform hover:-translate-y-0.5 inline-block text-center">
            Generate Timetable
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slot-indigo"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slot-cream border-t border-slot-indigo/10 px-6 py-4 flex flex-col gap-4 overflow-hidden"
          >
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium cursor-pointer ${location.pathname === '/dashboard' ? 'text-slot-indigo font-bold' : 'text-slot-charcoal'}`}>Dashboard</Link>
            <a href="#how-it-works" onClick={(e) => {
              setMobileMenuOpen(false);
              if (isLanding) {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#how-it-works';
              }
            }} className="text-lg font-medium text-slot-charcoal cursor-pointer">How It Works</a>
            <Link to="/result" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slot-charcoal cursor-pointer">Timetable</Link>
            <Link to={generateTimetableRoute} onClick={() => setMobileMenuOpen(false)} className="bg-slot-indigo text-slot-cream px-6 py-3 rounded-xl font-semibold w-full mt-2 inline-block text-center">
              Generate Timetable
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
