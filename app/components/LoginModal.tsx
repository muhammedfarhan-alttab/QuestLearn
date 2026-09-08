'use client';
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface UserProfile {
  username: string;
  email: string;
  division: string;
  rank: string;
  level: number;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUser: UserProfile = {
      username: username || (mode === 'login' ? 'Kurosaki_Ichigo' : 'New_Scholar'),
      email: email || 'scholar@seireitei.edu',
      division: 'Squad 13 // Karakura Defender',
      rank: 'Substitute Shinigami Scholar',
      level: currentUser?.level || 4
    };
    onLoginSuccess(finalUser);
    onClose();
  };

  const handleQuickDemo = () => {
    onLoginSuccess({
      username: 'DemonSlayer_99',
      email: 'student@questlearn.ai',
      division: 'Squad 11 // Zaraki Division',
      rank: 'High-Reiatsu Scholar',
      level: 5
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none font-mono">
      <div className="relative w-full max-w-md bg-[#090d16] border-2 border-amber-500/80 rounded-2xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.3)] text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              {mode === 'login' ? 'Seireitei Archives Login' : 'Register New Shinigami'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Synchronize your cognitive state and BKT progress
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition text-center cursor-pointer ${
              mode === 'login' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition text-center cursor-pointer ${
              mode === 'register' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
              Username / Codename
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Ichigo_Kurosaki"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@questlearn.ai"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
              Secret Reiatsu Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <span>{mode === 'login' ? 'Authorize Access' : 'Create Shinigami Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Entry */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            onClick={handleQuickDemo}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Scholar Login</span>
          </button>
        </div>

      </div>
    </div>
  );
}
