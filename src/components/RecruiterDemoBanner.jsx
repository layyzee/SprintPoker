import React from 'react';
import { Sparkles, Dices, Award, Eye, RotateCcw } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function RecruiterDemoBanner({
  onSimulateDivergence,
  onSimulateConsensus,
  onRevealCards,
  onResetRound,
  areCardsRevealed
}) {
  return (
    <div className="w-full bg-slate-900/95 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between z-20 shrink-0 backdrop-blur-md">
      {/* Left Badge */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-500/30">
          <Sparkles size={11} className="text-amber-400" /> Recruiter Sandbox
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Test live planning poker in 1 click
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            playSound('pop');
            onSimulateDivergence();
          }}
          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-1"
          title="Fill table with divergent votes to test discussion prompt"
        >
          <Dices size={13} className="text-indigo-400" />
          <span className="hidden sm:inline">Simulate</span> Split Votes
        </button>

        <button
          onClick={() => {
            playSound('pop');
            onSimulateConsensus();
          }}
          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-1"
          title="Fill table with unanimous votes to test consensus celebration"
        >
          <Award size={13} className="text-emerald-400" />
          <span className="hidden sm:inline">Simulate</span> Consensus
        </button>

        {!areCardsRevealed ? (
          <button
            onClick={() => {
              playSound('reveal');
              onRevealCards();
            }}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow-sm"
          >
            <Eye size={13} />
            <span>Reveal</span>
          </button>
        ) : (
          <button
            onClick={() => {
              playSound('pop');
              onResetRound();
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 transition-colors flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
