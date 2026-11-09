import React, { useState } from 'react';
import { 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { playSound } from '../utils/sound';

export default function PokerTable({
  currentStory,
  participants,
  areCardsRevealed,
  votesSummary,
  onRevealCards,
  onResetRound,
  onAcceptEstimate,
  currentUser,
  onSimulateVotes
}) {
  const [showCriteria, setShowCriteria] = useState(false);

  // Split participants around the table
  const total = participants.length;
  const votedCount = participants.filter(p => p.hasVoted).length;
  const allVoted = votedCount > 0 && votedCount === total;

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-[600px] h-[350px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Oval Poker Table */}
      <div className="w-full max-w-5xl min-h-[460px] rounded-[60px] sm:rounded-[100px] bg-gradient-to-b from-[#0c2f24] to-[#071d16] border-[10px] sm:border-[14px] border-[#164e3b] shadow-[0_0_50px_rgba(5,150,105,0.25),inset_0_0_80px_rgba(0,0,0,0.8)] relative flex items-center justify-center p-6 my-6">
        
        {/* Inner Table Felt Border Line */}
        <div className="absolute inset-3 sm:inset-4 rounded-[45px] sm:rounded-[80px] border border-emerald-500/20 pointer-events-none" />

        {/* Teammates Sitting Around Table */}
        <div className="absolute inset-0 pointer-events-none">
          {participants.map((player, index) => {
            // Position around oval using trigonometry
            const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
            // Radius percentage
            const rx = 43; // percent horizontal
            const ry = 39; // percent vertical
            const left = 50 + rx * Math.cos(angle);
            const top = 50 + ry * Math.sin(angle);

            const isMe = player.id === currentUser?.id;

            return (
              <div
                key={player.id}
                style={{ left: `${left}%`, top: `${top}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-1.5 z-20 group transition-all"
              >
                {/* Playing Card */}
                <div className="transition-transform group-hover:scale-110">
                  {!player.hasVoted ? (
                    // Not Voted State
                    <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-xs flex items-center justify-center text-slate-500 text-xs shadow-inner">
                      <span className="text-xs opacity-60">🤔</span>
                    </div>
                  ) : !areCardsRevealed ? (
                    // Face-Down Card (Voted)
                    <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 border border-indigo-400/50 shadow-lg shadow-indigo-900/50 flex items-center justify-center relative overflow-hidden animate-pop">
                      <div className="absolute inset-1 rounded-lg border border-indigo-300/30 flex items-center justify-center">
                        <span className="text-xs font-mono text-indigo-200/80 font-bold">🂠</span>
                      </div>
                    </div>
                  ) : (
                    // Face-Up Card (Revealed)
                    <div className="w-11 h-16 sm:w-14 sm:h-20 rounded-xl bg-gradient-to-b from-white to-slate-100 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-slate-900 font-extrabold animate-pop">
                      <span className="text-lg sm:text-2xl font-mono text-slate-900 leading-none">
                        {player.vote}
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans font-bold mt-0.5">pts</span>
                    </div>
                  )}
                </div>

                {/* Player Tag */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold shadow-md truncate max-w-[120px]">
                  <span>{player.avatar}</span>
                  <span className="truncate">{player.name}</span>
                  {isMe && <span className="text-[9px] text-indigo-400 font-bold">(You)</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Table Island: Active Story & Action Hub */}
        <div className="z-10 max-w-lg w-full bg-slate-950/85 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
          
          {/* Active Story Card */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                {currentStory?.key || 'STORY-1'}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {currentStory?.status === 'estimated' ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 size={12} /> Estimated ({currentStory.estimate} pts)
                  </span>
                ) : (
                  'Ready for Sizing'
                )}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white text-left tracking-tight">
              {currentStory?.title || 'User Story Title'}
            </h3>

            {currentStory?.description && (
              <p className="text-xs text-slate-300 text-left mt-1 line-clamp-2">
                {currentStory.description}
              </p>
            )}

            {/* Collapsible Acceptance Criteria */}
            {currentStory?.acceptanceCriteria && currentStory.acceptanceCriteria.length > 0 && (
              <div className="mt-2 text-left">
                <button
                  onClick={() => setShowCriteria(!showCriteria)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Acceptance Criteria ({currentStory.acceptanceCriteria.length})</span>
                  {showCriteria ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {showCriteria && (
                  <ul className="mt-1.5 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] text-slate-300">
                    {currentStory.acceptanceCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="w-full border-t border-white/10" />

          {/* Action Center */}
          <div className="w-full flex flex-col items-center">
            {!areCardsRevealed ? (
              // Phase: Voting in Progress
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>
                    {votedCount} of {total} Teammates Voted
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full justify-center">
                  <button
                    onClick={onRevealCards}
                    disabled={votedCount === 0}
                    className="flex-1 max-w-xs py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Eye size={16} />
                    <span>Reveal Cards 👁️</span>
                  </button>
                </div>
              </div>
            ) : (
              // Phase: Cards Revealed & Discussion
              <div className="w-full flex flex-col items-center space-y-3 animate-fadeIn">
                {/* Consensus Banner */}
                {votesSummary && (
                  <div className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left ${
                    votesSummary.consensus
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        {votesSummary.consensus ? (
                          <>
                            <Sparkles size={16} className="text-emerald-400" />
                            <span>Consensus Reached! ({votesSummary.average} pts)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={16} className="text-amber-400" />
                            <span>Divergent Estimates: Discuss!</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] opacity-80 mt-0.5">
                        {votesSummary.average !== null ? (
                          <>Average: <strong>{votesSummary.average}</strong> | Min: <strong>{votesSummary.min}</strong> | Max: <strong>{votesSummary.max}</strong></>
                        ) : (
                          <>Review individual T-Shirt cards above.</>
                        )}
                      </div>
                    </div>

                    <div className="text-2xl">
                      {votesSummary.consensus ? '🏆' : '💬'}
                    </div>
                  </div>
                )}

                {/* Final Decision Action Buttons */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => onAcceptEstimate(votesSummary?.average ? Math.round(votesSummary.average) : 5)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    <span>Accept {votesSummary?.average ? Math.round(votesSummary.average) : '5'} & Next Story</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={onResetRound}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition-colors"
                    title="Re-estimate this story"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
