'use client';
import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BrainCircuit,
  HelpCircle
} from 'lucide-react';

interface ConceptNode {
  id: string;
  name: string;
  category: string;
  mastery: number; // 0.00 to 1.00
  confidence: number;
  status: 'MASTERED' | 'PROFICIENT' | 'DEVELOPING' | 'AT RISK' | 'FOUNDATIONAL GAP';
  prerequisites: string[];
  misconceptions: string[];
  summary: string;
}

const CONCEPT_GRAPH: ConceptNode[] = [
  {
    id: 'c1',
    name: 'Equivalent Fractions',
    category: 'Math Foundations',
    mastery: 0.94,
    confidence: 0.95,
    status: 'MASTERED',
    prerequisites: [],
    misconceptions: [],
    summary: 'Recognizing proportional fractions by multiplying or dividing numerator and denominator by common factors.'
  },
  {
    id: 'c2',
    name: 'Fraction Simplification',
    category: 'Math Foundations',
    mastery: 0.88,
    confidence: 0.90,
    status: 'PROFICIENT',
    prerequisites: ['c1'],
    misconceptions: [],
    summary: 'Using greatest common divisors (GCD) to reduce fractions to irreducible forms.'
  },
  {
    id: 'c3',
    name: 'Common Denominators',
    category: 'Math Foundations',
    mastery: 0.85,
    confidence: 0.88,
    status: 'PROFICIENT',
    prerequisites: ['c1'],
    misconceptions: [],
    summary: 'Finding the Least Common Multiple (LCM) to align denominators for arithmetic operations.'
  },
  {
    id: 'c4',
    name: 'Fraction Addition & Subtraction',
    category: 'Math Foundations',
    mastery: 0.61,
    confidence: 0.70,
    status: 'DEVELOPING',
    prerequisites: ['c2', 'c3'],
    misconceptions: ['Fractions added component-wise: student adds numerators and denominators directly.'],
    summary: 'Combining rational terms with common denominators while preserving dimensional units.'
  },
  {
    id: 'c5',
    name: 'Fraction Multiplication & Division',
    category: 'Math Foundations',
    mastery: 0.42,
    confidence: 0.50,
    status: 'AT RISK',
    prerequisites: ['c4'],
    misconceptions: ['Cross-multiplication inverted during division.'],
    summary: 'Multiplying across terms and inverting divisor for reciprocal quotient computation.'
  },
  {
    id: 'c6',
    name: 'Rational Equations & Word Problems',
    category: 'Math Foundations',
    mastery: 0.25,
    confidence: 0.35,
    status: 'FOUNDATIONAL GAP',
    prerequisites: ['c5'],
    misconceptions: ['Extraneous roots overlooked when clearing denominators.'],
    summary: 'Transfer learning: framing real-world rate and ratio scenarios into rational mathematical models.'
  }
];

export default function KnowledgeProfileView({
  onLaunchRemediation
}: {
  onLaunchRemediation: (conceptId: string) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<ConceptNode>(CONCEPT_GRAPH[3]);

  const getStatusColor = (status: ConceptNode['status']) => {
    switch (status) {
      case 'MASTERED': return 'border-emerald-500 bg-emerald-950/40 text-emerald-300';
      case 'PROFICIENT': return 'border-cyan-500 bg-cyan-950/40 text-cyan-300';
      case 'DEVELOPING': return 'border-amber-500 bg-amber-950/40 text-amber-300';
      case 'AT RISK': return 'border-orange-500 bg-orange-950/40 text-orange-300';
      case 'FOUNDATIONAL GAP': return 'border-rose-500 bg-rose-950/40 text-rose-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bayesian Dependency Graph</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Student Knowledge Model (SKM)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Concepts exist in a probabilistic directed acyclic graph. Downstream mastery requires solid foundation in parent prerequisites.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Mastered (≥90%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Developing (50-69%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Gap (&lt;30%)</span>
          </div>
        </div>
      </div>

      {/* Main Graph Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Concept Tree Column */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Curriculum Dependency Path
          </h2>

          <div className="space-y-3">
            {CONCEPT_GRAPH.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              const hasPrereq = node.prerequisites.length > 0;

              return (
                <div key={node.id} className="relative">
                  {/* Prerequisite connector line */}
                  {index > 0 && (
                    <div className="absolute -top-3 left-6 w-0.5 h-3 bg-slate-700 pointer-events-none" />
                  )}

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-500/10' 
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${getStatusColor(node.status)}`}>
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{node.name}</span>
                          {node.misconceptions.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Misconception Detected" />
                          )}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>P(Mastery): <b className="text-slate-200">{Math.round(node.mastery * 100)}%</b></span>
                          <span>•</span>
                          <span>Confidence: <b className="text-slate-200">{Math.round(node.confidence * 100)}%</b></span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getStatusColor(node.status)}`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Concept Diagnostic Inspector */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  Concept Inspector
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getStatusColor(selectedNode.status)}`}>
                  {selectedNode.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Mastery Prob</span>
                <p className="text-base font-bold text-indigo-400 mt-0.5">
                  {(selectedNode.mastery * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Model Confidence</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {(selectedNode.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Misconceptions Alert */}
            {selectedNode.misconceptions.length > 0 ? (
              <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Detected Misconception</span>
                </div>
                {selectedNode.misconceptions.map((m, i) => (
                  <p key={i} className="text-xs text-rose-200/90 leading-normal pl-5">
                    "{m}"
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No active misconceptions recorded for this node.</span>
              </div>
            )}

            {/* Remediation Action */}
            <button
              onClick={() => onLaunchRemediation(selectedNode.id)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Target Remediation Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
