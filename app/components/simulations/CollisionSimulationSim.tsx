'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Swords, ArrowRight, Zap, Trophy, Star, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface CollisionSimulationSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
}

// Web Audio Synthesizer for Collision
class CollisionAudio {
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

  playImpact() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playPinHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playWin() {
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
}

const collisionAudio = new CollisionAudio();

interface TargetPin {
  id: string;
  x: number;
  hit: boolean;
}

export default function CollisionSimulationSim({
  params,
  derived
}: CollisionSimulationSimProps) {
  // Mode: 'derby' (Momentum Bumper Derby Minigame) vs 'lab' (Collision Analysis Lab)
  const [activeMode, setActiveMode] = useState<'derby' | 'lab'>('derby');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    collisionAudio.setSoundEnabled(soundOn);
  }, [soundOn]);

  const m1 = Math.max(0.1, params.m1 ?? 2);
  const v1 = params.v1 ?? 6;
  const m2 = Math.max(0.1, params.m2 ?? 2);
  const v2 = params.v2 ?? 0;
  const elasticity = Math.min(1, Math.max(0, params.elasticity ?? 1.0));

  const totalP_initial = derived.totalInitialMomentum ?? (m1 * v1 + m2 * v2);
  const v1Final = derived.v1Final ?? (((m1 - elasticity * m2) * v1 + (1 + elasticity) * m2 * v2) / (m1 + m2));
  const v2Final = derived.v2Final ?? (((1 + elasticity) * m1 * v1 + (m2 - elasticity * m1) * v2) / (m1 + m2));
  const totalP_final = derived.totalFinalMomentum ?? (m1 * v1Final + m2 * v2Final);

  // =========================================================================
  // MINIGAME MODE: MOMENTUM BUMPER DERBY
  // =========================================================================
  const [derbyPlaying, setDerbyPlaying] = useState<boolean>(false);
  const [derbyHasCollided, setDerbyHasCollided] = useState<boolean>(false);
  const [derbyCart1X, setDerbyCart1X] = useState<number>(80);
  const [derbyCart2X, setDerbyCart2X] = useState<number>(320);
  const [derbyV1, setDerbyV1] = useState<number>(v1);
  const [derbyV2, setDerbyV2] = useState<number>(v2);
  const [pins, setPins] = useState<TargetPin[]>([
    { id: 'p1', x: 500, hit: false },
    { id: 'p2', x: 560, hit: false },
    { id: 'p3', x: 620, hit: false }
  ]);
  const [derbyScore, setDerbyScore] = useState<number>(0);
  const [derbyCleared, setDerbyCleared] = useState<boolean>(false);

  const derbyAnimRef = useRef<number | null>(null);
  const derbyLastTime = useRef<number | null>(null);

  const resetDerby = () => {
    setDerbyPlaying(false);
    setDerbyHasCollided(false);
    setDerbyCart1X(80);
    setDerbyCart2X(320);
    setDerbyV1(v1);
    setDerbyV2(v2);
    setPins([
      { id: 'p1', x: 500, hit: false },
      { id: 'p2', x: 560, hit: false },
      { id: 'p3', x: 620, hit: false }
    ]);
    setDerbyCleared(false);
  };

  const launchDerby = () => {
    if (derbyPlaying) return;
    setDerbyPlaying(true);
  };

  useEffect(() => {
    if (activeMode !== 'derby' || !derbyPlaying || derbyCleared) {
      if (derbyAnimRef.current) cancelAnimationFrame(derbyAnimRef.current);
      derbyLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (derbyLastTime.current === null) derbyLastTime.current = timestamp;
      const dt = Math.min(0.04, (timestamp - derbyLastTime.current) / 1000);
      derbyLastTime.current = timestamp;

      setDerbyCart1X((x1) => {
        setDerbyCart2X((x2) => {
          const cart1W = 60;
          const cart2W = 60;
          let nextV1 = derbyV1;
          let nextV2 = derbyV2;

          // Check cart collision
          if (!derbyHasCollided && x1 + cart1W >= x2) {
            collisionAudio.playImpact();
            setDerbyHasCollided(true);
            nextV1 = v1Final;
            nextV2 = v2Final;
            setDerbyV1(nextV1);
            setDerbyV2(nextV2);
          }

          // Check Cart 2 hitting pins
          setPins((currentPins) => {
            let hitAny = false;
            const updated = currentPins.map((p) => {
              if (!p.hit && x2 + cart2W >= p.x) {
                hitAny = true;
                setDerbyScore((s) => s + 500);
                return { ...p, hit: true };
              }
              return p;
            });
            if (hitAny) collisionAudio.playPinHit();
            return updated;
          });

          return x2 + nextV2 * 35 * dt;
        });

        return x1 + derbyV1 * 35 * dt;
      });

      derbyAnimRef.current = requestAnimationFrame(step);
    };

    derbyAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (derbyAnimRef.current) cancelAnimationFrame(derbyAnimRef.current);
    };
  }, [activeMode, derbyPlaying, derbyCleared, derbyHasCollided, derbyV1, derbyV2, v1Final, v2Final]);

  // Check if all pins hit
  useEffect(() => {
    if (pins.every((p) => p.hit) && !derbyCleared) {
      setDerbyCleared(true);
      setDerbyPlaying(false);
      collisionAudio.playWin();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  }, [pins, derbyCleared]);

  // =========================================================================
  // LAB MODE: ORIGINAL COLLISION SIMULATION LAB
  // =========================================================================
  const [isLabPlaying, setIsLabPlaying] = useState<boolean>(false);
  const [labHasCollided, setLabHasCollided] = useState<boolean>(false);
  const [cart1X, setCart1X] = useState<number>(120);
  const [cart2X, setCart2X] = useState<number>(440);
  const [currV1, setCurrV1] = useState<number>(v1);
  const [currV2, setCurrV2] = useState<number>(v2);

  const labAnimRef = useRef<number | null>(null);
  const labLastTimeRef = useRef<number | null>(null);

  const resetLab = () => {
    setIsLabPlaying(false);
    setLabHasCollided(false);
    setCart1X(120);
    setCart2X(440);
    setCurrV1(v1);
    setCurrV2(v2);
  };

  useEffect(() => {
    resetLab();
  }, [m1, v1, m2, v2, elasticity]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMode('derby')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'derby'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Momentum Bumper Derby</span>
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
              <span>Collision Analysis Lab</span>
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

        {activeMode === 'derby' ? (
          <div className="flex items-center space-x-4">
            <div className="text-amber-300 font-bold">
              Score: <span className="text-white">{derbyScore}</span>
            </div>
            <div className="text-cyan-300 font-bold">
              v₁': <span className="text-white">{v1Final.toFixed(1)} m/s</span>
            </div>
            <div className="text-emerald-400 font-bold">
              v₂': <span className="text-white">{v2Final.toFixed(1)} m/s</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-slate-300">
            <div>
              <span className="text-slate-500">Σp: </span>
              <strong className="text-emerald-300">{totalP_initial.toFixed(1)} kg·m/s</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Elasticity e: </span>
              <strong className="text-amber-300">{elasticity.toFixed(1)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#060a16] overflow-hidden">
        
        {/* ================================================================= */}
        {/* MODE A: MOMENTUM BUMPER DERBY                                     */}
        {/* ================================================================= */}
        {activeMode === 'derby' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            {/* Air Track */}
            <line x1="40" y1="230" x2="680" y2="230" stroke="#334155" strokeWidth="6" />

            {/* Target Pins on right */}
            {pins.map((p) => (
              <g key={p.id} transform={`translate(${p.x}, 230)`}>
                <line x1="0" y1="0" x2="0" y2={p.hit ? '15' : '-45'} stroke={p.hit ? '#64748b' : '#ef4444'} strokeWidth="8" strokeLinecap="round" />
                <circle cx="0" cy={p.hit ? 15 : -45} r="6" fill={p.hit ? '#94a3b8' : '#ffffff'} />
                {!p.hit && (
                  <text x="0" y="-55" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                    PIN
                  </text>
                )}
              </g>
            ))}

            {/* Cart 1 (Striker, Cyan) */}
            <g transform={`translate(${derbyCart1X}, 184)`}>
              <rect width="60" height="46" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="30" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                m₁: {m1}kg
              </text>
            </g>

            {/* Cart 2 (Target, Amber) */}
            <g transform={`translate(${derbyCart2X}, 184)`}>
              <rect width="60" height="46" rx="6" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
              <text x="30" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                m₂: {m2}kg
              </text>
            </g>
          </svg>
        )}

        {/* Derby Cleared Overlay */}
        {derbyCleared && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">ALL PINS KNOCKED DOWN!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Momentum was conserved and completely transferred to Cart 2: $m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$.
            </p>
            <button
              onClick={resetDerby}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Derby Again</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE B: COLLISION ANALYSIS LAB                                    */}
        {/* ================================================================= */}
        {activeMode === 'lab' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            <line x1="40" y1="230" x2="680" y2="230" stroke="#334155" strokeWidth="4" />
            <g transform={`translate(${cart1X}, 184)`}>
              <rect width="60" height="46" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="30" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                m₁: {m1}kg
              </text>
            </g>
            <g transform={`translate(${cart2X}, 184)`}>
              <rect width="60" height="46" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
              <text x="30" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                m₂: {m2}kg
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Bottom Interactive Controls */}
      {activeMode === 'derby' ? (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
          <div className="text-xs text-slate-400">
            Transfer momentum through Cart 2 to smash down all three target pins!
          </div>
          <div className="flex items-center space-x-3">
            {!derbyPlaying ? (
              <button
                onClick={launchDerby}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH DERBY STRIKER</span>
              </button>
            ) : (
              <button
                onClick={resetDerby}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Derby</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
          <button
            onClick={() => setIsLabPlaying(!isLabPlaying)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            {isLabPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isLabPlaying ? 'Pause' : 'Collide'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
