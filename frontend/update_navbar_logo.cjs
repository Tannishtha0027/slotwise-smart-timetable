const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const originalLogoBlock = `{/* Logo - NO NAVIGATION */}
        <div className="flex items-center gap-2 cursor-default">
          <div className="w-8 h-8 bg-slot-indigo rounded-lg flex items-center justify-center transform rotate-3">
            <span className="text-slot-cream font-bold text-xl leading-none -rotate-3">S</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slot-indigo">SLOTWISE</span>
        </div>`;

const newLogoBlock = `{/* Logo */}
        <Link 
          to="/" 
          aria-label="Go to Slotwise home"
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-slot-indigo focus:ring-offset-2 rounded-lg"
        >
          <div className="w-8 h-8 bg-slot-indigo rounded-lg flex items-center justify-center transform rotate-3">
            <span className="text-slot-cream font-bold text-xl leading-none -rotate-3">S</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slot-indigo">SLOTWISE</span>
        </Link>`;

if (content.includes(originalLogoBlock)) {
    content = content.replace(originalLogoBlock, newLogoBlock);
    fs.writeFileSync('src/components/Navbar.tsx', content);
    console.log("Navbar logo successfully updated to a navigation link!");
} else {
    console.log("Could not find the exact original logo block.");
}
