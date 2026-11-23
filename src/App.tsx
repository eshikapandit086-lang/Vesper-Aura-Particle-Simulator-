/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Snowflake, RefreshCw, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface Particle {
  id: string;
  type: 'snowflake' | 'balloon';
  x: number;          // Left position percentage (0 - 100)
  size: number;       // Base diameter in pixels
  duration: number;   // Animation travel duration (seconds)
  delay: number;      // Staggered launch delay (seconds)
  opacity: number;    // Particle transparency
  drift: number;      // Horizontal drift translation (pixels)
  spin: number;       // Final rotation angle or tilt degree
  color?: string;     // Color string for balloons
  createdAt: number;  // Spawning epoch timestamp
}

// Sophisticated Dark luxury metallic/gilded color palette for balloons
const LUXURY_BALLOON_COLORS = [
  '#c5a059', // Brushed Gold
  '#d4af37', // Metallic Gilded Gold
  '#e5c158', // Champagne Gold
  '#9a8050', // Antique Bronze
  '#bfa370', // Satin Brass
  '#dfba6b', // Soft Sand Gold
  '#f3e5ab', // Vanilla Cream Pearl
];

export default function App() {
  const [activeEffect, setActiveEffect] = useState<'snowflakes' | 'balloons' | null>(null);
  const [effectTriggerId, setEffectTriggerId] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generator: Snowflakes Cohort
  // Spawns 50 medium-sized snowflakes staggered across the 5-second generation window.
  const triggerSnowflakes = () => {
    const count = 50;
    const baseTime = Date.now();
    const newSnowflakes: Particle[] = [];

    for (let i = 0; i < count; i++) {
      // Stagger initial launch points uniformly across a 5.0 second active period
      const delay = Math.random() * 5.0; 
      // Travel duration of individual snowflake from top to bottom
      const duration = 3.5 + Math.random() * 2.5; // 3.5s to 6s
      // Medium size category: between 22px and 34px
      const size = 22 + Math.random() * 12;
      // Slanted rotation speed and angle
      const spin = 120 + Math.random() * 240;
      // Horizontal drift sway range
      const drift = -50 + Math.random() * 100;
      // High-end translucent opacities suitable for dark backgrounds
      const opacity = 0.65 + Math.random() * 0.35;

      newSnowflakes.push({
        id: `snow-${i}-${Math.random()}`,
        type: 'snowflake',
        x: Math.random() * 100,
        size,
        duration,
        delay,
        opacity,
        drift,
        spin,
        createdAt: baseTime,
      });
    }

    setParticles(newSnowflakes);
    setEffectTriggerId(prev => prev + 1);
    setActiveEffect('snowflakes');
    setTimeLeft(5.0);
  };

  // Generator: Balloons Cohort
  // Spawns 35 gorgeous medium-sized gilded balloons staggered across the 5-second window.
  const triggerBalloons = () => {
    const count = 35;
    const baseTime = Date.now();
    const newBalloons: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 5.0;
      const duration = 4.0 + Math.random() * 2.5; // 4s to 6.5s
      // Medium size category: width of 38px to 50px
      const size = 38 + Math.random() * 12;
      // Slight atmospheric tilt on ascend (-15 to +15 degrees)
      const spin = -15 + Math.random() * 30;
      // Left-to-right float variance
      const drift = -70 + Math.random() * 140;
      // Premium glossy metallic opacities
      const opacity = 0.85 + Math.random() * 0.15;
      const color = LUXURY_BALLOON_COLORS[i % LUXURY_BALLOON_COLORS.length];

      newBalloons.push({
        id: `balloon-${i}-${Math.random()}`,
        type: 'balloon',
        x: 8 + Math.random() * 84, // Keep slightly inset from screen edge
        size,
        duration,
        delay,
        opacity,
        drift,
        spin, // Used as tilt-deg
        color,
        createdAt: baseTime,
      });
    }

    setParticles(newBalloons);
    setEffectTriggerId(prev => prev + 1);
    setActiveEffect('balloons');
    setTimeLeft(5.0);
  };

  // Safe Dynamic Clean-up Tick
  // Periodically removes particles from state after they complete their journey (delay + duration).
  // Strictly respects React primitives-only dependency rule to prevent infinite re-renders.
  useEffect(() => {
    if (particles.length === 0) return;

    const cleanupTimer = setInterval(() => {
      const now = Date.now();
      setParticles(prev => {
        return prev.filter(p => {
          const ageSeconds = (now - p.createdAt) / 1000;
          return ageSeconds < (p.delay + p.duration);
        });
      });
    }, 100);

    return () => clearInterval(cleanupTimer);
  }, [particles.length]);

  // Active 5-second Countdown Control Timer
  useEffect(() => {
    if (!activeEffect) return;

    const startTime = Date.now();
    const cycleDuration = 5000; // 5 seconds exact

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (cycleDuration - elapsed) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(tick);
        setActiveEffect(null);
      }
    }, 40);

    return () => clearInterval(tick);
  }, [activeEffect, effectTriggerId]);

  // Clean the entire board immediately
  const clearBoard = () => {
    setParticles([]);
    setActiveEffect(null);
    setTimeLeft(0);
  };

  return (
    <div 
      id="app-root"
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#d4af37]/20 border-[8px] md:border-[12px] border-[#111111] box-border transition-colors duration-1000"
    >
      {/* Dynamic atmospheric ambient backlighting */}
      <div 
        id="stage" 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-1000"
      >
        <div className={`absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-1000 opacity-20 bg-sky-500/10 ${activeEffect === 'snowflakes' ? 'opacity-40 scale-125 bg-blue-500/20' : ''}`} />
        <div className={`absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-1000 opacity-15 bg-[#d4af37]/10 ${activeEffect === 'balloons' ? 'opacity-45 scale-125 bg-[#d4af37]/25' : ''}`} />
      </div>

      {/* Header Section styled in ultra premium Sophisticated Minimalist line */}
      <header id="app-header" className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 gap-4">
        <div className="flex flex-col">
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-white mb-2 uppercase">
            Vesper <span className="text-[#d4af37] italic">Aura</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-mono text-white/40">
            Luxury Atmosphere Management Console
          </p>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
            Operational Mode
          </div>
          <div className="text-xs font-mono text-[#d4af37] flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${activeEffect ? 'bg-[#d4af37] animate-ping' : 'bg-white/40'}`} />
            {activeEffect === 'snowflakes' && 'SNOW CASCADING [ACTIVE]'}
            {activeEffect === 'balloons' && 'GILDED ASCENSION [ACTIVE]'}
            {!activeEffect && particles.length > 0 && 'POST-CYCLE RECOVERY'}
            {!activeEffect && particles.length === 0 && 'STANDBY [SYS_READY]'}
          </div>
        </div>
      </header>

      {/* Main interactive Motif stage */}
      <main id="main-content" className="relative z-10 w-full max-w-5xl px-6 py-12 md:py-20 flex-1 flex flex-col items-center justify-center gap-12 md:gap-16">
        
        <div className="text-center max-w-xl">
          <h2 className="font-display italic text-2xl md:text-3xl text-white/80 font-light mb-4 tracking-wide">
            Select Environment Motif
          </h2>
          <div className="h-px w-24 bg-[#d4af37] mx-auto opacity-50 mb-4"></div>
          {particles.length > 0 && (
            <p className="text-[11px] font-mono tracking-widest text-[#d4af37]/80 uppercase transition-all">
              {particles.length} Vectors Tracking • {activeEffect ? `${timeLeft.toFixed(1)}s Generation window` : 'Cooling Down'}
            </p>
          )}
        </div>

        {/* Circular high-end sensory Buttons */}
        <div id="btn-container" className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full">
          
          {/* Snowflakes Motif Button */}
          <div className="flex flex-col items-center gap-6">
            <button
              id="btn-snowflakes"
              onClick={triggerSnowflakes}
              className={`group relative w-48 h-48 md:w-56 md:h-56 rounded-full border flex items-center justify-center bg-transparent transition-all duration-700 active:scale-95 cursor-pointer
                ${activeEffect === 'snowflakes' 
                  ? 'border-[#d4af37] bg-white/5 ring-1 ring-[#d4af37]/35 shadow-lg shadow-[#d4af37]/5' 
                  : 'border-white/20 hover:border-[#d4af37] hover:bg-white/5'
                }
              `}
            >
              {/* Pulsing Outer rings */}
              <div className={`absolute inset-0 border rounded-full transition-transform duration-1000 
                ${activeEffect === 'snowflakes'
                  ? 'border-[#d4af37]/25 scale-110'
                  : 'border-white/5 scale-125 group-hover:scale-110'
                }`} 
              />
              <div className="absolute inset-0 border border-white/5 rounded-full scale-100 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex flex-col items-center z-10">
                <Snowflake className={`w-10 h-10 md:w-12 md:h-12 text-white mb-4 transition-all duration-700 opacity-70 group-hover:opacity-100 group-hover:text-[#d4af37] 
                  ${activeEffect === 'snowflakes' ? 'rotate-[180deg] text-[#d4af37] opacity-100 scale-110' : ''}`} 
                  strokeWidth={1}
                />
                <span className="font-display text-lg md:text-xl tracking-widest text-white uppercase group-hover:text-[#d4af37] transition-colors">
                  Snowflakes
                </span>
              </div>
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-mono text-center">
              Crystalline Descent [Medium]
            </p>
          </div>

          {/* Balloons Motif Button */}
          <div className="flex flex-col items-center gap-6">
            <button
              id="btn-balloons"
              onClick={triggerBalloons}
              className={`group relative w-48 h-48 md:w-56 md:h-56 rounded-full border flex items-center justify-center bg-transparent transition-all duration-700 active:scale-95 cursor-pointer
                ${activeEffect === 'balloons' 
                  ? 'border-[#d4af37] bg-white/5 ring-1 ring-[#d4af37]/35 shadow-lg shadow-[#d4af37]/5' 
                  : 'border-white/20 hover:border-[#d4af37] hover:bg-white/5'
                }
              `}
            >
              {/* Pulsing Outer rings */}
              <div className={`absolute inset-0 border rounded-full transition-transform duration-1000 
                ${activeEffect === 'balloons'
                  ? 'border-[#d4af37]/25 scale-110'
                  : 'border-white/5 scale-125 group-hover:scale-110'
                }`} 
              />
              <div className="absolute inset-0 border border-white/5 rounded-full scale-100 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex flex-col items-center z-10">
                {/* SVG Luxury Balloon Silhouette */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className={`w-10 h-10 md:w-12 md:h-12 text-white mb-4 transition-all duration-700 opacity-70 group-hover:opacity-100 group-hover:text-[#d4af37]
                    ${activeEffect === 'balloons' ? 'translate-y-[-4px] text-[#d4af37] opacity-100 scale-110' : ''}`}
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 12v10" />
                </svg>
                <span className="font-display text-lg md:text-xl tracking-widest text-white uppercase group-hover:text-[#d4af37] transition-colors">
                  Balloons
                </span>
              </div>
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-mono text-center">
              Gilded Ascension [Medium]
            </p>
          </div>

        </div>

        {/* Console Details & Live status */}
        <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-xl p-6 transition-all duration-700 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#d4af37]" />
              Console Status
            </span>
            <span>
              {activeEffect ? `${timeLeft.toFixed(1)}s active pool` : 'Pool Inactive'}
            </span>
          </div>

          <div className="h-[1px] w-full bg-white/5" />

          {/* Luxury Minimal status bar */}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-75 ease-linear
                ${activeEffect ? 'bg-[#d4af37]' : 'bg-white/10'}
              `}
              style={{ width: activeEffect ? `${(timeLeft / 5) * 100}%` : '0%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-white/50 text-center">
            <p className="mx-auto select-none">
              {activeEffect === 'snowflakes' && '❄️ Simulating medium-sized luxury crystalline drifts.'}
              {activeEffect === 'balloons' && '✨ Simulating exquisite upward floating gilded bodies.'}
              {!activeEffect && particles.length > 0 && '🌾 Final atmosphere cycles completing peacefully.'}
              {!activeEffect && particles.length === 0 && '✦ Select environment motif above to release kinetics.'}
            </p>
          </div>

          {particles.length > 0 && (
            <button
              id="btn-reset"
              onClick={clearBoard}
              className="mt-1 flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 active:scale-98 rounded-lg text-xs font-mono tracking-widest text-white uppercase transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Motif State</span>
            </button>
          )}
        </div>

      </main>

      {/* Signature Series Footer */}
      <footer id="app-footer" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] text-white/35 gap-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]/60" />
          <span>System Status: Optimal</span>
        </div>
        <span>Vesper Signature Series // No. 042</span>
        <span>Authorized Personnel Only</span>
      </footer>

      {/* Cinematic Falling / Rising Canvas Layer */}
      <div 
        id="particle-stage"
        className="fixed inset-0 pointer-events-none select-none z-40 overflow-hidden"
      >
        {particles.map((p) => {
          if (p.type === 'snowflake') {
            return (
              <div
                key={p.id}
                className="absolute text-white/80 animate-snowflake"
                style={{
                  left: `${p.x}%`,
                  '--fall-duration': `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  '--drift-x': `${p.drift}px`,
                  '--spin-deg': `${p.spin}deg`,
                  '--particle-opacity': p.opacity,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                } as React.CSSProperties}
              >
                {/* Standard snowflake shaped particles tailored for contrast */}
                <Snowflake 
                  className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" 
                  style={{ opacity: p.opacity }}
                />
              </div>
            );
          } else {
            // Balloon Render (Perfect satin gold luxury sphere or standard shape scaled as requested)
            return (
              <div
                key={p.id}
                className="absolute animate-balloon flex flex-col items-center"
                style={{
                  left: `${p.x}%`,
                  '--rise-duration': `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  '--drift-x': `${p.drift}px`,
                  '--tilt-deg': `${p.spin}deg`,
                  '--particle-opacity': p.opacity,
                  width: `${p.size}px`,
                  height: `${p.size * 1.5}px`, 
                } as React.CSSProperties}
              >
                <div 
                  className="relative w-full h-[65%] flex flex-col items-center"
                  style={{ color: p.color, opacity: p.opacity }}
                >
                  {/* Luxury Gilded Balloon Shape */}
                  <svg 
                    viewBox="0 0 40 50" 
                    width="100%" 
                    height="100%" 
                    className="overflow-visible filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                  >
                    {/* Perfect classic balloon contour */}
                    <path 
                      d="M20 0 C6 0 0 10 0 24 C0 38 7 48 18 50 L18 53 L16 53 C15 53 14 54 14 55 C14 56 15 57 16 57 L24 57 C25 57 26 56 26 55 C26 54 25 53 24 53 L22 53 L22 50 C33 48 40 38 40 24 C40 10 34 0 20 0 Z" 
                      fill="currentColor" 
                    />
                    {/* Shiny Reflection Overlay for Gilded Gloss Finish */}
                    <ellipse 
                      cx="12" 
                      cy="12" 
                      rx="3" 
                      ry="6.5" 
                      fill="#ffffff" 
                      opacity="0.3" 
                      transform="rotate(-15 12 12)" 
                    />
                  </svg>
                </div>
                {/* Thin atmospheric gold/silver thread */}
                <div className="w-[1px] h-[35%] bg-white/15 relative -mt-[2px] z-[-1]" />
              </div>
            );
          }
        })}
      </div>

    </div>
  );
}

