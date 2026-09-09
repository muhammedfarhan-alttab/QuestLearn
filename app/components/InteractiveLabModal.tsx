'use client';
import React, { useEffect } from 'react';
import { X, FlaskConical } from 'lucide-react';
import InteractiveLabView from './InteractiveLabView';

interface InteractiveLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialStageNumber?: number;
  onRewardXp?: (amount: number) => void;
  onRewardGeo?: (amount: number) => void;
  onOpenLectureNotes?: (courseId: string, stageNumber: number) => void;
}

export default function InteractiveLabModal({
  isOpen,
  onClose,
  initialCourseId = 'course-mechanics',
  initialStageNumber = 1,
  onRewardXp,
  onRewardGeo,
  onOpenLectureNotes
}: InteractiveLabModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#090d16] border border-slate-700/80 rounded-3xl shadow-2xl overflow-y-auto flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-black text-white tracking-wider">QUESTLEARN LAB</span>
              <span className="text-[10px] text-cyan-400 ml-2">Interactive STEM Simulator</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close Lab (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-2 sm:p-4">
          <InteractiveLabView
            key={`${initialCourseId}_${initialStageNumber}`}
            initialCourseId={initialCourseId}
            initialStageNumber={initialStageNumber}
            onRewardXp={onRewardXp}
            onRewardGeo={onRewardGeo}
            onOpenLectureNotes={(cId, sNum) => {
              onClose();
              if (onOpenLectureNotes) onOpenLectureNotes(cId, sNum);
            }}
          />
        </div>
      </div>
    </div>
  );
}
