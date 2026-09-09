'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ShieldAlert, Sparkles, Box, Trophy, Star, Volume2, VolumeX, Flame, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface ForceSimulationSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
}

// Web Audio Synthesizer for Force Sim
class ForceAudio {
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

  playThruster() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
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
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

const forceAudio = new ForceAudio();

export default function ForceSimulationSim({
  params,
  derived
}: ForceSimulationSimProps) {
  // Mode: 'minigame' (Incline Cargo Docking) vs 'lab' (Free-Body Diagram Lab)
  const [activeMode, setActiveMode] = useState<'minigame' | 'lab'>('minigame');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    forceAudio.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Original Lab parameters
  const F_app = params.appliedForce ?? 30;
  const mass = Math.max(0.1, params.mass ?? 5);
  const mu = Math.max(0, params.frictionCoeff ?? 0.2);
  const inclineDeg = params.inclineAngle ?? 0;

  const normalForce = derived.normalForce ?? (mass * 9.8 * Math.cos((inclineDeg * Math.PI) / 180));
  const frictionForce = derived.frictionForce ?? (mu * normalForce);
  const acceleration = derived.acceleration ?? ((F_app - frictionForce) / mass);
  const netForce = derived.netForce ?? (acceleration * mass);

  // =========================================================================
  // MINIGAME MODE: INCLINE CARGO DOCKING CHALLENGE
  // =========================================================================
  // Ramp inclined at 18 degrees with friction
  // Cargo starts at ramp bottom (pos = 50px).
  // Target docking bay is at pos = 460px to 540px.
  // Player taps "Pulse Thruster" to impart upward force.
  const gameInclineDeg = 18;
  const gameInclineRad = (gameInclineDeg * Math.PI) / 180;
  const gDownRamp = 9.8 * Math.sin(gameInclineRad); // gravity pulling down ramp
  const frictDecel = mu * 9.8 * Math.cos(gameInclineRad); // friction deceleration

  const [cargoPos, setCargoPos] = useState<number>(50); // px along ramp
  const [cargoVel, setCargoVel] = useState<number>(0); // m/s
  const [cargoState, setCargoState] = useState<'ready' | 'moving' | 'docked' | 'crashed' | 'fallen'>('ready');
  const [thrusterPulsing, setThrusterPulsing] = useState<boolean>(false);
  const [dockingScore, setDockingScore] = useState<number>(0);

  const gameAnimRef = useRef<number | null>(null);
  const gameLastTime = useRef<number | null>(null);

  const resetCargoGame = () => {
    setCargoPos(50);
    setCargoVel(0);
    setCargoState('ready');
    setThrusterPulsing(false);
  };

  const pulseUpwardThrust = () => {
    if (cargoState === 'docked' || cargoState === 'crashed' || cargoState === 'fallen') return;
    forceAudio.playThruster();
    setThrusterPulsing(true);
    setTimeout(() => setThrusterPulsing(false), 180);

    // Apply impulse: +3.8 m/s
    setCargoVel((v) => Math.min(12, v + 3.8));
    if (cargoState === 'ready') setCargoState('moving');
  };

  // Minigame Physics Step Loop
  useEffect(() => {
    if (activeMode !== 'minigame' || cargoState === 'ready' || cargoState === 'docked' || cargoState === 'crashed' || cargoState === 'fallen') {
      if (gameAnimRef.current) cancelAnimationFrame(gameAnimRef.current);
      gameLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (gameLastTime.current === null) gameLastTime.current = timestamp;
      const dt = Math.min(0.04, (timestamp - gameLastTime.current) / 1000);
      gameLastTime.current = timestamp;

      setCargoVel((prevV) => {
        // Net acceleration along ramp:
        // Downward gravity: -gDownRamp
        // Friction: opposes motion
        let netA = -gDownRamp;
        if (prevV > 0.05) {
          netA -= frictDecel;
        } else if (prevV < -0.05) {
          netA += frictDecel;
        } else {
          // Static friction check: if gravity pull <= max static friction, crate stays still
          if (Math.abs(gDownRamp) <= frictDecel * 1.1) {
            return 0;
          }
        }
        return prevV + netA * dt;
      });

      setCargoPos((prevPos) => {
        const nextPos = prevPos + cargoVel * 35 * dt;

        // Check if crate stopped inside the docking zone (460 to 530)
        if (nextPos >= 460 && nextPos <= 530 && Math.abs(cargoVel) < 0.3) {
          setCargoState('docked');
          forceAudio.playDockSuccess();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          setDockingScore((s) => s + 1000);
          return nextPos;
        }

        // Crashed into end wall (pos > 570)
        if (nextPos > 570) {
          setCargoState('crashed');
          forceAudio.playCrash();
          return 575;
        }

        // Slipped off bottom ramp (pos < 30)
        if (nextPos < 30) {
          setCargoState('fallen');
          forceAudio.playCrash();
          return 25;
        }

        return nextPos;
      });

      gameAnimRef.current = requestAnimationFrame(step);
    };

    gameAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (gameAnimRef.current) cancelAnimationFrame(gameAnimRef.current);
    };
  }, [activeMode, cargoState, cargoVel, gDownRamp, frictDecel]);

  // =========================================================================
  // LAB MODE: ORIGINAL FREE-BODY DIAGRAM LAB
  // =========================================================================
  const [isLabPlaying, setIsLabPlaying] = useState<boolean>(false);
  const [labPos, setLabPos] = useState<number>(50);
  const [labVel, setLabVel] = useState<number>(0);
  const labAnimRef = useRef<number | null>(null);
  const labLastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setLabPos(50);
    setLabVel(0);
    setIsLabPlaying(false);
  }, [mass, inclineDeg]);

  useEffect(() => {
    if (activeMode !== 'lab' || !isLabPlaying) {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
      labLastTimeRef.current = null;
      return;
    }

    const update = (timestamp: number) => {
      if (labLastTimeRef.current === null) labLastTimeRef.current = timestamp;
      const dt = Math.min(0.05, (timestamp - labLastTimeRef.current) / 1000);
      labLastTimeRef.current = timestamp;

      setLabVel((prevV) => {
        const nextV = prevV + acceleration * dt;
        if (acceleration < 0 && nextV <= 0 && prevV > 0) {
          setIsLabPlaying(false);
          return 0;
        }
        return Math.max(0, nextV);
      });

      setLabPos((prevX) => {
        const nextX = prevX + labVel * 15 * dt;
        return nextX > 580 ? 50 : nextX;
      });

      labAnimRef.current = requestAnimationFrame(update);
    };

    labAnimRef.current = requestAnimationFrame(update);

    return () => {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
    };
  }, [activeMode, isLabPlaying, acceleration, labVel]);

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
              <Box className="w-3.5 h-3.5" />
              <span>Incline Cargo Docking Minigame</span>
            </button>
            <button
              onClick={() => setActiveMode('lab')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'lab'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Free-Body Diagram Lab</span>
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
              Score: <span className="text-white">{dockingScore}</span>
            </div>
            <div className="text-cyan-300 font-bold">
              Speed: <span className="text-white">{cargoVel.toFixed(1)} m/s</span>
            </div>
            <div className="text-emerald-400 font-bold">
              Friction μ: <span className="text-white">{mu.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-slate-300">
            <div>
              <span className="text-slate-500">Net Force: </span>
              <strong className={netForce >= 0 ? 'text-emerald-300' : 'text-rose-400'}>{netForce.toFixed(1)} N</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Friction: </span>
              <strong className="text-rose-400">{frictionForce.toFixed(1)} N</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Accel: </span>
              <strong className="text-amber-300">{acceleration.toFixed(2)} m/s²</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#060a16] overflow-hidden">
        
        {/* ================================================================= */}
        {/* MODE A: INCLINE CARGO DOCKING MINIGAME                            */}
        {/* ================================================================= */}
        {activeMode === 'minigame' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            <defs>
              <linearGradient id="rampWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="dockGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Incline Ramp Surface */}
            {/* Ramp starts at (60, 260) and rises at 18 degrees to (620, 110) */}
            <line x1="40" y1="265" x2="620" y2="100" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <line x1="40" y1="265" x2="620" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" />

            {/* Docking Bay Platform (pos 460 to 530) */}
            {(() => {
              const dockT1 = 460 / 600;
              const dockT2 = 530 / 600;
              const x1 = 40 + dockT1 * 580;
              const y1 = 265 - dockT1 * 165;
              const x2 = 40 + dockT2 * 580;
              const y2 = 265 - dockT2 * 165;
              return (
                <g>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 20} fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    DOCKING BAY (STOP HERE)
                  </text>
                </g>
              );
            })()}

            {/* End Stopper Wall */}
            <rect x="615" y="65" width="14" height="45" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />

            {/* Cargo Box moving along ramp */}
            {(() => {
              const t = Math.min(1, Math.max(0, cargoPos / 600));
              const cx = 40 + t * 580;
              const cy = 265 - t * 165;

              return (
                <g transform={`translate(${cx}, ${cy}) rotate(-18)`}>
                  {/* Cargo Crate */}
                  <rect
                    x="-24"
                    y="-36"
                    width="48"
                    height="36"
                    rx="3"
                    fill="#d97706"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                  />
                  {/* Crate Straps */}
                  <line x1="-24" y1="-18" x2="24" y2="-18" stroke="#92400e" strokeWidth="2" />
                  <line x1="0" y1="-36" x2="0" y2="0" stroke="#92400e" strokeWidth="2" />

                  {/* Rocket Thruster Flame (when pulsing) */}
                  {thrusterPulsing && (
                    <g transform="translate(-24, -18)">
                      <polygon points="0,-6 -18,0 0,6" fill="#ef4444" className="animate-ping" />
                    </g>
                  )}
                </g>
              );
            })()}
          </svg>
        )}

        {/* Docked Success Overlay */}
        {cargoState === 'docked' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <ShieldCheck className="w-10 h-10 text-emerald-400 animate-bounce mb-2" />
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">CARGO DOCKED SAFELY!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Balanced gravitational pull ($mg\sin\theta$) and friction ($\mu mg\cos\theta$) perfectly to bring the cargo to rest.
            </p>
            <button
              onClick={resetCargoGame}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Dock Another Crate</span>
            </button>
          </div>
        )}

        {/* Crashed / Fallen Overlay */}
        {(cargoState === 'crashed' || cargoState === 'fallen') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <h2 className="text-2xl font-black text-rose-400 tracking-wide mb-1">
              {cargoState === 'crashed' ? 'CARGO CRASHED INTO STOPPER!' : 'CARGO SLIPPED OFF RAMP!'}
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              {cargoState === 'crashed'
                ? 'Too much upward thrust! The cargo had too much momentum entering the dock.'
                : 'Insufficient thrust to overcome gravity down the ramp. Pulse the thrusters to push it up!'}
            </p>
            <button
              onClick={resetCargoGame}
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE B: ORIGINAL FREE-BODY DIAGRAM LAB                            */}
        {/* ================================================================= */}
        {activeMode === 'lab' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            <line x1="40" y1="260" x2="680" y2="260" stroke="#334155" strokeWidth="4" />
            <g transform={`translate(${labPos}, 215)`}>
              <rect width="70" height="45" rx="4" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
              <text x="35" y="27" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                {mass} kg
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Bottom Interactive Controls */}
      {activeMode === 'minigame' ? (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
          <div className="text-xs text-slate-400">
            Tap thruster bursts to drive the crate up the incline into the green docking zone!
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={pulseUpwardThrust}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-[0_0_18px_rgba(245,158,11,0.7)] transition cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current text-rose-600" />
              <span>PULSE UPWARD THRUST</span>
            </button>
            <button
              onClick={resetCargoGame}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Reset Cargo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
          <button
            onClick={() => setIsLabPlaying(!isLabPlaying)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            {isLabPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isLabPlaying ? 'Pause' : 'Simulate'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
