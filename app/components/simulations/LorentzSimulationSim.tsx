'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Crosshair, Target, Zap, Trophy, Star, Volume2, VolumeX, Shield, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface LorentzSimulationSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
  onParamChange?: (key: string, value: number) => void;
}

// Synthesized Web Audio Sound Effects for Lorentz Force
class LorentzAudio {
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

  playBeamFire() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playShieldHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playBullseyeHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.25);
    });
  }
}

const lorentzAudio = new LorentzAudio();

interface TargetZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

interface ShieldBarrier {
  id: string;
  x: number;
  yTop: number;
  yBottom: number;
}

export default function LorentzSimulationSim({
  params,
  derived,
  onParamChange
}: LorentzSimulationSimProps) {
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    lorentzAudio.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Particle properties
  const [particleType, setParticleType] = useState<'electron' | 'proton' | 'alpha'>('proton');
  const [beamVelocity, setBeamVelocity] = useState<number>(params.velocity ?? 50); // m/s
  const [magFieldB, setMagFieldB] = useState<number>(params.magneticField ?? 0.8); // Tesla
  const [fieldPolarity, setFieldPolarity] = useState<1 | -1>(1); // 1 = Into page (X), -1 = Out of page (•)

  // Target Levels Setup
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [levelCleared, setLevelCleared] = useState<boolean>(false);

  // Targets and Barriers per level
  const levelData = useMemo(() => {
    if (currentLevel === 1) {
      // Level 1: Single aperture shield with target core
      const targets: TargetZone[] = [
        { id: 't1', x: 580, y: 80, radius: 24, hit: false }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 380, yTop: 0, yBottom: 120 },
        { id: 's2', x: 380, yTop: 200, yBottom: 320 }
      ]; // Aperture between y = 120 and 200
      return { targets, shields };
    } else if (currentLevel === 2) {
      // Level 2: Two targets on opposite deflection sides
      const targets: TargetZone[] = [
        { id: 't1', x: 580, y: 70, radius: 22, hit: false },
        { id: 't2', x: 580, y: 250, radius: 22, hit: false }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 340, yTop: 100, yBottom: 220 }
      ]; // Center block barrier: beam must bend around it!
      return { targets, shields };
    } else {
      // Level 3: Precision dual-gate slalom
      const targets: TargetZone[] = [
        { id: 't1', x: 620, y: 160, radius: 20, hit: false }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 280, yTop: 0, yBottom: 130 },
        { id: 's2', x: 440, yTop: 190, yBottom: 320 }
      ];
      return { targets, shields };
    }
  }, [currentLevel]);

  const [targets, setTargets] = useState<TargetZone[]>(() => levelData.targets);
  useEffect(() => {
    setTargets(levelData.targets);
    setLevelCleared(false);
  }, [levelData]);

  // Particle Physics Constants
  // q (charge multiplier) and m (mass multiplier)
  const particleSpecs = {
    electron: { q: -1.0, m: 0.1, color: '#38bdf8', label: 'Electron (e⁻)' },
    proton: { q: 1.0, m: 1.0, color: '#f43f5e', label: 'Proton (p⁺)' },
    alpha: { q: 2.0, m: 4.0, color: '#f59e0b', label: 'Alpha (α²⁺)' }
  }[particleType];

  // Effective magnetic field: B_eff = magFieldB * fieldPolarity
  const B_eff = magFieldB * fieldPolarity;
  // Gyroradius: r = (m * v) / (|q| * |B|)
  // Deflecting Lorentz Force: F_B = q * (v x B)
  const calculatedForce = Math.abs(particleSpecs.q * beamVelocity * B_eff);
  const rawRadius = (particleSpecs.m * beamVelocity) / (Math.max(0.05, Math.abs(particleSpecs.q * B_eff)) * 0.18);
  const gyroradiusPx = Math.min(600, Math.max(40, rawRadius));

  // Beam Animation State
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [beamProgress, setBeamProgress] = useState<number>(0);
  const [impactPopup, setImpactPopup] = useState<string | null>(null);

  const fireBeam = () => {
    if (isFiring) return;
    lorentzAudio.playBeamFire();
    setIsFiring(true);
    setBeamProgress(0);
    setImpactPopup(null);
  };

  // Trajectory Path Generator
  // Start: (x0, y0) = (80, 160)
  // Velocity points initially along +x
  // Lorentz force acts perpendicular:
  // If q * B > 0 -> deflects Up (-y in SVG)
  // If q * B < 0 -> deflects Down (+y in SVG)
  const trajectoryPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const x0 = 80;
    const y0 = 160;
    pts.push({ x: x0, y: y0 });

    const sign = Math.sign(particleSpecs.q * B_eff); // +1 deflects up, -1 deflects down, 0 straight

    if (Math.abs(B_eff) < 0.05 || sign === 0) {
      // Straight line
      for (let x = x0 + 15; x <= 680; x += 15) {
        pts.push({ x, y: y0 });
      }
      return pts;
    }

    // Parametric circular arc starting tangentially along +x:
    // x(theta) = x0 + R * sin(theta)
    // y(theta) = y0 - sign * R * (1 - cos(theta))
    const maxTheta = 1.6;
    const steps = 60;

    for (let i = 1; i <= steps; i++) {
      const theta = (i / steps) * maxTheta;
      const px = x0 + gyroradiusPx * Math.sin(theta);
      const py = y0 - sign * gyroradiusPx * (1 - Math.cos(theta));
      if (px < 0 || px > 710 || py < 10 || py > 310) {
        pts.push({ x: Math.max(0, Math.min(710, px)), y: Math.max(10, Math.min(310, py)) });
        break;
      }
      pts.push({ x: px, y: py });
    }
    return pts;
  }, [particleSpecs.q, B_eff, gyroradiusPx]);

  // Beam animation & collision detection
  const animFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isFiring) return;

    const step = () => {
      setBeamProgress((prev) => {
        const next = prev + 0.035;
        if (next >= 1.0) {
          setIsFiring(false);
          return 1.0;
        }

        if (trajectoryPoints.length === 0) return next;

        // Check current point along trajectory
        const ptIdx = Math.min(
          trajectoryPoints.length - 1,
          Math.max(0, Math.floor(next * (trajectoryPoints.length - 1)))
        );
        const currentPt = trajectoryPoints[ptIdx];

        if (currentPt) {
          // 1. Check Shield Collision
          for (const s of levelData.shields) {
            if (Math.abs(currentPt.x - s.x) < 8) {
              if (currentPt.y >= s.yTop && currentPt.y <= s.yBottom) {
                // Collided with shield!
                lorentzAudio.playShieldHit();
                setIsFiring(false);
                setImpactPopup('BLOCKED BY SHIELD WALL!');
                return next;
              }
            }
          }

          // 2. Check Target Hit
          setTargets((prevTargets) =>
            prevTargets.map((t) => {
              if (t.hit) return t;
              const dist = Math.hypot(currentPt.x - t.x, currentPt.y - t.y);
              if (dist <= t.radius) {
                lorentzAudio.playBullseyeHit();
                setIsFiring(false);
                setScore((sc) => sc + 1000);
                setImpactPopup('+1000 BULLSEYE CORE HIT!');
                return { ...t, hit: true };
              }
              return t;
            })
          );
        }

        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isFiring, trajectoryPoints, levelData.shields]);

  // Check level clear
  useEffect(() => {
    const allHit = targets.length > 0 && targets.every((t) => t.hit);
    if (allHit && !levelCleared) {
      setLevelCleared(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  }, [targets, levelCleared]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
            <Target className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>LORENTZ FORCE TARGET DEFLECTION MINIGAME</span>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-amber-300 font-bold">
            Score: <span className="text-white">{score}</span>
          </div>
          <div className="text-cyan-300 font-bold">
            F_B: <span className="text-white">{calculatedForce.toFixed(1)} μN</span>
          </div>
          <div className="text-emerald-300 font-bold">
            Gyroradius r: <span className="text-white">{gyroradiusPx.toFixed(0)} px</span>
          </div>
          <div className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
            Level {currentLevel} of 3
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#050814] overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-full">
          <defs>
            <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Magnetic Field Grid Indicators (X or • symbols) */}
          {Array.from({ length: 9 }).map((_, xi) =>
            Array.from({ length: 4 }).map((_, yi) => (
              <text
                key={`mag-${xi}-${yi}`}
                x={120 + xi * 60}
                y={60 + yi * 65}
                fill="#1e293b"
                fontSize="14"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                {fieldPolarity === 1 ? '⊗' : '⊙'}
              </text>
            ))
          )}

          {/* Field Chamber Indicator */}
          <text x="360" y="25" fill="#334155" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            MAGNETIC ZONE B = {B_eff.toFixed(2)} T ({fieldPolarity === 1 ? 'INTO SCREEN' : 'OUT OF SCREEN'})
          </text>

          {/* Particle Accelerator Gun at (80, 160) */}
          <g transform="translate(40, 140)">
            <rect width="40" height="40" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <polygon points="40,12 55,20 40,28" fill="#f43f5e" />
            <circle cx="20" cy="20" r="10" fill={particleSpecs.color} className="animate-pulse" />
          </g>

          {/* Predicted Trajectory Line */}
          {trajectoryPoints.length > 1 && (
            <path
              d={trajectoryPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
              fill="none"
              stroke={particleSpecs.color}
              strokeWidth="2.5"
              strokeDasharray="4,5"
              opacity="0.5"
            />
          )}

          {/* Active Fired Beam Trail */}
          {isFiring && trajectoryPoints.length > 1 && (
            <path
              d={trajectoryPoints
                .slice(0, Math.max(2, Math.floor(beamProgress * trajectoryPoints.length)))
                .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                .join(' ')}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            />
          )}

          {/* Particle Traveling Dot */}
          {isFiring && trajectoryPoints.length > 0 && (
            (() => {
              const ptIdx = Math.min(
                trajectoryPoints.length - 1,
                Math.max(0, Math.floor(beamProgress * (trajectoryPoints.length - 1)))
              );
              const pt = trajectoryPoints[ptIdx] || trajectoryPoints[0] || { x: 80, y: 160 };
              return (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill={particleSpecs.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="filter drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                />
              );
            })()
          )}

          {/* Shield Barriers */}
          {levelData.shields.map((s) => (
            <g key={s.id}>
              <rect
                x={s.x - 6}
                y={s.yTop}
                width="12"
                height={s.yBottom - s.yTop}
                rx="3"
                fill="url(#shieldGrad)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              />
              <line x1={s.x} y1={s.yTop} x2={s.x} y2={s.yBottom} stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            </g>
          ))}

          {/* Target Zones */}
          {targets.map((t) => (
            <g key={t.id} transform={`translate(${t.x}, ${t.y})`}>
              {/* Outer Core Ring */}
              <circle
                cx="0"
                cy="0"
                r={t.radius}
                fill={t.hit ? '#10b981' : 'none'}
                stroke={t.hit ? '#34d399' : '#f59e0b'}
                strokeWidth="2.5"
                className={t.hit ? 'filter drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'animate-pulse'}
              />
              {/* Inner Bullseye */}
              <circle cx="0" cy="0" r={t.radius * 0.45} fill={t.hit ? '#ffffff' : '#ef4444'} />
              <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">
                {t.hit ? '✓' : '1000'}
              </text>
            </g>
          ))}
        </svg>

        {/* Impact Message Toast */}
        {impactPopup && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-300 shadow-xl animate-bounce">
            {impactPopup}
          </div>
        )}

        {/* Level Complete Overlay */}
        {levelCleared && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" />
              <Star className="w-10 h-10 fill-current text-amber-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">TARGET CORE DESTROYED!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Deflected charged ion through magnetic field chamber: $r = \frac{'{mv}'}{'{qB}'}$. Total Score: {score} pts.
            </p>
            <div className="flex items-center space-x-3">
              {currentLevel < 3 ? (
                <button
                  onClick={() => setCurrentLevel((lvl) => lvl + 1)}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
                >
                  <span>Next Chamber Level {currentLevel + 1}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentLevel(1);
                    setScore(0);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Restart Campaign</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
        {/* Particle Selector */}
        <div className="flex items-center space-x-1.5">
          {(['electron', 'proton', 'alpha'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setParticleType(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                particleType === p
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'electron' ? 'e⁻ (Negative)' : p === 'proton' ? 'p⁺ (Positive)' : 'α²⁺ (Double Charge)'}
            </button>
          ))}
        </div>

        {/* Magnetic Field & Polarity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
            <span className="text-slate-400">Field B:</span>
            <input
              type="range"
              min="0.1"
              max="1.8"
              step="0.05"
              value={magFieldB}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMagFieldB(val);
                if (onParamChange) onParamChange('magneticField', val);
              }}
              className="accent-rose-500 cursor-pointer w-24 h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="w-12">{magFieldB.toFixed(2)} T</span>
          </div>

          <button
            onClick={() => setFieldPolarity((pol) => (pol === 1 ? -1 : 1))}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Polarity: {fieldPolarity === 1 ? '⊗ (Into)' : '⊙ (Out)'}
          </button>
        </div>

        {/* Velocity Slider */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
          <span className="text-slate-400">Velocity:</span>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={beamVelocity}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBeamVelocity(val);
              if (onParamChange) onParamChange('velocity', val);
            }}
            className="accent-cyan-400 cursor-pointer w-24 h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <span className="w-12">{beamVelocity} m/s</span>
        </div>

        {/* Fire Beam Action Button */}
        <button
          onClick={fireBeam}
          disabled={isFiring}
          className={`px-6 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer shadow-lg ${
            isFiring
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>FIRE PARTICLE BEAM</span>
        </button>
      </div>

    </div>
  );
}
