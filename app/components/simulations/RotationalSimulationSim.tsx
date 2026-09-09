'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Compass, ArrowUpRight, Zap, Trophy, Flame, Flag, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface RotationalSimulationSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
}

// Synthesized Web Audio Sound Effects for Rotational Sim
class RotationalAudio {
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
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playWinFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.1);
      osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.3);
    });
  }
}

const rotAudio = new RotationalAudio();

export default function RotationalSimulationSim({
  params,
  derived
}: RotationalSimulationSimProps) {
  // Mode switcher:
  // 'dynamo' (Tangential Force Flywheel Dynamo Challenge)
  // 'derby' (Inertia Derby: Solid vs Hollow Cylinder Race)
  // 'lab' (Original Mathematical Formula Lab)
  const [activeMode, setActiveMode] = useState<'dynamo' | 'derby' | 'lab'>('dynamo');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    rotAudio.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Original parameters
  const F_tan = Math.max(0, params.appliedForce ?? 20);
  const radius = Math.max(0.2, params.radius ?? 0.8);
  const mass = Math.max(0.1, params.discMass ?? 5);
  const tau_f = Math.max(0, params.bearingFriction ?? 1.0);

  // =========================================================================
  // MINIGAME 1: FLYWHEEL DYNAMO TANGENTIAL THRUSTER CHALLENGE
  // =========================================================================
  // Mass Distribution geometry:
  // 'solid' (I = 0.5 * M * R^2)
  // 'hollow' (I = 1.0 * M * R^2 - rim only)
  const [flywheelShape, setFlywheelShape] = useState<'solid' | 'hollow'>('solid');
  const shapeFactor = flywheelShape === 'solid' ? 0.5 : 1.0;
  const flywheelI = shapeFactor * mass * radius * radius;

  const [flywheelOmega, setFlywheelOmega] = useState<number>(0); // rad/s
  const [flywheelAngle, setFlywheelAngle] = useState<number>(0); // deg
  const [batteryCharge, setBatteryCharge] = useState<number>(0); // 0 to 100%
  const [thrusterActive, setThrusterActive] = useState<boolean>(false);
  const [dynamoCleared, setDynamoCleared] = useState<boolean>(false);

  const dynamoFrameRef = useRef<number | null>(null);
  const dynamoLastTime = useRef<number | null>(null);

  const pulseTangentialThruster = () => {
    rotAudio.playThruster();
    setThrusterActive(true);
    setTimeout(() => setThrusterActive(false), 200);

    // Apply tangential impulse torque: tau = r * F_thrust, delta_omega = tau * dt / I
    const F_pulse = 45; // Newtons
    const pulseTorque = radius * F_pulse;
    const deltaOmega = (pulseTorque * 0.2) / flywheelI;
    setFlywheelOmega((w) => Math.min(120, w + deltaOmega));
  };

  const resetDynamo = () => {
    setFlywheelOmega(0);
    setFlywheelAngle(0);
    setBatteryCharge(0);
    setDynamoCleared(false);
  };

  // Dynamo step loop
  useEffect(() => {
    if (activeMode !== 'dynamo' || dynamoCleared) {
      if (dynamoFrameRef.current) cancelAnimationFrame(dynamoFrameRef.current);
      dynamoLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (dynamoLastTime.current === null) dynamoLastTime.current = timestamp;
      const dt = Math.min(0.05, (timestamp - dynamoLastTime.current) / 1000);
      dynamoLastTime.current = timestamp;

      setFlywheelOmega((w) => {
        // Friction drag opposes motion: tau_drag = b * omega
        const dragTorque = 0.4 + w * 0.08;
        const dragAlpha = dragTorque / flywheelI;
        return Math.max(0, w - dragAlpha * dt);
      });

      setFlywheelAngle((a) => (a + (flywheelOmega * (180 / Math.PI)) * dt) % 360);

      // Battery charging logic: Green Zone is between 25 and 65 rad/s (~240 to 620 RPM)
      if (flywheelOmega >= 25 && flywheelOmega <= 75) {
        setBatteryCharge((c) => {
          const nextC = c + dt * 12;
          if (nextC >= 100) {
            setDynamoCleared(true);
            rotAudio.playWinFanfare();
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            return 100;
          }
          return nextC;
        });
      }

      dynamoFrameRef.current = requestAnimationFrame(step);
    };

    dynamoFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (dynamoFrameRef.current) cancelAnimationFrame(dynamoFrameRef.current);
    };
  }, [activeMode, dynamoCleared, flywheelOmega, flywheelI]);

  const flywheelRpm = (flywheelOmega * 60) / (2 * Math.PI);
  const isInGreenZone = flywheelOmega >= 25 && flywheelOmega <= 75;

  // =========================================================================
  // MINIGAME 2: DOWNHILL CYLINDER INERTIA DERBY
  // =========================================================================
  // 3 Racers:
  // Racer 1: Solid Sphere (k = 2/5 = 0.4) -> a = g*sin(theta)/(1 + 0.4) = 0.714 g*sin(theta)
  // Racer 2: Solid Cylinder (k = 1/2 = 0.5) -> a = g*sin(theta)/(1 + 0.5) = 0.667 g*sin(theta)
  // Racer 3: Hollow Ring (k = 1.0) -> a = g*sin(theta)/(1 + 1.0) = 0.500 g*sin(theta)
  const rampInclineDeg = 25;
  const rampInclineRad = (rampInclineDeg * Math.PI) / 180;
  const gSinTheta = 9.8 * Math.sin(rampInclineRad);

  const accelSphere = gSinTheta / (1 + 0.4);
  const accelSolidCyl = gSinTheta / (1 + 0.5);
  const accelHollowRing = gSinTheta / (1 + 1.0);

  const [derbyRunning, setDerbyRunning] = useState<boolean>(false);
  const [derbyTime, setDerbyTime] = useState<number>(0);
  const [derbyFinished, setDerbyFinished] = useState<boolean>(false);
  const derbyLengthM = 15; // meters ramp length

  const derbyAnimRef = useRef<number | null>(null);
  const derbyLastTime = useRef<number | null>(null);

  const startDerby = () => {
    setDerbyRunning(true);
    setDerbyTime(0);
    setDerbyFinished(false);
  };

  const resetDerby = () => {
    setDerbyRunning(false);
    setDerbyTime(0);
    setDerbyFinished(false);
  };

  useEffect(() => {
    if (activeMode !== 'derby' || !derbyRunning || derbyFinished) {
      if (derbyAnimRef.current) cancelAnimationFrame(derbyAnimRef.current);
      derbyLastTime.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (derbyLastTime.current === null) derbyLastTime.current = timestamp;
      const dt = Math.min(0.04, (timestamp - derbyLastTime.current) / 1000);
      derbyLastTime.current = timestamp;

      setDerbyTime((t) => {
        const nextT = t + dt;
        // Check if slowest (hollow ring) has crossed finish line: x = 0.5 * a * t^2
        const hollowDist = 0.5 * accelHollowRing * nextT * nextT;
        if (hollowDist >= derbyLengthM) {
          setDerbyFinished(true);
          setDerbyRunning(false);
          rotAudio.playWinFanfare();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
        return nextT;
      });

      derbyAnimRef.current = requestAnimationFrame(step);
    };

    derbyAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (derbyAnimRef.current) cancelAnimationFrame(derbyAnimRef.current);
    };
  }, [activeMode, derbyRunning, derbyFinished, accelHollowRing]);

  const posSphereM = Math.min(derbyLengthM, 0.5 * accelSphere * derbyTime * derbyTime);
  const posSolidCylM = Math.min(derbyLengthM, 0.5 * accelSolidCyl * derbyTime * derbyTime);
  const posHollowRingM = Math.min(derbyLengthM, 0.5 * accelHollowRing * derbyTime * derbyTime);

  // =========================================================================
  // LAB MODE: ORIGINAL TORQUE & ROTATIONAL DYNAMICS LAB
  // =========================================================================
  const momentOfInertia = derived.momentOfInertia ?? (0.5 * mass * radius * radius);
  const appliedTorque = derived.appliedTorque ?? (radius * F_tan);
  const netTorque = Math.max(0, appliedTorque - tau_f);
  const angularAccel = netTorque / momentOfInertia;

  const [isLabPlaying, setIsLabPlaying] = useState<boolean>(true);
  const [labAngleDeg, setLabAngleDeg] = useState<number>(0);
  const [labOmega, setLabOmega] = useState<number>(0);
  const labAnimRef = useRef<number | null>(null);
  const labLastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setLabOmega(0);
    setLabAngleDeg(0);
  }, [mass, radius, F_tan, tau_f]);

  useEffect(() => {
    if (activeMode !== 'lab' || !isLabPlaying) {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
      labLastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (labLastTimeRef.current === null) labLastTimeRef.current = timestamp;
      const dt = Math.min(0.05, (timestamp - labLastTimeRef.current) / 1000);
      labLastTimeRef.current = timestamp;

      setLabOmega((prev) => Math.min(80, Math.max(0, prev + angularAccel * dt)));
      setLabAngleDeg((prev) => (prev + (labOmega * (180 / Math.PI)) * dt) % 360);

      labAnimRef.current = requestAnimationFrame(step);
    };

    labAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (labAnimRef.current) cancelAnimationFrame(labAnimRef.current);
    };
  }, [activeMode, isLabPlaying, angularAccel, labOmega]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMode('dynamo')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'dynamo'
                  ? 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Flywheel Dynamo Minigame</span>
            </button>
            <button
              onClick={() => setActiveMode('derby')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'derby'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Cylinder Inertia Derby</span>
            </button>
            <button
              onClick={() => setActiveMode('lab')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'lab'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Formula Lab</span>
            </button>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Dynamic Metric Display */}
        {activeMode === 'dynamo' && (
          <div className="flex items-center space-x-4">
            <div className="text-violet-300 font-bold">
              RPM: <span className={isInGreenZone ? 'text-emerald-400 font-black' : 'text-white'}>{flywheelRpm.toFixed(0)}</span>
            </div>
            <div className="text-amber-300 font-bold">
              Inertia I: <span className="text-white">{flywheelI.toFixed(2)} kg·m²</span>
            </div>
            <div className="text-emerald-400 font-bold">
              Battery: <span className="text-white">{batteryCharge.toFixed(0)}%</span>
            </div>
          </div>
        )}

        {activeMode === 'derby' && (
          <div className="flex items-center space-x-4">
            <div className="text-amber-300 font-bold">
              Time: <span className="text-white">{derbyTime.toFixed(2)}s</span>
            </div>
            <div className="text-cyan-300 font-bold">
              Ramp Incline: <span className="text-white">{rampInclineDeg}°</span>
            </div>
          </div>
        )}

        {activeMode === 'lab' && (
          <div className="flex items-center space-x-3 text-slate-300">
            <div>
              <span className="text-slate-500">Torque: </span>
              <strong className="text-amber-300">{netTorque.toFixed(1)} N·m</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Inertia I: </span>
              <strong className="text-violet-300">{momentOfInertia.toFixed(2)} kg·m²</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">α: </span>
              <strong className="text-cyan-300">{angularAccel.toFixed(1)} rad/s²</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#070b18] overflow-hidden">
        
        {/* ================================================================= */}
        {/* MODE A: FLYWHEEL DYNAMO TANGENTIAL THRUSTER MINIGAME              */}
        {/* ================================================================= */}
        {activeMode === 'dynamo' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            <defs>
              <linearGradient id="discGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="hollowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#831843" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>

            {/* Battery Bank Storage Gauge at Top Left */}
            <g transform="translate(40, 30)">
              <rect width="180" height="42" rx="8" fill="#030712" stroke="#334155" strokeWidth="1" />
              <text x="12" y="16" fill="#a78bfa" fontSize="10" fontWeight="bold" fontFamily="monospace">
                BATTERY CAPACITOR: {batteryCharge.toFixed(0)}%
              </text>
              <rect x="12" y="22" width="156" height="10" rx="4" fill="#1e293b" />
              <rect x="12" y="22" width={1.56 * batteryCharge} height="10" rx="4" fill="#10b981" />
            </g>

            {/* RPM Green Zone Speedometer Banner */}
            <g transform="translate(480, 30)">
              <rect width="200" height="42" rx="8" fill="#030712" stroke="#334155" strokeWidth="1" />
              <text x="12" y="16" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                TARGET: 240 - 620 RPM
              </text>
              <text x="12" y="32" fill={isInGreenZone ? '#34d399' : '#94a3b8'} fontSize="9" fontFamily="monospace">
                {isInGreenZone ? '⚡ CHARGING ACTIVATED!' : 'PULSE THRUSTER TO ENTER ZONE'}
              </text>
            </g>

            {/* Spinning Flywheel Center: (360, 175) */}
            <g transform={`translate(360, 175) rotate(${flywheelAngle})`}>
              {/* Outer Disc or Hollow Rim */}
              {flywheelShape === 'solid' ? (
                <circle
                  cx="0"
                  cy="0"
                  r="90"
                  fill="url(#discGrad)"
                  stroke="#a78bfa"
                  strokeWidth="4"
                  className="filter drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                />
              ) : (
                <g>
                  {/* Hollow Ring Rim */}
                  <circle
                    cx="0"
                    cy="0"
                    r="90"
                    fill="none"
                    stroke="url(#hollowGrad)"
                    strokeWidth="24"
                    className="filter drop-shadow-[0_0_15px_rgba(219,39,119,0.6)]"
                  />
                  {/* Thin Spokes */}
                  <line x1="-90" y1="0" x2="90" y2="0" stroke="#f472b6" strokeWidth="2.5" />
                  <line x1="0" y1="-90" x2="0" y2="90" stroke="#f472b6" strokeWidth="2.5" />
                </g>
              )}

              {/* Spoke Markers for Visible Rotation */}
              <line x1="-80" y1="0" x2="80" y2="0" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" />
              <line x1="0" y1="-80" x2="0" y2="80" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" />

              {/* Tangential Thruster Nozzle on Perimeter */}
              <g transform="translate(0, -90)">
                <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
                {thrusterActive && (
                  <polygon points="10,-6 28,0 10,6" fill="#ef4444" className="animate-ping" />
                )}
              </g>

              {/* Axle Bearing */}
              <circle cx="0" cy="0" r="16" fill="#1e1b4b" stroke="#cbd5e1" strokeWidth="3" />
            </g>

            {/* Tangential Force Vector Arrow (when pulsing) */}
            {thrusterActive && (
              <g transform="translate(360, 85)">
                <line x1="0" y1="0" x2="60" y2="0" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <polygon points="65,0 52,-6 52,6" fill="#ef4444" />
                <text x="70" y="4" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  F_tan = 45 N (τ = r × F)
                </text>
              </g>
            )}
          </svg>
        )}

        {/* Dynamo Victory Overlay */}
        {dynamoCleared && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">BATTERY 100% CHARGED!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              You maintained the flywheel in the optimal power generation RPM band using tangential torque pulses ($\tau = r \times F_t$).
            </p>
            <button
              onClick={resetDynamo}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Charge Another Cell</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE B: DOWNHILL CYLINDER INERTIA DERBY                           */}
        {/* ================================================================= */}
        {activeMode === 'derby' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            {/* 3 Rolling Lanes on Incline Ramp */}
            {[
              { label: 'Solid Sphere (k = 2/5)', color: '#38bdf8', y: 80, pos: posSphereM, I_latex: '2/5 MR²' },
              { label: 'Solid Cylinder (k = 1/2)', color: '#a855f7', y: 155, pos: posSolidCylM, I_latex: '1/2 MR²' },
              { label: 'Hollow Ring (k = 1)', color: '#f43f5e', y: 230, pos: posHollowRingM, I_latex: '1.0 MR²' }
            ].map((lane, idx) => {
              const startX = 60;
              const finishX = 640;
              const trackW = finishX - startX;
              const currentX = startX + (lane.pos / derbyLengthM) * trackW;
              const rollingAngle = (lane.pos / 0.5) * (180 / Math.PI); // rotation angle

              return (
                <g key={`lane-${idx}`}>
                  {/* Track line */}
                  <line x1={startX} y1={lane.y} x2={finishX} y2={lane.y} stroke="#1e293b" strokeWidth="4" />
                  <line x1={startX} y1={lane.y} x2={currentX} y2={lane.y} stroke={lane.color} strokeWidth="4" />

                  {/* Lane Label */}
                  <text x={startX} y={lane.y - 20} fill={lane.color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                    {lane.label} — I = {lane.I_latex}
                  </text>

                  {/* Rolling Object */}
                  <g transform={`translate(${currentX}, ${lane.y}) rotate(${rollingAngle})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={lane.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    />
                    {/* Crosshair Spoke */}
                    <line x1="-16" y1="0" x2="16" y2="0" stroke="#000000" strokeWidth="2" />
                    <line x1="0" y1="-16" x2="0" y2="16" stroke="#000000" strokeWidth="2" />
                  </g>

                  {/* Finish Line */}
                  <line x1={finishX} y1={lane.y - 24} x2={finishX} y2={lane.y + 12} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                </g>
              );
            })}

            {/* Finish Line Banner */}
            <text x="640" y="45" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FINISH (15m)
            </text>
          </svg>
        )}

        {/* Derby Finished Overlay */}
        {derbyFinished && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">SPHERE WINS THE DERBY!</h2>
            <p className="text-xs text-slate-300 max-w-md mb-4 font-mono">
              1st: Solid Sphere ($a = \frac{5}{7}g\sin\theta$) | 2nd: Solid Cylinder ($a = \frac{2}{3}g\sin\theta$) | 3rd: Hollow Ring ($a = \frac{1}{2}g\sin\theta$).
              <br /><br />
              <strong className="text-amber-300">Physics Truth:</strong> Mass and radius cancel out completely! Acceleration depends solely on mass distribution geometry $k$ in $I = k M R^2$.
            </p>
            <button
              onClick={startDerby}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Race Downhill Again</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE C: ORIGINAL FORMULA ANALYSIS LAB                             */}
        {/* ================================================================= */}
        {activeMode === 'lab' && (
          <svg viewBox="0 0 720 320" className="w-full h-full">
            {/* Rotating Disc */}
            <g transform={`translate(360, 160) rotate(${labAngleDeg})`}>
              <circle
                cx="0"
                cy="0"
                r={75}
                fill="#312e81"
                stroke="#6366f1"
                strokeWidth="3"
                className="filter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              />
              <line x1="-75" y1="0" x2="75" y2="0" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="0" y1="-75" x2="0" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
            </g>
            {/* Tangential Force Vector */}
            <g transform="translate(360, 85)">
              <line x1="0" y1="0" x2={F_tan * 2.5} y2="0" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points={`${F_tan * 2.5 + 6},0 ${F_tan * 2.5 - 4},-5 ${F_tan * 2.5 - 4},5`} fill="#f59e0b" />
              <text x={F_tan * 2.5 + 12} y="4" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                F = {F_tan}N
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Bottom Interactive Controls */}
      {activeMode === 'dynamo' && (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
          {/* Wheel Geometry Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">Geometry:</span>
            <button
              onClick={() => {
                setFlywheelShape('solid');
                resetDynamo();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                flywheelShape === 'solid'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Solid Cylinder (½MR²)
            </button>
            <button
              onClick={() => {
                setFlywheelShape('hollow');
                resetDynamo();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                flywheelShape === 'hollow'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Hollow Hoop (1.0 MR²)
            </button>
          </div>

          {/* Pulse Thruster Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={pulseTangentialThruster}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-[0_0_18px_rgba(245,158,11,0.7)] transition cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current text-rose-600" />
              <span>PULSE TANGENTIAL THRUSTER</span>
            </button>

            <button
              onClick={resetDynamo}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Reset Dynamo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeMode === 'derby' && (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800 gap-4">
          <div className="text-xs text-slate-400">
            Compare how radius and mass distribution govern rolling resistance without slipping!
          </div>
          <div className="flex items-center space-x-2">
            {!derbyRunning ? (
              <button
                onClick={startDerby}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START INERTIA DERBY</span>
              </button>
            ) : (
              <button
                onClick={resetDerby}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Race</span>
              </button>
            )}
          </div>
        </div>
      )}

      {activeMode === 'lab' && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
          <button
            onClick={() => setIsLabPlaying(!isLabPlaying)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            {isLabPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isLabPlaying ? 'Pause Spin' : 'Resume Spin'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
