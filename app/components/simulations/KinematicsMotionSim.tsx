'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Crosshair, Sparkles, Volume2, VolumeX, Trophy, Target, Star, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';

interface KinematicsMotionSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
  onParamChange?: (key: string, value: number) => void;
}

// Synthesized Web Audio Sound Effects
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playStretch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(280, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playLaunch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playHitWood() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playExplosion() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    // Noise buffer for blast
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.4);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playMinionPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.1);
      osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.35);
    });
  }
}

const audio = new AudioSynthesizer();

// Minigame Structure Types
interface TargetBlock {
  id: string;
  type: 'wood' | 'stone' | 'tnt';
  x: number; // center x in virtual units
  y: number; // bottom y in virtual units
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
}

interface TargetMinion {
  id: string;
  x: number;
  y: number;
  radius: number;
  isBoss: boolean;
  destroyed: boolean;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export default function KinematicsMotionSim({
  params,
  derived,
  onParamChange
}: KinematicsMotionSimProps) {
  // Mode: 'lab' (original vector/equations lab) vs 'minigame' (Angry Birds slingshot)
  const [activeMode, setActiveMode] = useState<'minigame' | 'lab'>('minigame');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Original Lab parameters
  const v0 = params.initialSpeed ?? 25;
  const thetaDeg = params.launchAngle ?? 45;
  const g = Math.max(0.1, params.gravity ?? 9.8);
  const y0 = params.launchHeight ?? 0;

  const thetaRad = (thetaDeg * Math.PI) / 180;
  const vx0 = v0 * Math.cos(thetaRad);
  const vy0 = v0 * Math.sin(thetaRad);

  const totalFlightTime = Math.max(0.1, derived.flightTime ?? 3.6);
  const horizontalRange = Math.max(1, derived.horizontalRange ?? 63.7);
  const maxHeight = Math.max(1, derived.maxHeight ?? 16.0);

  // Lab Playback state:
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Sound toggle
  useEffect(() => {
    audio.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Reset when key parameters change in Lab mode
  useEffect(() => {
    setSimTime(0);
    setIsPlaying(false);
  }, [v0, thetaDeg, g, y0]);

  // Lab Animation Loop
  useEffect(() => {
    if (activeMode !== 'lab') return;
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const dt = ((timestamp - lastTimestampRef.current) / 1000) * simSpeed;
      lastTimestampRef.current = timestamp;

      setSimTime((prev) => {
        const nextTime = prev + dt;
        if (nextTime >= totalFlightTime) {
          setIsPlaying(false);
          return totalFlightTime;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, simSpeed, totalFlightTime, activeMode]);

  // Current Kinematic State in Lab mode:
  const currentX = vx0 * simTime;
  const currentY = Math.max(0, y0 + vy0 * simTime - 0.5 * g * simTime * simTime);
  const currentVy = vy0 - g * simTime;
  const currentSpeed = Math.sqrt(vx0 * vx0 + currentVy * currentVy);

  // SVG Coordinates for Lab mode
  const maxViewX = Math.max(80, horizontalRange * 1.15);
  const maxViewY = Math.max(30, maxHeight * 1.35);

  const svgWidth = 800;
  const svgHeight = 360;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const renderWidth = svgWidth - paddingLeft - 20;
  const renderHeight = svgHeight - paddingBottom - 30;

  const scaleX = (x: number) => paddingLeft + (x / maxViewX) * renderWidth;
  const scaleY = (y: number) => svgHeight - paddingBottom - (y / maxViewY) * renderHeight;

  // Trajectory Path for Lab
  const trajectoryPath = useMemo(() => {
    const steps = 60;
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * totalFlightTime;
      const x = vx0 * t;
      const y = Math.max(0, y0 + vy0 * t - 0.5 * g * t * t);
      const sx = scaleX(x);
      const sy = scaleY(y);
      points.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return points.join(' ');
  }, [vx0, vy0, y0, g, totalFlightTime, maxViewX, maxViewY]);

  // =========================================================================
  // SLINGSHOT MINIGAME STATE & MECHANICS (ANGRY BIRDS STYLE)
  // =========================================================================
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [birdsRemaining, setBirdsRemaining] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Slingshot anchor location in SVG pixels
  const slingAnchorX = 110;
  const slingAnchorY = 270;

  // Drag aiming state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: slingAnchorX, y: slingAnchorY });
  const [birdState, setBirdState] = useState<'ready' | 'flying' | 'impact'>('ready');
  const [birdFlight, setBirdFlight] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    t: number;
    trail: { x: number; y: number }[];
  }>({ x: slingAnchorX, y: slingAnchorY, vx: 0, vy: 0, t: 0, trail: [] });

  // Level Setup Generator
  const initLevelData = useCallback((lvl: number) => {
    if (lvl === 1) {
      // Level 1: Wooden Timber Tower
      const blocks: TargetBlock[] = [
        { id: 'w1', type: 'wood', x: 560, y: 310, width: 24, height: 70, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w2', type: 'wood', x: 630, y: 310, width: 24, height: 70, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w3', type: 'wood', x: 595, y: 240, width: 110, height: 16, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w4', type: 'wood', x: 595, y: 224, width: 24, height: 55, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w5', type: 'wood', x: 595, y: 169, width: 70, height: 14, hp: 1, maxHp: 1, destroyed: false }
      ];
      const minions: TargetMinion[] = [
        { id: 'm1', x: 595, y: 285, radius: 18, isBoss: false, destroyed: false },
        { id: 'm2', x: 595, y: 145, radius: 16, isBoss: false, destroyed: false }
      ];
      return { blocks, minions };
    } else if (lvl === 2) {
      // Level 2: TNT Depot
      const blocks: TargetBlock[] = [
        { id: 's1', type: 'stone', x: 540, y: 310, width: 28, height: 80, hp: 2, maxHp: 2, destroyed: false },
        { id: 'tnt1', type: 'tnt', x: 600, y: 310, width: 36, height: 36, hp: 1, maxHp: 1, destroyed: false },
        { id: 's2', type: 'stone', x: 660, y: 310, width: 28, height: 80, hp: 2, maxHp: 2, destroyed: false },
        { id: 'w1', type: 'wood', x: 600, y: 230, width: 160, height: 18, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w2', type: 'wood', x: 570, y: 212, width: 22, height: 50, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w3', type: 'wood', x: 630, y: 212, width: 22, height: 50, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w4', type: 'wood', x: 600, y: 162, width: 90, height: 14, hp: 1, maxHp: 1, destroyed: false }
      ];
      const minions: TargetMinion[] = [
        { id: 'm1', x: 600, y: 260, radius: 18, isBoss: false, destroyed: false },
        { id: 'm2', x: 540, y: 210, radius: 16, isBoss: false, destroyed: false },
        { id: 'm3', x: 600, y: 140, radius: 16, isBoss: false, destroyed: false }
      ];
      return { blocks, minions };
    } else {
      // Level 3: Stone Fortress with Boss King Minion
      const blocks: TargetBlock[] = [
        { id: 's1', type: 'stone', x: 520, y: 310, width: 32, height: 95, hp: 2, maxHp: 2, destroyed: false },
        { id: 'tnt1', type: 'tnt', x: 585, y: 310, width: 36, height: 36, hp: 1, maxHp: 1, destroyed: false },
        { id: 's2', type: 'stone', x: 650, y: 310, width: 32, height: 95, hp: 2, maxHp: 2, destroyed: false },
        { id: 's3', type: 'stone', x: 585, y: 215, width: 170, height: 20, hp: 2, maxHp: 2, destroyed: false },
        { id: 'w1', type: 'wood', x: 550, y: 195, width: 22, height: 60, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w2', type: 'wood', x: 620, y: 195, width: 22, height: 60, hp: 1, maxHp: 1, destroyed: false },
        { id: 'tnt2', type: 'tnt', x: 585, y: 195, width: 32, height: 32, hp: 1, maxHp: 1, destroyed: false },
        { id: 'w3', type: 'wood', x: 585, y: 135, width: 110, height: 16, hp: 1, maxHp: 1, destroyed: false }
      ];
      const minions: TargetMinion[] = [
        { id: 'm1', x: 585, y: 260, radius: 18, isBoss: false, destroyed: false },
        { id: 'boss', x: 585, y: 108, radius: 24, isBoss: true, destroyed: false }
      ];
      return { blocks, minions };
    }
  }, []);

  const [blocks, setBlocks] = useState<TargetBlock[]>(() => initLevelData(1).blocks);
  const [minions, setMinions] = useState<TargetMinion[]>(() => initLevelData(1).minions);

  // Reset or change level
  const startLevel = useCallback((lvl: number) => {
    const data = initLevelData(lvl);
    setBlocks(data.blocks);
    setMinions(data.minions);
    setCurrentLevel(lvl);
    setBirdsRemaining(3);
    setBirdState('ready');
    setIsLevelCleared(false);
    setIsGameOver(false);
    setBirdFlight({ x: slingAnchorX, y: slingAnchorY, vx: 0, vy: 0, t: 0, trail: [] });
    setDragPos({ x: slingAnchorX, y: slingAnchorY });
  }, [initLevelData]);

  // Derived Aiming Angles and Launch Speeds from Slingshot Stretch
  const stretchDx = slingAnchorX - dragPos.x;
  const stretchDy = dragPos.y - slingAnchorY; // positive when dragged down/back
  const stretchDist = Math.min(75, Math.sqrt(stretchDx * stretchDx + stretchDy * stretchDy));

  // Aim velocity derived from pull
  const aimAngleRad = Math.atan2(Math.max(0.01, stretchDy), Math.max(0.01, stretchDx));
  const aimAngleDeg = Math.min(88, Math.max(5, (aimAngleRad * 180) / Math.PI));
  const aimSpeed = Math.min(48, Math.max(10, stretchDist * 0.65));

  // Predicted trajectory dots for the slingshot
  const predictedPoints = useMemo(() => {
    if (stretchDist < 8) return [];
    const pts: { x: number; y: number }[] = [];
    const rad = (aimAngleDeg * Math.PI) / 180;
    const pVx = aimSpeed * Math.cos(rad) * 14.5;
    const pVy = -aimSpeed * Math.sin(rad) * 14.5;
    const pG = 9.8 * 28;

    for (let i = 1; i <= 22; i++) {
      const t = i * 0.07;
      const px = slingAnchorX + pVx * t;
      const py = slingAnchorY + pVy * t + 0.5 * pG * t * t;
      if (py > 320 || px > svgWidth) break;
      pts.push({ x: px, y: py });
    }
    return pts;
  }, [stretchDist, aimAngleDeg, aimSpeed]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (birdState !== 'ready' || birdsRemaining <= 0 || isLevelCleared) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * svgWidth;
    const svgY = (clientY / rect.height) * svgHeight;

    // Check if clicked reasonably near slingshot
    const distToSling = Math.hypot(svgX - slingAnchorX, svgY - slingAnchorY);
    if (distToSling < 90) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      audio.playStretch();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * svgWidth;
    const svgY = (clientY / rect.height) * svgHeight;

    // Limit drag radius to 75px
    const dx = svgX - slingAnchorX;
    const dy = svgY - slingAnchorY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 75;

    let clampedX = svgX;
    let clampedY = svgY;
    if (dist > maxDist) {
      clampedX = slingAnchorX + (dx / dist) * maxDist;
      clampedY = slingAnchorY + (dy / dist) * maxDist;
    }

    // Must be pulled leftwards or downwards
    if (clampedX > slingAnchorX + 10) clampedX = slingAnchorX + 10;

    setDragPos({ x: clampedX, y: clampedY });

    // Sync angle and speed with parent params if callback provided
    if (onParamChange && stretchDist > 10) {
      onParamChange('launchAngle', Math.round(aimAngleDeg));
      onParamChange('initialSpeed', Math.round(aimSpeed));
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (stretchDist > 12) {
      // FIRE THE BIRD!
      audio.playLaunch();
      const rad = (aimAngleDeg * Math.PI) / 180;
      const initialVx = aimSpeed * Math.cos(rad) * 14.5;
      const initialVy = -aimSpeed * Math.sin(rad) * 14.5;

      setBirdState('flying');
      setBirdFlight({
        x: slingAnchorX,
        y: slingAnchorY,
        vx: initialVx,
        vy: initialVy,
        t: 0,
        trail: []
      });
      setBirdsRemaining((prev) => prev - 1);
    } else {
      // Snap back to slingshot
      setDragPos({ x: slingAnchorX, y: slingAnchorY });
    }
  };

  // Minigame Physics Step Loop
  const minigameFrameRef = useRef<number | null>(null);
  const minigameLastTime = useRef<number | null>(null);

  useEffect(() => {
    if (activeMode !== 'minigame' || birdState !== 'flying') {
      if (minigameFrameRef.current) cancelAnimationFrame(minigameFrameRef.current);
      minigameLastTime.current = null;
      return;
    }

    const minigameStep = (timestamp: number) => {
      if (minigameLastTime.current === null) {
        minigameLastTime.current = timestamp;
      }
      const dt = Math.min(0.04, (timestamp - minigameLastTime.current) / 1000);
      minigameLastTime.current = timestamp;

      setBirdFlight((prev) => {
        const gravityG = 9.8 * 28; // scaled gravity
        const nextVy = prev.vy + gravityG * dt;
        const nextX = prev.x + prev.vx * dt;
        const nextY = prev.y + nextVy * dt;
        const nextTrail = prev.trail.length > 25 ? [...prev.trail.slice(1), { x: nextX, y: nextY }] : [...prev.trail, { x: nextX, y: nextY }];

        // 1. Check Collision with Ground (y = 310)
        if (nextY >= 310) {
          audio.playHitWood();
          setBirdState('impact');
          return { ...prev, x: nextX, y: 310, vx: 0, vy: 0, trail: nextTrail };
        }

        // 2. Check Collision with Blocks
        let hitOccurred = false;
        let tntExploded = false;
        let tntX = 0;
        let tntY = 0;

        setBlocks((currentBlocks) => {
          return currentBlocks.map((b) => {
            if (b.destroyed) return b;
            const left = b.x - b.width / 2;
            const right = b.x + b.width / 2;
            const top = b.y - b.height;
            const bottom = b.y;

            // Simple AABB / circle overlap
            const birdRadius = 14;
            if (
              nextX + birdRadius >= left &&
              nextX - birdRadius <= right &&
              nextY + birdRadius >= top &&
              nextY - birdRadius <= bottom
            ) {
              hitOccurred = true;
              if (b.type === 'tnt') {
                tntExploded = true;
                tntX = b.x;
                tntY = b.y - b.height / 2;
                audio.playExplosion();
                return { ...b, destroyed: true, hp: 0 };
              } else {
                audio.playHitWood();
                const nextHp = b.hp - 1;
                return { ...b, hp: nextHp, destroyed: nextHp <= 0 };
              }
            }
            return b;
          });
        });

        // 3. Handle TNT blast propagation
        if (tntExploded) {
          const blastRadius = 120;
          setBlocks((currentBlocks) =>
            currentBlocks.map((b) => {
              if (b.destroyed) return b;
              const dist = Math.hypot(b.x - tntX, (b.y - b.height / 2) - tntY);
              if (dist <= blastRadius) {
                return { ...b, destroyed: true, hp: 0 };
              }
              return b;
            })
          );
          setMinions((currentMinions) =>
            currentMinions.map((m) => {
              if (m.destroyed) return m;
              const dist = Math.hypot(m.x - tntX, m.y - tntY);
              if (dist <= blastRadius) {
                audio.playMinionPop();
                setScore((s) => s + (m.isBoss ? 1500 : 800));
                setScorePopups((pop) => [
                  ...pop,
                  { id: Date.now() + Math.random(), x: m.x, y: m.y - 20, text: m.isBoss ? '+1500 BOSS EXPLODED!' : '+800 TNT COMBO!', color: '#f59e0b' }
                ]);
                return { ...m, destroyed: true };
              }
              return m;
            })
          );
        }

        // 4. Check Direct Bird Hit on Minions
        setMinions((currentMinions) =>
          currentMinions.map((m) => {
            if (m.destroyed) return m;
            const dist = Math.hypot(nextX - m.x, nextY - m.y);
            if (dist <= m.radius + 14) {
              hitOccurred = true;
              audio.playMinionPop();
              const pts = m.isBoss ? 1000 : 500;
              setScore((s) => s + pts);
              setScorePopups((pop) => [
                ...pop,
                { id: Date.now() + Math.random(), x: m.x, y: m.y - 15, text: `+${pts}`, color: '#10b981' }
              ]);
              return { ...m, destroyed: true };
            }
            return m;
          })
        );

        if (hitOccurred || nextX > svgWidth + 20) {
          setBirdState('impact');
          return { ...prev, x: nextX, y: nextY, vx: prev.vx * 0.2, vy: 0, trail: nextTrail };
        }

        return { ...prev, x: nextX, y: nextY, vx: prev.vx, vy: nextVy, trail: nextTrail };
      });

      minigameFrameRef.current = requestAnimationFrame(minigameStep);
    };

    minigameFrameRef.current = requestAnimationFrame(minigameStep);

    return () => {
      if (minigameFrameRef.current) cancelAnimationFrame(minigameFrameRef.current);
    };
  }, [activeMode, birdState, svgWidth]);

  // Handle post-impact delay: re-ready the slingshot or trigger victory/defeat
  useEffect(() => {
    if (birdState !== 'impact') return;

    const timer = setTimeout(() => {
      // Check if all minions destroyed
      const remainingMinions = minions.filter((m) => !m.destroyed);
      if (remainingMinions.length === 0) {
        setIsLevelCleared(true);
        audio.playVictory();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setHighScore((prev) => Math.max(prev, score + birdsRemaining * 1000));
      } else if (birdsRemaining <= 0) {
        setIsGameOver(true);
      } else {
        // Next shot
        setBirdState('ready');
        setDragPos({ x: slingAnchorX, y: slingAnchorY });
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [birdState, minions, birdsRemaining, score]);

  // Clean up score popups over time
  useEffect(() => {
    if (scorePopups.length === 0) return;
    const interval = setTimeout(() => {
      setScorePopups((prev) => prev.slice(1));
    }, 1400);
    return () => clearTimeout(interval);
  }, [scorePopups]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD with Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMode('minigame')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'minigame'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Angry Slingshot Minigame</span>
            </button>
            <button
              onClick={() => setActiveMode('lab')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer text-[11px] ${
                activeMode === 'lab'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Vector Analysis Lab</span>
            </button>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Dynamic Metric / Score Badge */}
        {activeMode === 'minigame' ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>SCORE: {score}</span>
            </div>
            <div className="text-slate-400">
              Birds: <span className="font-bold text-rose-400">{'🔴 '.repeat(birdsRemaining)}</span>
            </div>
            <div className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
              Level {currentLevel} of 3
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-slate-300">
            <div>
              <span className="text-slate-500">Peak Y: </span>
              <strong className="text-emerald-300">{maxHeight.toFixed(1)} m</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Range X: </span>
              <strong className="text-cyan-300">{horizontalRange.toFixed(1)} m</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">Flight Time: </span>
              <strong className="text-amber-300">{totalFlightTime.toFixed(2)} s</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#070d1a] overflow-hidden">
        
        {/* ================================================================= */}
        {/* MODE A: ANGRY BIRDS SLINGSHOT MINIGAME                            */}
        {/* ================================================================= */}
        {activeMode === 'minigame' && (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full cursor-crosshair touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              {/* Sky Background Gradient */}
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0b172a" />
                <stop offset="60%" stopColor="#132742" />
                <stop offset="100%" stopColor="#1e3a5f" />
              </linearGradient>

              {/* Ground Gradient */}
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="25%" stopColor="#166534" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>

              {/* Wood Plank Pattern */}
              <linearGradient id="woodPlank" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              {/* Stone Block Gradient */}
              <linearGradient id="stoneBlock" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* TNT Box Gradient */}
              <linearGradient id="tntGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>

              {/* Slingshot Rubber Band */}
              <linearGradient id="rubberBand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Sky Background */}
            <rect width={svgWidth} height={svgHeight} fill="url(#skyGrad)" />

            {/* Stylized Mountain Silhouettes in Background */}
            <polygon points="120,310 240,160 360,310" fill="#0f1f38" opacity="0.6" />
            <polygon points="280,310 440,120 580,310" fill="#0c1b30" opacity="0.8" />
            <polygon points="500,310 660,150 780,310" fill="#0e213d" opacity="0.5" />

            {/* Ground Layer */}
            <rect x="0" y="310" width={svgWidth} height="50" fill="url(#groundGrad)" />
            <line x1="0" y1="310" x2={svgWidth} y2="310" stroke="#4ade80" strokeWidth="3" />

            {/* ================= TARGET BLOCKS ================= */}
            {blocks.map((b) => {
              if (b.destroyed) return null;
              const left = b.x - b.width / 2;
              const top = b.y - b.height;

              if (b.type === 'tnt') {
                return (
                  <g key={b.id}>
                    <rect
                      x={left}
                      y={top}
                      width={b.width}
                      height={b.height}
                      rx="3"
                      fill="url(#tntGrad)"
                      stroke="#fca5a5"
                      strokeWidth="1.5"
                      className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    />
                    <text
                      x={b.x}
                      y={top + b.height * 0.65}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="black"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      TNT
                    </text>
                  </g>
                );
              }

              return (
                <rect
                  key={b.id}
                  x={left}
                  y={top}
                  width={b.width}
                  height={b.height}
                  rx="2"
                  fill={b.type === 'wood' ? 'url(#woodPlank)' : 'url(#stoneBlock)'}
                  stroke={b.type === 'wood' ? '#f59e0b' : '#cbd5e1'}
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
              );
            })}

            {/* ================= TARGET MINIONS (PIGS) ================= */}
            {minions.map((m) => {
              if (m.destroyed) return null;
              return (
                <g key={m.id} className="animate-pulse" style={{ animationDuration: '2s' }}>
                  {/* Minion Body (Round Green Pig) */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={m.radius}
                    fill="#22c55e"
                    stroke="#15803d"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  />
                  {/* Snout */}
                  <ellipse cx={m.x} cy={m.y + 2} rx={m.radius * 0.45} ry={m.radius * 0.32} fill="#86efac" stroke="#16a34a" strokeWidth="1" />
                  <circle cx={m.x - 3} cy={m.y + 2} r="1.8" fill="#14532d" />
                  <circle cx={m.x + 3} cy={m.y + 2} r="1.8" fill="#14532d" />

                  {/* Goofy Eyes */}
                  <circle cx={m.x - m.radius * 0.35} cy={m.y - m.radius * 0.3} r={m.radius * 0.28} fill="#ffffff" />
                  <circle cx={m.x + m.radius * 0.35} cy={m.y - m.radius * 0.3} r={m.radius * 0.28} fill="#ffffff" />
                  <circle cx={m.x - m.radius * 0.3} cy={m.y - m.radius * 0.3} r={m.radius * 0.14} fill="#000000" />
                  <circle cx={m.x + m.radius * 0.4} cy={m.y - m.radius * 0.3} r={m.radius * 0.14} fill="#000000" />

                  {/* Boss Crown */}
                  {m.isBoss && (
                    <polygon
                      points={`${m.x - 14},${m.y - m.radius} ${m.x - 16},${m.y - m.radius - 12} ${m.x - 6},${m.y - m.radius - 6} ${m.x},${m.y - m.radius - 15} ${m.x + 6},${m.y - m.radius - 6} ${m.x + 16},${m.y - m.radius - 12} ${m.x + 14},${m.y - m.radius}`}
                      fill="#eab308"
                      stroke="#ca8a04"
                      strokeWidth="1.5"
                      className="filter drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]"
                    />
                  )}
                </g>
              );
            })}

            {/* ================= TRAJECTORY PREDICTION (DOTTED ARC) ================= */}
            {isDragging && predictedPoints.length > 1 && (
              <g>
                {predictedPoints.map((pt, idx) => (
                  <circle
                    key={`pred-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={Math.max(1.8, 3.8 - idx * 0.12)}
                    fill="#f43f5e"
                    opacity={Math.max(0.2, 0.9 - idx * 0.035)}
                    className="filter drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]"
                  />
                ))}
              </g>
            )}

            {/* ================= BIRD FLIGHT TRAIL ================= */}
            {birdState === 'flying' && birdFlight.trail.length > 1 && (
              <g>
                {birdFlight.trail.map((pt, idx) => (
                  <circle
                    key={`trail-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={2 + (idx / birdFlight.trail.length) * 2.5}
                    fill="#fbbf24"
                    opacity={(idx / birdFlight.trail.length) * 0.7}
                  />
                ))}
              </g>
            )}

            {/* ================= WOODEN SLINGSHOT FORK ================= */}
            {/* Back Fork Prong */}
            <line x1="110" y1="270" x2="100" y2="245" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
            <line x1="110" y1="270" x2="122" y2="245" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
            {/* Main Post */}
            <line x1="110" y1="310" x2="110" y2="270" stroke="#78350f" strokeWidth="12" strokeLinecap="round" />

            {/* Elastic Rubber Bands */}
            {birdState === 'ready' && (
              <g>
                {/* Back Band */}
                <line
                  x1="100"
                  y1="245"
                  x2={dragPos.x}
                  y2={dragPos.y}
                  stroke="url(#rubberBand)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Front Band */}
                <line
                  x1="122"
                  y1="245"
                  x2={dragPos.x}
                  y2={dragPos.y}
                  stroke="url(#rubberBand)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* ================= THE BIRD PROJECTILE ================= */}
            {(() => {
              const bX = birdState === 'flying' ? birdFlight.x : dragPos.x;
              const bY = birdState === 'flying' ? birdFlight.y : dragPos.y;

              return (
                <g transform={`translate(${bX}, ${bY})`}>
                  {/* Bird Body (Red Fireball) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill="#ef4444"
                    stroke="#991b1b"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                  />
                  {/* Belly */}
                  <path d="M -9 5 Q 0 14 9 5 Q 0 8 -9 5 Z" fill="#fecaca" />
                  {/* Tuft Feathers on head */}
                  <polygon points="-4,-14 -1,-22 4,-14" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  {/* Angry Eyes */}
                  <circle cx="2" cy="-4" r="3.5" fill="#ffffff" />
                  <circle cx="7" cy="-4" r="3.5" fill="#ffffff" />
                  <circle cx="3" cy="-4" r="1.6" fill="#000000" />
                  <circle cx="8" cy="-4" r="1.6" fill="#000000" />
                  {/* Angry Eyebrows */}
                  <line x1="0" y1="-8" x2="10" y2="-6" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Yellow Beak */}
                  <polygon points="5,-1 15,1 5,4" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                </g>
              );
            })()}

            {/* Front Fork Prong Highlight */}
            <circle cx="100" cy="245" r="4.5" fill="#92400e" />
            <circle cx="122" cy="245" r="4.5" fill="#92400e" />

            {/* ================= FLOATING SCORE POPUPS ================= */}
            {scorePopups.map((pop) => (
              <text
                key={pop.id}
                x={pop.x}
                y={pop.y}
                fill={pop.color}
                fontSize="14"
                fontWeight="black"
                fontFamily="sans-serif"
                textAnchor="middle"
                className="filter drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] animate-bounce"
              >
                {pop.text}
              </text>
            ))}

            {/* Aiming Physics Telemetry on drag */}
            {isDragging && (
              <g transform="translate(40, 40)">
                <rect width="180" height="52" rx="8" fill="#020617" opacity="0.88" stroke="#334155" strokeWidth="1" />
                <text x="12" y="18" fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Angle θ: {aimAngleDeg.toFixed(1)}°
                </text>
                <text x="12" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Launch v₀: {aimSpeed.toFixed(1)} m/s
                </text>
                <text x="12" y="44" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  Release to launch projectile!
                </text>
              </g>
            )}
          </svg>
        )}

        {/* Level Complete Overlay */}
        {isLevelCleared && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" />
              <Star className="w-10 h-10 fill-current text-amber-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <Star className="w-8 h-8 fill-current text-amber-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mb-1">FORTRESS DESTROYED!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              All targets eliminated with parabolic kinematics. Remaining birds bonus: +{birdsRemaining * 1000} pts!
            </p>
            <div className="bg-slate-900 border border-slate-700 px-6 py-2.5 rounded-xl font-mono text-lg font-black text-amber-300 mb-5">
              FINAL SCORE: {score + birdsRemaining * 1000}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => startLevel(currentLevel)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Fort</span>
              </button>
              {currentLevel < 3 ? (
                <button
                  onClick={() => startLevel(currentLevel + 1)}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
                >
                  <span>Next Level {currentLevel + 1}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => startLevel(1)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Start Campaign Over</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn">
            <h2 className="text-2xl font-black text-rose-400 tracking-wide mb-1">OUT OF BIRDS!</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              The fortress remains standing. Adjust your launch angle and stretch velocity to hit critical weak spots!
            </p>
            <button
              onClick={() => startLevel(currentLevel)}
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Fort Again</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE B: ORIGINAL VECTOR ANALYSIS / EQUATIONS LAB                 */}
        {/* ================================================================= */}
        {activeMode === 'lab' && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
            <defs>
              <linearGradient id="groundGradLab" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`grid-v-${i}`}
                x1={scaleX((maxViewX / 8) * i)}
                y1={scaleY(maxViewY)}
                x2={scaleX((maxViewX / 8) * i)}
                y2={scaleY(0)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`grid-h-${i}`}
                x1={scaleX(0)}
                y1={scaleY((maxViewY / 5) * i)}
                x2={scaleX(maxViewX)}
                y2={scaleY((maxViewY / 5) * i)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {/* Ground Level */}
            <rect x="0" y={scaleY(0)} width={svgWidth} height={paddingBottom} fill="url(#groundGradLab)" />
            <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(maxViewX)} y2={scaleY(0)} stroke="#475569" strokeWidth="2" />

            {/* Launch Platform / Elevation */}
            {y0 > 0 && (
              <rect
                x={scaleX(0) - 20}
                y={scaleY(y0)}
                width="20"
                height={scaleY(0) - scaleY(y0)}
                fill="#334155"
                stroke="#64748b"
                strokeWidth="1.5"
              />
            )}

            {/* Trajectory Parabola Curve */}
            <path
              d={trajectoryPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              className="opacity-60"
            />

            {/* Apex Altitude Marker */}
            <line
              x1={scaleX(horizontalRange / 2)}
              y1={scaleY(0)}
              x2={scaleX(horizontalRange / 2)}
              y2={scaleY(maxHeight)}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <circle cx={scaleX(horizontalRange / 2)} cy={scaleY(maxHeight)} r="4" fill="#10b981" />
            <text
              x={scaleX(horizontalRange / 2) + 8}
              y={scaleY(maxHeight) + 4}
              fill="#10b981"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Peak: {maxHeight.toFixed(1)}m
            </text>

            {/* Impact Distance Marker */}
            <line
              x1={scaleX(horizontalRange)}
              y1={scaleY(0) - 6}
              x2={scaleX(horizontalRange)}
              y2={scaleY(0) + 6}
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text
              x={scaleX(horizontalRange)}
              y={scaleY(0) + 18}
              fill="#f59e0b"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {horizontalRange.toFixed(1)}m
            </text>

            {/* Real-time Projectile Position */}
            {(() => {
              const sx = scaleX(currentX);
              const sy = scaleY(currentY);
              const vecScale = 2.2;
              const vxLen = vx0 * vecScale;
              const vyLen = -currentVy * vecScale;

              return (
                <g>
                  {/* Current Projectile Ball */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r="8"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  />

                  {/* Horizontal Velocity Vector (vx, Constant Green) */}
                  <line
                    x1={sx}
                    y1={sy}
                    x2={sx + vxLen}
                    y2={sy}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${sx + vxLen},${sy} ${sx + vxLen - 5},${sy - 3} ${sx + vxLen - 5},${sy + 3}`}
                    fill="#10b981"
                  />

                  {/* Vertical Velocity Vector (vy, Dynamic Amber/Rose) */}
                  <line
                    x1={sx}
                    y1={sy}
                    x2={sx}
                    y2={sy + vyLen}
                    stroke={currentVy >= 0 ? '#f59e0b' : '#f43f5e'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${sx},${sy + vyLen} ${sx - 3},${sy + vyLen - (currentVy >= 0 ? -5 : 5)} ${sx + 3},${sy + vyLen - (currentVy >= 0 ? -5 : 5)}`}
                    fill={currentVy >= 0 ? '#f59e0b' : '#f43f5e'}
                  />

                  {/* Velocity Labels */}
                  <text
                    x={sx + 10}
                    y={sy - 12}
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    v: {currentSpeed.toFixed(1)} m/s
                  </text>
                </g>
              );
            })()}
          </svg>
        )}
      </div>

      {/* Mode Bottom Controls */}
      {activeMode === 'minigame' ? (
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Controls:</span>
            <span>Click/Touch the Slingshot & drag backwards to stretch tension and set angle. Release to shoot!</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => startLevel(currentLevel)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Level</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 gap-3">
          {/* Play/Pause/Reset Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (simTime >= totalFlightTime) setSimTime(0);
                setIsPlaying(!isPlaying);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-md text-xs ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : simTime >= totalFlightTime ? 'Replay' : 'Launch'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSimTime(0);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSimTime((prev) => Math.min(totalFlightTime, prev + 0.1));
              }}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer text-[10px]"
              title="Step forward 0.1s"
            >
              +0.1s Step
            </button>
          </div>

          {/* Time Scrubber Slider */}
          <div className="flex-1 min-w-[180px] max-w-xs flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0"
              max={totalFlightTime}
              step="0.01"
              value={simTime}
              onChange={(e) => {
                setIsPlaying(false);
                setSimTime(parseFloat(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-slate-400 shrink-0">{simTime.toFixed(1)}s</span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
            <FastForward className="w-3 h-3 text-slate-500" />
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
