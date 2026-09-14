import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import DotField from '../components/DotField'
import ChaosToOrder from '../components/ChaosToOrder'
import HowItWorks from '../components/HowItWorks'
import Verification from '../components/Verification'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slot-cream">
      <Navbar />
      
      <main className="flex-grow">
        <div className="relative w-full overflow-hidden">
          {/* Interactive DotField Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <DotField 
              dotRadius={1.3}
              dotSpacing={16}
              bulgeStrength={50}
              glowRadius={60}
              sparkle={false}
              waveAmplitude={0}
              cursorRadius={180}
              cursorForce={0.08}
              bulgeOnly={true}
              gradientFrom="rgba(39, 32, 95, 0.22)"
              gradientTo="rgba(245, 154, 61, 0.16)"
              glowColor="#27205F"
            />
          </div>
          
          <div className="relative z-10 pt-24">
            <Hero />
          </div>
        </div>

        <ChaosToOrder />
        <HowItWorks />
        <Verification />
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  )
}

export default Landing
