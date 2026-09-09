'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Target, Zap, Trophy, Star, Volume2, VolumeX, Sparkles, Compass, RotateCcw, Crosshair } from 'lucide-react';
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
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playShieldHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBullseyeHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.07);
      osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.3);
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
  name: string;
}

interface ShieldBarrier {
  id: string;
  x: number;
  yTop: number;
  yBottom: number;
  label?: string;
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

  // Particle properties with wide variable ranges
  const [particleType, setParticleType] = useState<'electron' | 'proton' | 'alpha' | 'iron' | 'custom'>('proton');
  const [charge, setCharge] = useState<number>(params.charge ?? 1.0); // in μC (-10 to +10)
  const [mass, setMass] = useState<number>(1.0); // relative mass (0.5 to 10.0)
  const [beamVelocity, setBeamVelocity] = useState<number>(params.velocity ?? 100); // in m/s (10 to 300)
  const [magFieldB, setMagFieldB] = useState<number>(params.magneticField ?? 0.5); // Tesla (0.00 to 5.00)
  const [fieldPolarity, setFieldPolarity] = useState<1 | -1>(1); // 1 = Into page (X), -1 = Out of page (•)
  const [angleDeg, setAngleDeg] = useState<number>(params.angleDeg ?? 90); // deg (0 to 180)

  // Target Levels Setup
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [levelCleared, setLevelCleared] = useState<boolean>(false);

  // Targets and Barriers per level - calibrated for clean reachability across wide parameters
  const levelData = useMemo(() => {
    if (currentLevel === 1) {
      // Level 1: Single aperture shield with elevated target core
      const targets: TargetZone[] = [
        { id: 't1', x: 570, y: 85, radius: 28, hit: false, name: 'Core Alpha (Upper Target)' }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 350, yTop: 0, yBottom: 65, label: 'Upper Aegis' },
        { id: 's2', x: 350, yTop: 180, yBottom: 320, label: 'Lower Aegis' }
      ]; // Generous aperture between y = 65 and 180
      return { targets, shields };
    } else if (currentLevel === 2) {
      // Level 2: Dual targets on opposite deflection poles
      const targets: TargetZone[] = [
        { id: 't1', x: 570, y: 75, radius: 26, hit: false, name: 'North Target (+Deflection)' },
        { id: 't2', x: 570, y: 245, radius: 26, hit: false, name: 'South Target (-Deflection)' }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 340, yTop: 125, yBottom: 195, label: 'Central Deflector' }
      ]; // Center barrier: curve up for North, curve down for South!
      return { targets, shields };
    } else {
      // Level 3: Precision slalom gate
      const targets: TargetZone[] = [
        { id: 't1', x: 590, y: 115, radius: 26, hit: false, name: 'Slalom Gate 1' },
        { id: 't2', x: 590, y: 205, radius: 26, hit: false, name: 'Slalom Gate 2' }
      ];
      const shields: ShieldBarrier[] = [
        { id: 's1', x: 280, yTop: 0, yBottom: 95, label: 'Ceiling Gate' },
        { id: 's2', x: 440, yTop: 225, yBottom: 320, label: 'Floor Gate' }
      ];
      return { targets, shields };
    }
  }, [currentLevel]);

  const [targets, setTargets] = useState<TargetZone[]>(() => levelData.targets);
  useEffect(() => {
    setTargets(levelData.targets);
    setLevelCleared(false);
  }, [levelData]);

  // Particle preset loader
  const handleSelectPreset = (type: 'electron' | 'proton' | 'alpha' | 'iron' | 'custom') => {
    setParticleType(type);
    if (type === 'electron') {
      setCharge(-1.0);
      setMass(1.0);
      if (onParamChange) onParamChange('charge', 1.0);
    } else if (type === 'proton') {
      setCharge(1.0);
      setMass(1.0);
      if (onParamChange) onParamChange('charge', 1.0);
    } else if (type === 'alpha') {
      setCharge(2.0);
      setMass(2.0);
      if (onParamChange) onParamChange('charge', 2.0);
    } else if (type === 'iron') {
      setCharge(3.0);
      setMass(4.0);
      if (onParamChange) onParamChange('charge', 3.0);
    }
  };

  // Particle color and visual identity
  const particleVisual = useMemo(() => {
    if (charge < 0) return { color: '#38bdf8', label: 'Negative Ion / Electron (e⁻)', sign: '-' };
    if (charge > 2) return { color: '#a855f7', label: 'Heavy Multivalent Ion (Fe³⁺)', sign: '+' };
    if (charge > 1) return { color: '#f59e0b', label: 'Alpha Particle (α²⁺)', sign: '+' };
    return { color: '#f43f5e', label: 'Proton (p⁺)', sign: '+' };
  }, [charge]);

  // Effective magnetic field: B_eff = magFieldB * fieldPolarity
  const B_eff = magFieldB * fieldPolarity;
  const thetaRad = (angleDeg * Math.PI) / 180;
  const sinTheta = Math.sin(thetaRad);

  // F_net = q * B_eff * sin(theta)
  // Positive F_net -> deflecting UP (-y in SVG)
  // Negative F_net -> deflecting DOWN (+y in SVG)
  const F_net = charge * B_eff * sinTheta;
  const deflectingSign = Math.sign(F_net); // +1: Up, -1: Down, 0: Straight
  const calculatedForceMicroN = Math.abs(charge * beamVelocity * magFieldB * sinTheta);

  // Scaled Gyroradius for Screen Visualization: R_px = (m * v * 8.5) / |F_net|
  const forceDenominator = Math.max(0.0001, Math.abs(F_net) / Math.max(0.1, mass));
  const gyroradiusPx = Math.abs(F_net) < 0.001 || Math.abs(sinTheta) < 0.001
    ? 999999
    : Math.max(120, (mass * beamVelocity * 8.5) / forceDenominator);

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

  // Robust Incremental Trajectory Generator
  // Starts at (x0 = 70, y0 = 160)
  // Heading advances with curvature kappa = 1 / R_px
  // Never cuts off prematurely, sweeps full screen!
  const trajectoryPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const x0 = 70;
    const y0 = 160;
    pts.push({ x: x0, y: y0 });

    if (Math.abs(F_net) < 0.001 || Math.abs(sinTheta) < 0.001) {
      // Undeflected straight path across entire canvas
      for (let x = x0 + 8; x <= 710; x += 8) {
        pts.push({ x, y: y0 });
      }
      return pts;
    }

    const ds = 4; // 4px step along trajectory
    let curX = x0;
    let curY = y0;
    let heading = 0; // horizontal heading to the right
    const maxSteps = 220;

    for (let step = 0; step < maxSteps; step++) {
      curX += ds * Math.cos(heading);
      curY -= ds * Math.sin(heading);
      heading += (ds / gyroradiusPx) * deflectingSign;

      pts.push({ x: curX, y: curY });

      // Stop if particle hits canvas edge or loops backward
      if (curX > 710 || curY <= 6 || curY >= 314 || (step > 15 && curX < x0 - 10)) {
        break;
      }
    }

    return pts;
  }, [F_net, sinTheta, gyroradiusPx, deflectingSign]);

  // Real-Time Target Lock Check
  // Evaluates whether the predicted trajectory line intersects any active target
  const lockedTargetInfo = useMemo(() => {
    for (const t of targets) {
      if (t.hit) continue;
      // Check if any point on the trajectory comes within target radius
      for (let i = 0; i < trajectoryPoints.length; i++) {
        const pt = trajectoryPoints[i];
        // Check barrier collision before target
        let blockedByShield = false;
        for (const s of levelData.shields) {
          if (Math.abs(pt.x - s.x) < 8 && pt.y >= s.yTop && pt.y <= s.yBottom) {
            blockedByShield = true;
            break;
          }
        }
        if (blockedByShield) break;

        const dist = Math.hypot(pt.x - t.x, pt.y - t.y);
        if (dist <= t.radius) {
          return { locked: true, targetName: t.name, distance: dist };
        }
      }
    }
    return { locked: false, targetName: null, distance: null };
  }, [targets, trajectoryPoints, levelData.shields]);

  // Beam animation & collision detection
  const animFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isFiring) return;

    const step = () => {
      setBeamProgress((prev) => {
        const next = prev + 0.028;
        if (next >= 1.0) {
          setIsFiring(false);
          return 1.0;
        }

        if (trajectoryPoints.length === 0) return next;

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
                lorentzAudio.playShieldHit();
                setIsFiring(false);
                setImpactPopup(`DEFLECTOR SHIELD ABSORBED IMPACT! (${s.label || 'Barrier'})`);
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
                setImpactPopup(`🎯 DIRECT HIT! ${t.name} DESTROYED (+1000 PTS)`);
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
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
    }
  }, [targets, levelCleared]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
            <Target className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>LORENTZ FORCE TARGET DEFLECTION LAB</span>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Real-Time Live Lock Status */}
        <div className="flex items-center space-x-3">
          {lockedTargetInfo.locked ? (
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-[11px] animate-pulse">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>LOCKED ON TARGET: {lockedTargetInfo.targetName}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>Adjust sliders to lock onto target</span>
            </div>
          )}

          <div className="text-amber-300 font-bold">
            Score: <span className="text-white">{score}</span>
          </div>
          <div className="text-cyan-300 font-bold">
            F_B: <span className="text-white">{calculatedForceMicroN.toFixed(1)} μN</span>
          </div>
          <div className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
            Level {currentLevel} of 3
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#030712] overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-full">
          <defs>
            <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={particleVisual.color} />
            </linearGradient>
          </defs>

          {/* Magnetic Field Grid Indicators (X or • symbols) */}
          {Array.from({ length: 10 }).map((_, xi) =>
            Array.from({ length: 5 }).map((_, yi) => (
              <text
                key={`mag-${xi}-${yi}`}
                x={110 + xi * 58}
                y={45 + yi * 58}
                fill="#1e293b"
                fontSize="15"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="middle"
                opacity="0.75"
              >
                {fieldPolarity === 1 ? '⊗' : '⊙'}
              </text>
            ))
          )}

          {/* Field Chamber Label */}
          <text x="360" y="24" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            MAGNETIC FLUX B = {(magFieldB * fieldPolarity).toFixed(2)} T ({fieldPolarity === 1 ? 'INTO SCREEN ⊗' : 'OUT OF SCREEN ⊙'}) • θ = {angleDeg}°
          </text>

          {/* Particle Accelerator Gun at (x0 = 70, y0 = 160) */}
          <g transform="translate(30, 140)">
            <rect width="40" height="40" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <polygon points="40,12 55,20 40,28" fill="#f43f5e" />
            <circle cx="20" cy="20" r="10" fill={particleVisual.color} className="animate-pulse" />
            <text x="20" y="23" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              {charge > 0 ? `+${charge}` : `${charge}`}
            </text>
          </g>

          {/* Live Predicted Trajectory Line (Crisp, High-Visibility Guide) */}
          {trajectoryPoints.length > 1 && (
            <path
              d={trajectoryPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
              fill="none"
              stroke={lockedTargetInfo.locked ? '#10b981' : particleVisual.color}
              strokeWidth={lockedTargetInfo.locked ? '3' : '2.5'}
              strokeDasharray={lockedTargetInfo.locked ? '6,4' : '4,5'}
              opacity={lockedTargetInfo.locked ? '0.9' : '0.6'}
              className={lockedTargetInfo.locked ? 'filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}
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
              stroke="url(#laserGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
            />
          )}

          {/* Particle Traveling Glowing Dot */}
          {isFiring && trajectoryPoints.length > 0 && (
            (() => {
              const ptIdx = Math.min(
                trajectoryPoints.length - 1,
                Math.max(0, Math.floor(beamProgress * (trajectoryPoints.length - 1)))
              );
              const pt = trajectoryPoints[ptIdx] || trajectoryPoints[0] || { x: 70, y: 160 };
              return (
                <g transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle
                    r="8"
                    fill={particleVisual.color}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                  />
                  <circle r="14" fill={particleVisual.color} opacity="0.3" className="animate-ping" />
                </g>
              );
            })()
          )}

          {/* Shield Barriers */}
          {levelData.shields.map((s) => (
            <g key={s.id}>
              <rect
                x={s.x - 7}
                y={s.yTop}
                width="14"
                height={s.yBottom - s.yTop}
                rx="4"
                fill="url(#shieldGrad)"
                stroke="#38bdf8"
                strokeWidth="2"
                className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              />
              <line x1={s.x} y1={s.yTop} x2={s.x} y2={s.yBottom} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
              {s.label && (
                <text x={s.x} y={s.yTop + (s.yBottom - s.yTop) / 2} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${s.x} ${s.yTop + (s.yBottom - s.yTop) / 2})`}>
                  {s.label}
                </text>
              )}
            </g>
          ))}

          {/* Target Zones */}
          {targets.map((t) => (
            <g key={t.id} transform={`translate(${t.x}, ${t.y})`}>
              {/* Outer Glow Ring */}
              <circle
                cx="0"
                cy="0"
                r={t.radius}
                fill={t.hit ? '#10b981' : 'none'}
                stroke={t.hit ? '#34d399' : lockedTargetInfo.locked && lockedTargetInfo.targetName === t.name ? '#10b981' : '#f59e0b'}
                strokeWidth={lockedTargetInfo.locked && lockedTargetInfo.targetName === t.name ? '3.5' : '2.5'}
                className={t.hit ? 'filter drop-shadow-[0_0_20px_rgba(16,185,129,0.9)]' : 'animate-pulse'}
              />
              {/* Concentric Guide Ring */}
              <circle
                cx="0"
                cy="0"
                r={t.radius * 0.7}
                fill="none"
                stroke={t.hit ? '#6ee7b7' : '#fbbf24'}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              {/* Inner Bullseye Core */}
              <circle cx="0" cy="0" r={t.radius * 0.42} fill={t.hit ? '#ffffff' : '#ef4444'} />
              <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">
                {t.hit ? '✓' : '1000'}
              </text>
            </g>
          ))}
        </svg>

        {/* Impact Message Toast */}
        {impactPopup && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 px-5 py-2 rounded-xl font-mono text-xs font-bold text-amber-300 shadow-2xl animate-bounce z-10 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{impactPopup}</span>
          </div>
        )}

        {/* Level Complete Overlay */}
        {levelCleared && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-300">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" />
              <Star className="w-10 h-10 fill-current text-amber-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">CHAMBER TARGET DESTROYED!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Deflected charged ion through magnetic field chamber: $r = \frac{'{mv}'}{'{qB}'}$. Total Score: {score} pts.
            </p>
            <div className="flex items-center space-x-3">
              {currentLevel < 3 ? (
                <button
                  onClick={() => setCurrentLevel((lvl) => lvl + 1)}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
                >
                  <span>Advance to Level {currentLevel + 1}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentLevel(1);
                    setScore(0);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Restart Mastery Campaign</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar with Expanded Ranges */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col space-y-3">
        
        {/* Row 1: Particle Selector & Level Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Ion Species:</span>
            <div className="flex items-center space-x-1.5">
              {(['electron', 'proton', 'alpha', 'iron', 'custom'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    particleType === p
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'electron' ? 'e⁻ (-1μC)' : p === 'proton' ? 'p⁺ (+1μC)' : p === 'alpha' ? 'α²⁺ (+2μC)' : p === 'iron' ? 'Fe³⁺ (+3μC)' : 'Custom Ion'}
                </button>
              ))}
            </div>
          </div>

          {/* Level Switcher buttons */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Chamber:</span>
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setCurrentLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  currentLevel === lvl
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Sliders with Expanded Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
          
          {/* 1. Velocity Slider (10 to 300 m/s) */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Speed (v):</span>
              <span className="text-cyan-300 font-bold">{beamVelocity} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={beamVelocity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBeamVelocity(val);
                if (onParamChange) onParamChange('velocity', val);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>10 m/s</span>
              <span>150 m/s</span>
              <span>300 m/s</span>
            </div>
          </div>

          {/* 2. Magnetic Field B (0.00 to 5.00 T) & Polarity */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Field (B):</span>
              <span className="text-rose-300 font-bold">{magFieldB.toFixed(2)} T</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="5.00"
              step="0.05"
              value={magFieldB}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMagFieldB(val);
                if (onParamChange) onParamChange('magneticField', val);
              }}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex items-center justify-between pt-0.5">
              <button
                onClick={() => setFieldPolarity((pol) => (pol === 1 ? -1 : 1))}
                className="w-full py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[10px] font-bold transition cursor-pointer"
              >
                Polarity: {fieldPolarity === 1 ? '⊗ Into Screen' : '⊙ Out of Screen'}
              </button>
            </div>
          </div>

          {/* 3. Particle Charge (-10.0 to +10.0 μC) */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Charge (q):</span>
              <span className={charge > 0 ? 'text-rose-300 font-bold' : charge < 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                {charge > 0 ? `+${charge.toFixed(1)}` : charge.toFixed(1)} μC
              </span>
            </div>
            <input
              type="range"
              min="-10.0"
              max="10.0"
              step="0.5"
              value={charge}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCharge(val);
                setParticleType('custom');
                if (onParamChange) onParamChange('charge', Math.abs(val));
              }}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>-10 μC</span>
              <span>0</span>
              <span>+10 μC</span>
            </div>
          </div>

          {/* 4. Injection Angle (0° to 180°) */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Angle (θ):</span>
              <span className="text-emerald-300 font-bold">{angleDeg}° (sin θ = {sinTheta.toFixed(2)})</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={angleDeg}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAngleDeg(val);
                if (onParamChange) onParamChange('angleDeg', val);
              }}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0° (No Force)</span>
              <span>90° (Max)</span>
              <span>180°</span>
            </div>
          </div>

        </div>

        {/* Row 3: Action Controls & Fire Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>Deflection:</span>
            <span className={deflectingSign > 0 ? 'text-rose-400 font-bold' : deflectingSign < 0 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
              {deflectingSign > 0 ? '↑ Deflecting UP (Toward Ceiling)' : deflectingSign < 0 ? '↓ Deflecting DOWN (Toward Floor)' : '→ Straight Line (Zero Net Force)'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setBeamVelocity(100);
                setMagFieldB(0.5);
                setFieldPolarity(1);
                setCharge(1.0);
                setAngleDeg(90);
                setParticleType('proton');
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono transition flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Calibrations</span>
            </button>

            <button
              onClick={fireBeam}
              disabled={isFiring}
              className={`px-8 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer shadow-xl ${
                isFiring
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : lockedTargetInfo.locked
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.7)] animate-pulse'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.6)]'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isFiring ? 'BEAM IN TRANSIT...' : lockedTargetInfo.locked ? 'FIRE LOCKED STRIKE!' : 'FIRE PARTICLE BEAM'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
