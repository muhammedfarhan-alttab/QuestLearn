'use client';
import React, { useMemo } from 'react';
import { Sparkles, Zap, Layers, Activity, TrendingUp, Cpu, BatteryCharging, Maximize2 } from 'lucide-react';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';
import { PracticalModelConfig } from '../../data/practicalModelsData';

interface ConceptLabSimProps {
  params: Record<string, number>;
  derived: DerivedLabMetrics;
  modelConfig?: PracticalModelConfig;
}

export default function ConceptLabSim({
  params,
  derived,
  modelConfig
}: ConceptLabSimProps) {
  const modelId = modelConfig?.id || '';

  // Mode Detection
  const isRiemann = modelId === 'calc-s4-lab' || (params.upperLimit !== undefined && params.partitionCount !== undefined);
  const isPowerRule = modelId === 'calc-s2-lab' || (params.coefficient !== undefined && params.exponent !== undefined);
  const isConcavity = modelId === 'calc-s3-lab' || (params.scaleParam !== undefined && params.xCoord !== undefined && !isPowerRule);
  const isExpGrowth = modelId === 'calc-s5-lab' || (params.growthRate !== undefined && params.initialAmount !== undefined);
  const isCalculus1 = modelId === 'calc-s1-lab' || (params.xCoord !== undefined && !isPowerRule && !isConcavity && !isRiemann);

  const isCapacitor = modelId === 'em-s2-lab' || (params.plateArea !== undefined || params.separation !== undefined);
  const isLorentz = modelId === 'em-s4-lab' || (params.magneticField !== undefined || (params.charge !== undefined && params.velocity !== undefined));
  const isEMWave = modelId === 'em-s5-lab' || (params.frequency !== undefined && params.amplitude !== undefined);
  const isCoulomb = modelId === 'em-s1-lab' || (params.charge1 !== undefined && params.charge2 !== undefined);
  const isCircuit = modelId === 'em-s3-lab' || (params.voltage !== undefined && params.resistance !== undefined && !isCapacitor);

  const isBigO = modelId === 'cs-s1-lab' || (params.inputSize !== undefined);
  const isStack = modelId === 'cs-s2-lab' || (params.recursionDepth !== undefined && !isBigO);
  const isBST = modelId === 'cs-s3-lab' || (params.treeNodes !== undefined);
  const isDP = modelId === 'cs-s4-lab' || (params.problemSize !== undefined);
  const isSpaceTime = modelId === 'cs-s5-lab' || (params.bufferSize !== undefined || params.batchSize !== undefined);

  const svgWidth = 720;
  const svgHeight = 320;

  // Exact Cartesian coordinates for Calculus f(x) = x^2
  // Origin: (360, 250), scaleX: 60 px/unit, scaleY: 12 px/unit
  const originX = 360;
  const originY = 250;
  const scaleX = 60;
  const scaleY = 12;

  // Mathematically exact parabola path sampled directly from screenY = originY - (x^2)*scaleY
  const parabolaPathD = useMemo(() => {
    const pts: string[] = [];
    for (let x = -3.8; x <= 3.81; x += 0.05) {
      const sx = originX + x * scaleX;
      const sy = originY - (x * x) * scaleY;
      pts.push(`${pts.length === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [originX, originY, scaleX, scaleY]);

  // Riemann Sums rectangles calculation
  const riemannData = useMemo(() => {
    if (!isRiemann) return null;
    const b = Math.max(0.5, params.upperLimit ?? 3.0);
    const N = Math.max(1, Math.round(params.partitionCount ?? 6));
    const deltaX = b / N;
    const rects = [];
    for (let i = 1; i <= N; i++) {
      const xRight = i * deltaX;
      const xLeft = (i - 1) * deltaX;
      const rx = originX + xLeft * scaleX;
      const rw = deltaX * scaleX;
      const h = xRight * xRight;
      const rh = h * scaleY;
      const ry = originY - rh;
      rects.push({ rx, ry, rw, rh, i, xRight, h });
    }
    return { b, N, deltaX, rects };
  }, [isRiemann, params.upperLimit, params.partitionCount, originX, originY, scaleX, scaleY]);

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>
              {isCalculus1 ? 'CALCULUS: INSTANTANEOUS TANGENT & SECANT LIMIT' :
               isRiemann ? 'CALCULUS: RIEMANN PARTITION ACCUMULATION' :
               isPowerRule ? 'CALCULUS: POLYNOMIAL POWER RULE & DERIVATIVES' :
               isConcavity ? 'CALCULUS: SECOND DERIVATIVE & CRITICAL EXTREMA' :
               isExpGrowth ? 'CALCULUS: EXPONENTIAL GROWTH DIFFERENTIAL EQ' :
               isCapacitor ? 'ELECTROMAGNETISM: PARALLEL PLATE CAPACITOR' :
               isCoulomb ? 'ELECTROMAGNETISM: COULOMB POINT CHARGE FIELDS' :
               isCircuit ? 'ELECTROMAGNETISM: DC CIRCUIT & OHMIC HEATING' :
               isLorentz ? 'ELECTROMAGNETISM: LORENTZ MAGNETIC DEFLECTION' :
               isEMWave ? 'ELECTROMAGNETISM: MAXWELL TRANSVERSE RADIATION' :
               isBigO ? 'ALGORITHMS: BIG-O ASYMPTOTIC COMPLEXITY' :
               isStack ? 'COMPUTING: CALL STACK EXECUTION FRAMES' :
               isBST ? 'DATA STRUCTURES: BINARY SEARCH TREE DEPTH' :
               isDP ? 'ALGORITHMS: DP MEMOIZATION CACHE MULTIPLIER' :
               isSpaceTime ? 'SYSTEMS: SPACE-TIME COMPLEXITY TRADEOFF' :
               (modelConfig?.title || 'STEM INTERACTIVE CONCEPT LAB').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Dynamic Metric Badge */}
        <div className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
          {isCalculus1 && (
            <span>Tangent Slope f'(x): <strong className="text-emerald-300">{(derived.slope ?? (2 * (params.xCoord ?? 1.5))).toFixed(2)}</strong></span>
          )}
          {isRiemann && (
            <span>Riemann Sum: <strong className="text-emerald-300">{(derived.riemannSum ?? 0).toFixed(2)}</strong> | Exact ∫: <strong className="text-cyan-300">{(derived.exactIntegral ?? 0).toFixed(2)}</strong></span>
          )}
          {isPowerRule && (
            <span>f(x): <strong className="text-cyan-300">{(derived.yVal ?? 0).toFixed(2)}</strong> | f'(x): <strong className="text-emerald-300">{(derived.slope ?? 0).toFixed(2)}</strong></span>
          )}
          {isConcavity && (
            <span>f'(x): <strong className="text-amber-300">{(derived.slope ?? 0).toFixed(2)}</strong> | f''(x): <strong className="text-indigo-300">{(derived.secondDerivative ?? 0).toFixed(2)}</strong></span>
          )}
          {isExpGrowth && (
            <span>y(t): <strong className="text-emerald-300">{(derived.currentValue ?? 0).toFixed(1)}</strong> | dy/dt: <strong className="text-amber-300">{(derived.growthRateVal ?? 0).toFixed(1)}/s</strong></span>
          )}
          {isCapacitor && (
            <span>Capacitance: <strong className="text-cyan-300">{(derived.capacitance ?? 0).toFixed(1)} pF</strong> | E-Field: <strong className="text-amber-300">{(derived.electricField ?? 0).toFixed(0)} V/m</strong></span>
          )}
          {isCoulomb && (
            <span>Coulomb Force: <strong className="text-amber-300">{(derived.coulombForce ?? 0).toFixed(2)} N</strong></span>
          )}
          {isCircuit && (
            <span>Current I: <strong className="text-cyan-300">{(derived.current ?? 0).toFixed(2)} A</strong> | Power: <strong className="text-amber-300">{(derived.power ?? 0).toFixed(1)} W</strong></span>
          )}
          {isLorentz && (
            <span>Lorentz Force: <strong className="text-rose-300">{(derived.lorentzForce ?? 0).toFixed(1)} μN</strong></span>
          )}
          {isEMWave && (
            <span>Wavelength λ: <strong className="text-cyan-300">{(derived.wavelength ?? 0).toFixed(2)} m</strong> | B₀: <strong className="text-indigo-300">{(derived.magneticAmplitude ?? 0).toFixed(0)} nT</strong></span>
          )}
          {isBigO && (
            <span>O(log N): <strong className="text-emerald-300">{(derived.opsLogN ?? 7).toFixed(0)}</strong> | O(N²): <strong className="text-rose-400">{(derived.opsNSquared ?? 10000).toLocaleString()}</strong> ops</span>
          )}
          {isStack && (
            <span>Stack Allocated: <strong className="text-violet-300">{(derived.totalStackMemory ?? 0).toFixed(0)} KB</strong></span>
          )}
          {isBST && (
            <span>Tree Height H: <strong className="text-emerald-300">{(derived.treeHeight ?? 6).toFixed(0)} levels</strong></span>
          )}
          {isDP && (
            <span>Speedup: <strong className="text-emerald-300">{(derived.speedupFactor ?? 178).toFixed(0)}x faster</strong></span>
          )}
          {isSpaceTime && (
            <span>Latency: <strong className="text-emerald-300">{(derived.ioLatency ?? 15.6).toFixed(1)} ms</strong> | Throughput: <strong className="text-cyan-300">{(derived.throughput ?? 1280).toFixed(0)} req/s</strong></span>
          )}
          {!isCalculus1 && !isRiemann && !isPowerRule && !isConcavity && !isExpGrowth && !isCapacitor && !isCoulomb && !isCircuit && !isLorentz && !isEMWave && !isBigO && !isStack && !isBST && !isDP && !isSpaceTime && (
            <span>Result Y: <strong className="text-cyan-300">{(derived.result ?? 0).toFixed(2)}</strong></span>
          )}
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#050914] overflow-hidden flex items-center justify-center">
        
        {/* ================================================================= */}
        {/* 1. CALCULUS: TANGENT LINE & LIMIT SLOPES (calc-s1-lab)            */}
        {/* ================================================================= */}
        {isCalculus1 && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            <defs>
              <linearGradient id="curveGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines */}
            {[-3, -2, -1, 1, 2, 3].map((tx) => (
              <line
                key={`grid-x-${tx}`}
                x1={originX + tx * scaleX}
                y1={30}
                x2={originX + tx * scaleX}
                y2={270}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2,3"
              />
            ))}
            {[4, 8, 12, 16].map((ty) => (
              <line
                key={`grid-y-${ty}`}
                x1={60}
                y1={originY - ty * scaleY}
                x2={660}
                y2={originY - ty * scaleY}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2,3"
              />
            ))}

            {/* Coordinate Axes */}
            <line x1="60" y1={originY} x2="660" y2={originY} stroke="#475569" strokeWidth="2" />
            <line x1={originX} y1="30" x2={originX} y2={275} stroke="#475569" strokeWidth="2" />
            
            {/* Axis Arrows */}
            <polygon points="665,250 655,246 655,254" fill="#475569" />
            <polygon points="360,25 356,35 364,35" fill="#475569" />

            {/* Axis Tick Labels */}
            {[-3, -2, -1, 1, 2, 3].map((tx) => (
              <g key={`tick-x-${tx}`}>
                <line x1={originX + tx * scaleX} y1={originY - 4} x2={originX + tx * scaleX} y2={originY + 4} stroke="#64748b" strokeWidth="1.5" />
                <text x={originX + tx * scaleX} y={originY + 16} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {tx}
                </text>
              </g>
            ))}
            {[4, 8, 12, 16].map((ty) => (
              <g key={`tick-y-${ty}`}>
                <line x1={originX - 4} y1={originY - ty * scaleY} x2={originX + 4} y2={originY - ty * scaleY} stroke="#64748b" strokeWidth="1.5" />
                <text x={originX - 10} y={originY - ty * scaleY + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {ty}
                </text>
              </g>
            ))}
            <text x="655" y={originY - 8} fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">x</text>
            <text x={originX + 10} y="35" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>

            {/* Blue Parabola Path (Vertex at originX, originY = 360, 250) */}
            <path
              d={parabolaPathD}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="3"
              className="filter drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]"
            />
            <text x="600" y="65" fill="#0ea5e9" fontSize="12" fontWeight="bold" fontFamily="monospace">
              f(x) = x²
            </text>

            {/* Dynamic Contact Point and Tangent Line */}
            {(() => {
              const xVal = params.xCoord ?? 1.5;
              const dx = params.deltaX ?? 0.5;
              
              // 100% mathematically aligned contact point
              const screenX = originX + xVal * scaleX;
              const screenY = originY - (xVal * xVal) * scaleY;
              const slope = 2 * xVal;

              // Tangent segment: dy/dx = -scaleY/scaleX * slope = -12/60 * (2 * xVal) = -0.4 * xVal
              const dxHalf = 65;
              const dyHalf = dxHalf * (0.4 * xVal);
              const tanX1 = screenX - dxHalf;
              const tanY1 = screenY + dyHalf;
              const tanX2 = screenX + dxHalf;
              const tanY2 = screenY - dyHalf;

              // Secant point P2 = (x + dx, (x+dx)^2)
              const x2 = xVal + dx;
              const secX = originX + x2 * scaleX;
              const secY = originY - (x2 * x2) * scaleY;
              const secantSlope = dx !== 0 ? ((x2 * x2) - (xVal * xVal)) / dx : slope;

              return (
                <g>
                  {/* Dashed Projections from Contact Point to Axes */}
                  <line x1={screenX} y1={screenY} x2={screenX} y2={originY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                  <line x1={screenX} y1={screenY} x2={originX} y2={screenY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

                  {/* Secant line if deltaX > 0 */}
                  {dx > 0.05 && (
                    <g>
                      <line
                        x1={screenX - 30}
                        y1={screenY + 30 * ((secY - screenY) / (secX - screenX || 1))}
                        x2={secX + 40}
                        y2={secY - 40 * ((screenY - secY) / (secX - screenX || 1))}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        opacity="0.85"
                      />
                      {/* Secant Point P2 */}
                      <circle cx={secX} cy={secY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={secX + 8} y={secY - 6} fill="#f59e0b" fontSize="9" fontFamily="monospace">
                        P₂(x+Δx)
                      </text>
                    </g>
                  )}

                  {/* Tangent Line Segment (Passing EXACTLY through contact point) */}
                  <line
                    x1={tanX1}
                    y1={tanY1}
                    x2={tanX2}
                    y2={tanY2}
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  />

                  {/* Primary Contact Point P1 on Curve */}
                  <circle
                    cx={screenX}
                    cy={screenY}
                    r="6.5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_10px_rgba(244,63,94,0.9)] cursor-pointer"
                  />

                  {/* Slope Callout Tag */}
                  <g transform={`translate(${screenX + (xVal >= 0 ? 14 : -120)}, ${Math.min(220, Math.max(50, screenY - 18))})`}>
                    <rect x="0" y="0" width="112" height="34" rx="6" fill="#020617" stroke="#10b981" strokeWidth="1.2" opacity="0.95" />
                    <text x="8" y="14" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      f'({xVal.toFixed(1)}) = {slope.toFixed(2)}
                    </text>
                    <text x="8" y="27" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      Point: ({xVal.toFixed(1)}, {(xVal * xVal).toFixed(2)})
                    </text>
                  </g>
                </g>
              );
            })()}
          </svg>
        )}

        {/* ================================================================= */}
        {/* 2. CALCULUS: RIEMANN SUM ACCUMULATION (calc-s4-lab)              */}
        {/* ================================================================= */}
        {isRiemann && riemannData && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            {/* Coordinate Axes */}
            <line x1="60" y1={originY} x2="660" y2={originY} stroke="#475569" strokeWidth="2" />
            <line x1={originX} y1="30" x2={originX} y2={275} stroke="#475569" strokeWidth="2" />

            {/* Riemann Partition Rectangles */}
            {riemannData.rects.map((r) => (
              <g key={`riemann-rect-${r.i}`}>
                <rect
                  x={r.rx}
                  y={r.ry}
                  width={r.rw}
                  height={r.rh}
                  fill="rgba(16, 185, 129, 0.22)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                {/* Right Endpoint Dot */}
                <circle cx={r.rx + r.rw} cy={r.ry} r="3" fill="#10b981" />
              </g>
            ))}

            {/* Exact Continuous Parabola Curve */}
            <path
              d={parabolaPathD}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              opacity="0.9"
            />

            {/* Upper Bound Marker (x = b) */}
            <line
              x1={originX + riemannData.b * scaleX}
              y1="40"
              x2={originX + riemannData.b * scaleX}
              y2={originY}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <text
              x={originX + riemannData.b * scaleX}
              y={originY + 18}
              fill="#f59e0b"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              b = {riemannData.b.toFixed(1)}
            </text>

            {/* Info Banner */}
            <g transform="translate(80, 50)">
              <rect width="210" height="52" rx="8" fill="#090d16" stroke="#334155" strokeWidth="1" />
              <text x="12" y="18" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
                N = {riemannData.N} Rectangles (Δx = {riemannData.deltaX.toFixed(2)})
              </text>
              <text x="12" y="32" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                Riemann Sum: {(derived.riemannSum ?? 0).toFixed(2)} units²
              </text>
              <text x="12" y="45" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                Exact Area ∫: {(derived.exactIntegral ?? 0).toFixed(2)} units²
              </text>
            </g>
          </svg>
        )}

        {/* ================================================================= */}
        {/* 3. ELECTROMAGNETISM: PARALLEL PLATE CAPACITOR (em-s2-lab)         */}
        {/* ================================================================= */}
        {isCapacitor && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            {(() => {
              const sep = params.separation ?? 0.005; // 0.002 to 0.015 m
              const area = params.plateArea ?? 0.1; // 0.05 to 0.5 m²
              const volt = params.voltage ?? 50;

              // Visual scales
              const gapPx = 100 + ((sep - 0.002) / 0.013) * 160; // 100 to 260 px
              const plateHeight = 120 + ((area - 0.05) / 0.45) * 110; // 120 to 230 px
              const leftX = 360 - gapPx / 2;
              const rightX = 360 + gapPx / 2;
              const topY = 160 - plateHeight / 2;

              return (
                <g>
                  {/* Left Plate (+ Charge) */}
                  <rect
                    x={leftX - 14}
                    y={topY}
                    width="14"
                    height={plateHeight}
                    rx="3"
                    fill="#0284c7"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_12px_rgba(2,132,199,0.5)]"
                  />
                  {/* Positive Signs */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <text
                      key={`pos-${i}`}
                      x={leftX - 7}
                      y={topY + 20 + i * (plateHeight / 5.5)}
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      +
                    </text>
                  ))}

                  {/* Right Plate (- Charge) */}
                  <rect
                    x={rightX}
                    y={topY}
                    width="14"
                    height={plateHeight}
                    rx="3"
                    fill="#e11d48"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_12px_rgba(225,29,72,0.5)]"
                  />
                  {/* Negative Signs */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <text
                      key={`neg-${i}`}
                      x={rightX + 7}
                      y={topY + 20 + i * (plateHeight / 5.5)}
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      −
                    </text>
                  ))}

                  {/* Uniform Electric Field Arrows between plates */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const arrowY = topY + 25 + i * (plateHeight / 4.5);
                    return (
                      <g key={`efield-${i}`}>
                        <line
                          x1={leftX + 4}
                          y1={arrowY}
                          x2={rightX - 6}
                          y2={arrowY}
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                        <polygon
                          points={`${rightX - 6},${arrowY} ${rightX - 14},${arrowY - 4} ${rightX - 14},${arrowY + 4}`}
                          fill="#f59e0b"
                        />
                      </g>
                    );
                  })}

                  {/* Separation Distance Dimension Line */}
                  <line x1={leftX} y1="280" x2={rightX} y2="280" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1={leftX} y1="274" x2={leftX} y2="286" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1={rightX} y1="274" x2={rightX} y2="286" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="360" y="275" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontFamily="monospace">
                    d = {(sep * 1000).toFixed(1)} mm
                  </text>

                  {/* Field Strength Readout in center gap */}
                  <rect x="300" y="145" width="120" height="30" rx="6" fill="#020617" stroke="#f59e0b" strokeWidth="1" opacity="0.9" />
                  <text x="360" y="164" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    E = {(derived.electricField ?? 0).toFixed(0)} V/m
                  </text>
                </g>
              );
            })()}
          </svg>
        )}

        {/* ================================================================= */}
        {/* 4. ELECTROMAGNETISM: COULOMB POINT CHARGES (em-s1-lab)            */}
        {/* ================================================================= */}
        {isCoulomb && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            <defs>
              <marker id="coulomb-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Distance line */}
            <line x1="240" y1="160" x2="480" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
            <text x="360" y="148" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              r = {params.distance ?? 0.5} m
            </text>

            {(() => {
              const q1 = params.charge1 ?? 4;
              const q2 = params.charge2 ?? -4;
              return (
                <>
                  {/* Charge 1 */}
                  <circle
                    cx="240"
                    cy="160"
                    r="28"
                    fill={q1 >= 0 ? '#0284c7' : '#e11d48'}
                    stroke="#f0f9ff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_12px_rgba(2,132,199,0.6)]"
                  />
                  <text x="240" y="165" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {q1 >= 0 ? `+${q1}μC` : `${q1}μC`}
                  </text>

                  {/* Charge 2 */}
                  <circle
                    cx="480"
                    cy="160"
                    r="28"
                    fill={q2 >= 0 ? '#0284c7' : '#e11d48'}
                    stroke="#f0f9ff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_12px_rgba(225,29,72,0.6)]"
                  />
                  <text x="480" y="165" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {q2 >= 0 ? `+${q2}μC` : `${q2}μC`}
                  </text>

                  {/* Force Arrows */}
                  {q1 * q2 < 0 ? (
                    <g>
                      <line x1="268" y1="160" x2="330" y2="160" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#coulomb-arr)" />
                      <line x1="452" y1="160" x2="390" y2="160" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#coulomb-arr)" />
                      <text x="360" y="195" fill="#10b981" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                        ATTRACTIVE FORCE (Opposite Signs)
                      </text>
                    </g>
                  ) : (
                    <g>
                      <line x1="212" y1="160" x2="140" y2="160" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#coulomb-arr)" />
                      <line x1="508" y1="160" x2="580" y2="160" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#coulomb-arr)" />
                      <text x="360" y="195" fill="#f43f5e" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                        REPULSIVE FORCE (Like Signs)
                      </text>
                    </g>
                  )}
                </>
              );
            })()}
          </svg>
        )}

        {/* ================================================================= */}
        {/* 5. ELECTROMAGNETISM: DC CIRCUIT & OHMIC HEATING (em-s3-lab)       */}
        {/* ================================================================= */}
        {isCircuit && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            <rect x="180" y="70" width="360" height="180" fill="none" stroke="#475569" strokeWidth="4" rx="12" />

            {/* Battery DC Source */}
            <g transform="translate(180, 160)">
              <rect x="-12" y="-25" width="24" height="50" fill="#090d16" />
              <line x1="0" y1="-22" x2="0" y2="22" stroke="#38bdf8" strokeWidth="5" />
              <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#64748b" strokeWidth="3" />
              <text x="-24" y="5" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                {params.voltage}V
              </text>
            </g>

            {/* Load Resistor */}
            <g transform="translate(360, 70)">
              <rect x="-40" y="-12" width="80" height="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="4" />
              <text x="0" y="4" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                R = {params.resistance} Ω
              </text>
            </g>

            {/* Glowing Lamp */}
            <g transform="translate(540, 160)">
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="#fde047"
                fillOpacity={Math.min(1, Math.max(0.2, (derived.power ?? 10) / 60))}
                stroke="#eab308"
                strokeWidth="3"
                className="filter drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]"
              />
              <path d="M -10 -10 L 10 10 M -10 10 L 10 -10" stroke="#854d0e" strokeWidth="2" />
              <text x="32" y="5" fill="#fde047" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {(derived.power ?? 0).toFixed(0)}W
              </text>
            </g>

            {/* Electron Flow Dots */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                cx={200 + i * 40}
                cy="250"
                r="3"
                fill="#38bdf8"
                className="animate-pulse"
              />
            ))}
          </svg>
        )}

        {/* ================================================================= */}
        {/* 6. COMPUTER SCIENCE: BIG-O ASYMPTOTIC COMPLEXITY (cs-s1-lab)       */}
        {/* ================================================================= */}
        {isBigO && (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[350px]">
            {/* Chart Axes */}
            <line x1="80" y1="260" x2="650" y2="260" stroke="#475569" strokeWidth="2" />
            <line x1="80" y1="30" x2="80" y2="260" stroke="#475569" strokeWidth="2" />
            <text x="650" y="278" fill="#94a3b8" fontSize="10" fontFamily="monospace">Input Size (N)</text>
            <text x="75" y="25" fill="#94a3b8" fontSize="10" fontFamily="monospace">Operations</text>

            {/* Curves */}
            {/* O(1) Constant */}
            <line x1="80" y1="245" x2="640" y2="245" stroke="#38bdf8" strokeWidth="2" />
            <text x="645" y="248" fill="#38bdf8" fontSize="10" fontFamily="monospace">O(1)</text>

            {/* O(log N) */}
            <path
              d="M 80 245 Q 250 235 640 220"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <text x="645" y="222" fill="#10b981" fontSize="10" fontFamily="monospace">O(log N)</text>

            {/* O(N) Linear */}
            <line x1="80" y1="245" x2="640" y2="130" stroke="#6366f1" strokeWidth="2.5" />
            <text x="645" y="132" fill="#6366f1" fontSize="10" fontFamily="monospace">O(N)</text>

            {/* O(N^2) Quadratic */}
            <path
              d="M 80 245 Q 260 220 480 40"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
            />
            <text x="485" y="42" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">O(N²)</text>

            {/* Cursor for active input size N */}
            {(() => {
              const N = params.inputSize ?? 100;
              const cursorX = 80 + (Math.min(1000, N) / 1000) * 560;
              return (
                <g>
                  <line x1={cursorX} y1="30" x2={cursorX} y2="260" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx={cursorX} cy="260" r="4" fill="#f59e0b" />
                  <text x={cursorX} y="278" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    N = {N}
                  </text>
                </g>
              );
            })()}
          </svg>
        )}

        {/* ================================================================= */}
        {/* 7. COMPUTER SCIENCE: CALL STACK FRAMES (cs-s2-lab)                */}
        {/* ================================================================= */}
        {isStack && (
          <div className="flex flex-col-reverse items-center justify-center p-6 space-y-reverse space-y-2 w-full max-w-sm">
            {Array.from({ length: Math.min(10, params.recursionDepth ?? 5) }).map((_, i) => (
              <div
                key={i}
                className="w-full bg-indigo-950/80 border border-indigo-500/50 rounded-lg py-2 px-4 flex items-center justify-between text-xs font-mono text-indigo-200 shadow-md animate-fade-in"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-indigo-900 px-1.5 py-0.5 rounded text-indigo-300">Frame #{i + 1}</span>
                  <span className="font-bold">solveSubproblem({i})</span>
                </div>
                <span className="text-[10px] text-slate-400">{params.frameMemory ?? 32} KB</span>
              </div>
            ))}
            <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-2">
              ▲ Stack Growth (LIFO)
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. GENERIC STEM MODEL CANVAS                                      */}
        {/* ================================================================= */}
        {!isCalculus1 && !isRiemann && !isCapacitor && !isCoulomb && !isCircuit && !isBigO && !isStack && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-10 h-10 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-cyan-400 font-mono">
              {(derived.result ?? derived.slope ?? derived.yVal ?? 100).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 font-mono max-w-md text-center">
              {modelConfig?.title || 'Interactive STEM simulation'} active and responding to inputs.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
