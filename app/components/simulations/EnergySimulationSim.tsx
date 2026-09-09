'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap, Gauge, Award, Trophy, Volume2, VolumeX, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface EnergySimulationSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
}

// Synthesized Web Audio Sound Effects for Energy Sim
class CoasterAudio {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playMotorHum(powerRatio: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80 + powerRatio * 180, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playLoopWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playDockSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.25);
    });
  }

  playCrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const coasterAudio = new CoasterAudio();

export default function EnergySimulationSim({
  params,
  derived
}: EnergySimulationSimProps) {
  // Mode switcher: 'minigame' (Roller Coaster Loop Challenge) vs 'lab' (Harmonic Half-pipe)
  const [activeMode, setActiveMode] = useState<'minigame' | 'lab'>('minigame');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    coasterAudio.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Original Lab parameters
  const mass = Math.max(0.1, params.mass ?? 4);
  const initialHeight = Math.max(1, params.initialHeight ?? 10);
  const damping = Math.max(0, params.damping ?? 0);
  const g = 9.8;

  const totalEnergyInitial = mass * g * initialHeight;

  // =========================================================================
  // LAB MODE: HARMONIC HALF-PIPE OSCILLATION
  // =========================================================================
  const [isLabPlaying, setIsLabPlaying] = useState<boolean>(true);
  const [oscPhase, setOscPhase] = useState<number>(0);
  const [energyLossFactor, setEnergyLossFactor] = useState<number>(1.0);
  const labAnimRef = useRef<number | null>(null);
  const labLastTime = useRef<number | null>(null);

  useEffect(() => {
    setOscPhase(0);
    setEnergyLossFactor(1.0);
    setIsLabPlaying(true);
  }, [mass, initialHeight, damping]);

  useEffect(() => {
    if (activeMode !== 'lab' || !isLabPlaying) {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
      labLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (labLastTime.current === null) labLastTime.current = timestamp;
      const dt = Math.min(0.05, (timestamp - labLastTime.current) / 1000);
      labLastTime.current = timestamp;

      const omega = 1.8;
      setOscPhase((prev) => (prev + omega * dt) % (2 * Math.PI));

      if (damping > 0) {
        setEnergyLossFactor((prev) => Math.max(0.05, prev * (1 - damping * 0.15 * dt)));
      }

      labAnimRef.current = requestAnimationFrame(step);
    };

    labAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
    };
  }, [isLabPlaying, damping, activeMode]);

  // Lab Physical Values
  const effectiveH0 = initialHeight * energyLossFactor;
  const currentHeight = Math.max(0, effectiveH0 * Math.pow(Math.cos(oscPhase), 2));
  const currentPe = mass * g * currentHeight;
  const currentKe = Math.max(0, mass * g * effectiveH0 - currentPe);
  const currentTotal = currentPe + currentKe;
  const currentVelocity = Math.sqrt(Math.max(0, (2 * currentKe) / mass));
  const thermalLoss = Math.max(0, totalEnergyInitial - currentTotal);

  const normalizedX = Math.cos(oscPhase);
  const cartCx = 360 + normalizedX * 220;
  const cartCy = 270 - (currentHeight / Math.max(1, initialHeight)) * 170;

  const maxBarEnergy = Math.max(100, totalEnergyInitial * 1.1);
  const pePct = Math.min(100, (currentPe / maxBarEnergy) * 100);
  const kePct = Math.min(100, (currentKe / maxBarEnergy) * 100);
  const totalPct = Math.min(100, (currentTotal / maxBarEnergy) * 100);
  const lossPct = Math.min(100, (thermalLoss / maxBarEnergy) * 100);

  // =========================================================================
  // MINIGAME MODE: WORK, POWER & ROLLER COASTER LOOP CHALLENGE
  // =========================================================================
  // Track parameters:
  // Launch Hill: x from 40 to 180 (height h = 12m)
  // Drop: x from 180 to 280 (h drops to 0m, KE maximum)
  // Loop: Center at x = 380, y = 200, Radius R = 60px (top height h = 8m)
  // Docking Straightaway: x from 480 to 680 (Dock bay: 600 to 670)
  const [coasterState, setCoasterState] = useState<'docked' | 'launching' | 'running' | 'looping' | 'docking' | 'cleared' | 'crashed' | 'stalled'>('docked');
  const [enginePower, setEnginePower] = useState<number>(450); // W (Joules/sec)
  const [brakeIntensity, setBrakeIntensity] = useState<number>(0); // 0 to 1
  const [coasterDist, setCoasterDist] = useState<number>(0); // 0 to 1 along track path
  const [cartVel, setCartVel] = useState<number>(0); // m/s
  const [totalWorkDone, setTotalWorkDone] = useState<number>(0); // Joules
  const [normalForceG, setNormalForceG] = useState<number>(1.0); // Gs
  const [starsEarned, setStarsEarned] = useState<number>(0);

  const coasterAnimRef = useRef<number | null>(null);
  const coasterLastTime = useRef<number | null>(null);

  const resetCoaster = () => {
    setCoasterState('docked');
    setCoasterDist(0);
    setCartVel(0);
    setTotalWorkDone(0);
    setNormalForceG(1.0);
    setBrakeIntensity(0);
  };

  const launchCoaster = () => {
    if (coasterState !== 'docked') return;
    setCoasterState('launching');
    setCartVel(2.0);
  };

  // Minigame Loop Animation
  useEffect(() => {
    if (activeMode !== 'minigame') return;
    if (coasterState === 'docked' || coasterState === 'cleared' || coasterState === 'crashed' || coasterState === 'stalled') {
      if (coasterAnimRef.current) cancelAnimationFrame(coasterAnimRef.current);
      coasterLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (coasterLastTime.current === null) coasterLastTime.current = timestamp;
      const dt = Math.min(0.04, (timestamp - coasterLastTime.current) / 1000);
      coasterLastTime.current = timestamp;

      setCoasterDist((prevDist) => {
        let currentV = cartVel;

        // 1. Launch Zone (0.0 to 0.25): Engine applies Power P = F * v
        if (prevDist < 0.25) {
          const power = enginePower; // Watts
          // Delta KE = P * dt
          const deltaKE = power * dt;
          setTotalWorkDone((w) => w + deltaKE);
          const newKE = 0.5 * mass * currentV * currentV + deltaKE;
          currentV = Math.sqrt(Math.max(0.5, (2 * newKE) / mass));
          coasterAudio.playMotorHum(enginePower / 800);
        }

        // 2. Loop Zone (0.45 to 0.65): Inverting through Loop of Radius R = 4m
        // Critical top speed check: v_top >= sqrt(g * R) ~ sqrt(9.8 * 4) = 6.26 m/s
        const loopRadiusM = 4.0;
        const vCrit = Math.sqrt(g * loopRadiusM);

        if (prevDist >= 0.45 && prevDist <= 0.65) {
          // At peak of loop (dist ~ 0.55): PE gained = m * g * (2R) = 80 * mass
          // Velocity drops due to gravity: v_top = sqrt(v_in^2 - 2g(2R))
          const gLoss = g * loopRadiusM * 2 * (1 - Math.abs(prevDist - 0.55) / 0.1);
          const vAtLoop = Math.sqrt(Math.max(0, currentV * currentV - 0.3 * gLoss));

          // Normal force: N/mg = (v^2 / (g*R)) - 1 (at top)
          const gForce = (vAtLoop * vAtLoop) / (g * loopRadiusM) - 1.0;
          setNormalForceG(Math.max(0, gForce));

          if (vAtLoop < vCrit && prevDist > 0.52 && prevDist < 0.58) {
            // FAILED LOOP! Insufficient kinetic energy
            coasterAudio.playCrash();
            setCoasterState('stalled');
            return prevDist;
          }
          currentV = vAtLoop;
        } else {
          setNormalForceG(1.0 + (currentV / 15));
        }

        // 3. Braking Zone (0.75 to 1.0): Regenerative braking or drag
        if (prevDist >= 0.75) {
          if (brakeIntensity > 0) {
            // Apply braking deceleration
            const brakeDecel = brakeIntensity * 9.0;
            currentV = Math.max(0, currentV - brakeDecel * dt);
          } else {
            // Natural track friction
            currentV = Math.max(0, currentV - 0.8 * dt);
          }
        }

        setCartVel(currentV);

        // Advance along track
        const trackSpeedMultiplier = 0.14; // progress per second at 10m/s
        const nextDist = prevDist + (currentV / 10) * trackSpeedMultiplier * dt;

        // Check Docking Station Finish (dist >= 0.95)
        if (nextDist >= 0.95) {
          if (currentV <= 3.2) {
            // PERFECT DOCK!
            coasterAudio.playDockSuccess();
            setCoasterState('cleared');
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            // Calculate Stars
            let stars = 1; // Completed loop
            if (currentV <= 2.2) stars++; // Smooth gentle dock
            if (totalWorkDone <= 1200) stars++; // Efficient engine power
            setStarsEarned(stars);
            return 0.96;
          } else {
            // CRASHED INTO BUFFER!
            coasterAudio.playCrash();
            setCoasterState('crashed');
            return 0.98;
          }
        }

        return nextDist;
      });

      coasterAnimRef.current = requestAnimationFrame(step);
    };

    coasterAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (coasterAnimRef.current) cancelAnimationFrame(coasterAnimRef.current);
    };
  }, [activeMode, coasterState, cartVel, enginePower, brakeIntensity, mass]);

  // SVG Coordinates for Coaster Track
  // Path consists of:
  // Hill top (60, 110) -> Dip (220, 270) -> Loop entry (330, 270) -> Loop top (390, 90) -> Loop exit (450, 270) -> Dock (650, 270)
  const getTrackPoint = (t: number) => {
    const clampedT = Math.min(1, Math.max(0, t));
    if (clampedT < 0.25) {
      // Launch ramp down
      const u = clampedT / 0.25;
      const px = 60 + u * 160;
      const py = 120 + (1 - Math.cos(u * Math.PI)) * 75;
      return { x: px, y: py, angle: 25 * Math.sin(u * Math.PI) };
    } else if (clampedT < 0.45) {
      // Valley run into loop
      const u = (clampedT - 0.25) / 0.2;
      const px = 220 + u * 110;
      const py = 270;
      return { x: px, y: py, angle: 0 };
    } else if (clampedT < 0.65) {
      // Loop-the-loop: Circle center at (385, 190), radius 80px
      const u = (clampedT - 0.45) / 0.2; // 0 to 1
      const loopAngle = -Math.PI / 2 + u * 2 * Math.PI; // -90 deg to 270 deg
      const px = 385 + 75 * Math.sin(loopAngle);
      const py = 195 - 75 * Math.cos(loopAngle);
      return { x: px, y: py, angle: (loopAngle * 180) / Math.PI };
    } else {
      // Docking straightaway
      const u = (clampedT - 0.65) / 0.35;
      const px = 460 + u * 200;
      const py = 270;
      return { x: px, y: py, angle: 0 };
    }
  };

  const currentCartPt = getTrackPoint(coasterDist);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMode('minigame')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'minigame'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Roller Coaster Loop Minigame</span>
            </button>
            <button
              onClick={() => setActiveMode('lab')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'lab'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Harmonic Half-Pipe Lab</span>
            </button>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Dynamic Metric Display */}
        {activeMode === 'minigame' ? (
          <div className="flex items-center space-x-4">
            <div className="text-amber-300 font-bold">
              Speed: <span className="text-white">{cartVel.toFixed(1)} m/s</span>
            </div>
            <div className="text-cyan-300 font-bold">
              G-Force: <span className="text-white">{normalForceG.toFixed(1)} G</span>
            </div>
            <div className="text-emerald-300 font-bold">
              Work Done: <span className="text-white">{totalWorkDone.toFixed(0)} J</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-slate-300">
            <div>
              <span className="text-slate-500">Height h: </span>
              <strong className="text-amber-300">{currentHeight.toFixed(1)} m</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Velocity v: </span>
              <strong className="text-cyan-300">{currentVelocity.toFixed(1)} m/s</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Total E: </span>
              <strong className="text-emerald-300">{currentTotal.toFixed(0)} J</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#060b18] overflow-hidden">
        
        {/* ================================================================= */}
        {/* MODE A: ROLLER COASTER POWER LOOP MINIGAME                        */}
        {/* ================================================================= */}
        {activeMode === 'minigame' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            <defs>
              <linearGradient id="loopSteel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="dockZone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Ground & Grid */}
            <line x1="0" y1="270" x2="720" y2="270" stroke="#1e293b" strokeWidth="2" />

            {/* Support Pillars */}
            {[100, 180, 310, 385, 460, 560, 650].map((px) => (
              <line
                key={`pillar-${px}`}
                x1={px}
                y1={px === 385 ? 120 : px < 200 ? 150 : 270}
                x2={px}
                y2="310"
                stroke="#334155"
                strokeWidth="3"
                strokeDasharray="4,4"
              />
            ))}

            {/* 1. Launch Ramp & Loop Track Path */}
            <path
              d="M 40,120 C 140,120 180,270 240,270 L 330,270 C 330,270 340,270 360,240 C 375,200 375,120 385,120 C 395,120 395,200 410,240 C 420,270 440,270 460,270 L 680,270"
              fill="none"
              stroke="url(#loopSteel)"
              strokeWidth="6"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            />
            {/* Railroad Ties */}
            <path
              d="M 40,120 C 140,120 180,270 240,270 L 330,270 C 330,270 340,270 360,240 C 375,200 375,120 385,120 C 395,120 395,200 410,240 C 420,270 440,270 460,270 L 680,270"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeDasharray="6,8"
            />

            {/* 2. Docking Bay Area (x = 580 to 670) */}
            <rect x="580" y="240" width="90" height="30" rx="4" fill="url(#dockZone)" stroke="#10b981" strokeWidth="1.5" />
            <text x="625" y="258" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              DOCKING BAY (v ≤ 3m/s)
            </text>
            {/* End Safety Buffer Wall */}
            <rect x="670" y="220" width="16" height="50" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
            <text x="678" y="250" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">STOP</text>

            {/* Loop G-Force & Physics Indicator */}
            <g transform="translate(385, 80)">
              <rect x="-65" y="-12" width="130" height="24" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
              <text x="0" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                Loop: v_top ≥ √(gR)
              </text>
            </g>

            {/* Coaster Cart on Track */}
            <g transform={`translate(${currentCartPt.x}, ${currentCartPt.y}) rotate(${currentCartPt.angle})`}>
              {/* Cart Body */}
              <rect
                x="-18"
                y="-18"
                width="36"
                height="18"
                rx="4"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1.8"
                className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              />
              {/* Wheels */}
              <circle cx="-10" cy="0" r="4.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="10" cy="0" r="4.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Passenger Hero Glow */}
              <circle cx="0" cy="-10" r="5" fill="#ef4444" />
            </g>
          </svg>
        )}

        {/* Victory Clear Overlay */}
        {coasterState === 'cleared' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              {Array.from({ length: starsEarned }).map((_, i) => (
                <Award key={i} className="w-8 h-8 fill-current text-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">LOOP CONQUERED & DOCKED!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Centripetal acceleration overcame gravity ($v \ge \sqrt{'{gR}'}$), and regenerative braking docked the cart safely. Total Energy Expended: {totalWorkDone.toFixed(0)} J.
            </p>
            <button
              onClick={resetCoaster}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rerun Challenge</span>
            </button>
          </div>
        )}

        {/* Crash / Stall Overlay */}
        {(coasterState === 'crashed' || coasterState === 'stalled') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <h2 className="text-2xl font-black text-rose-400 tracking-wide mb-1">
              {coasterState === 'stalled' ? 'STALLED AT LOOP APEX!' : 'CRASHED INTO DOCKING BUFFER!'}
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              {coasterState === 'stalled'
                ? 'The cart lacked sufficient kinetic energy. Increase motor power so entry speed satisfies v_top ≥ √(g·R).'
                : 'The cart approached the docking bay too fast (v > 3.2 m/s). Increase regenerative brake intensity before reaching the buffer!'}
            </p>
            <button
              onClick={resetCoaster}
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Coaster Run</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE B: ORIGINAL HARMONIC HALF-PIPE LAB                           */}
        {/* ================================================================= */}
        {activeMode === 'lab' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            {/* Parabolic Half-Pipe Track */}
            <path
              d="M 140,100 Q 360,330 580,100"
              fill="none"
              stroke="#334155"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 140,100 Q 360,330 580,100"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Max Release Height Line */}
            <line
              x1="120"
              y1={270 - (initialHeight / initialHeight) * 170}
              x2="600"
              y2={270 - (initialHeight / initialHeight) * 170}
              stroke="#eab308"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <text x="125" y={270 - (initialHeight / initialHeight) * 170 - 6} fill="#eab308" fontSize="10" fontFamily="monospace">
              Release h₀ = {initialHeight}m
            </text>

            {/* Oscillating Cart */}
            <g transform={`translate(${cartCx}, ${cartCy})`}>
              <rect
                x="-16"
                y="-14"
                width="32"
                height="16"
                rx="3"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="filter drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]"
              />
              <circle cx="-9" cy="2" r="3.5" fill="#0f172a" />
              <circle cx="9" cy="2" r="3.5" fill="#0f172a" />
            </g>
          </svg>
        )}
      </div>

      {/* Interactive Controls Bar */}
      {activeMode === 'minigame' ? (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
          {/* Engine Power Throttle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4" />
              <span>Motor Power:</span>
            </div>
            <input
              type="range"
              min="200"
              max="850"
              step="25"
              value={enginePower}
              disabled={coasterState !== 'docked'}
              onChange={(e) => setEnginePower(parseFloat(e.target.value))}
              className="accent-amber-400 cursor-pointer w-28 h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono text-slate-300 w-14">{enginePower} W</span>
          </div>

          {/* Regenerative Brake Trigger */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-rose-400 font-bold text-xs">
              <Gauge className="w-4 h-4" />
              <span>Dock Brakes:</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={brakeIntensity}
              onChange={(e) => setBrakeIntensity(parseFloat(e.target.value))}
              className="accent-rose-500 cursor-pointer w-28 h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono text-slate-300 w-12">{Math.round(brakeIntensity * 100)}%</span>
          </div>

          {/* Action Launch Button */}
          <div className="flex items-center space-x-2">
            {coasterState === 'docked' ? (
              <button
                onClick={launchCoaster}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH COASTER</span>
              </button>
            ) : (
              <button
                onClick={resetCoaster}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Run</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLabPlaying(!isLabPlaying)}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
            >
              {isLabPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isLabPlaying ? 'Pause' : 'Oscillate'}</span>
            </button>
            <button
              onClick={() => {
                setOscPhase(0);
                setEnergyLossFactor(1.0);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Energy Bargraphs */}
          <div className="flex items-center space-x-4 text-[10px] font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="text-amber-400 font-bold">PE:</span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 transition-all" style={{ width: `${pePct}%` }} />
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-bold">KE:</span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all" style={{ width: `${kePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
