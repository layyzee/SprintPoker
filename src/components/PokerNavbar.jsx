import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Layers, 
  ListOrdered, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Share2, 
  Users,
  RotateCcw
} from 'lucide-react';
import { DECKS } from '../constants/decks';
import { playSound } from '../utils/sound';

export default function PokerNavbar({
  roomId,
  deckType,
  onSelectDeck,
  connectionStatus,
  participantsCount,
  onOpenBacklog,
  backlogCount,
  onOpenUserModal,
  currentUser,
  onResetRound,
  onSimulateVotes
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeckMenu, setShowDeckMenu] = useState(false);

  const handleCopyLink = () => {
    playSound('pop');
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeDeck = DECKS[deckType] || DECKS.fibonacci;

  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between shrink-0 z-30">
      {/* Left Brand & Room Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 select-none">
          🃏
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white">SprintPoker</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{roomId}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Real-Time Agile Story Point Estimation
          </p>
        </div>
      </div>

      {/* Center Deck Selector & Quick Reset */}
      <div className="flex items-center gap-2">
        {/* Deck Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDeckMenu(!showDeckMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
            title="Change card deck"
          >
            <Layers size={13} className="text-indigo-400" />
            <span className="truncate max-w-[120px]">{activeDeck.name}</span>
          </button>

          {showDeckMenu && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-fadeIn">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Card Deck
              </div>
              {Object.values(DECKS).map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    playSound('pop');
                    onSelectDeck(d.id);
                    setShowDeckMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl transition-all ${
                    d.id === deckType
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{d.name}</div>
                  <div className="text-[10px] opacity-70 truncate">{d.cards.join(', ')}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear / Reset Round */}
        <button
          onClick={onResetRound}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
          title="Reset votes for current story"
        >
          <RotateCcw size={13} />
          <span className="hidden md:inline">Reset Round</span>
        </button>
      </div>

      {/* Right Action Tools: Backlog Drawer, Share, User Profile */}
      <div className="flex items-center gap-2">
        {/* Backlog Drawer Trigger */}
        <button
          onClick={onOpenBacklog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all shadow-xs"
          title="Open Sprint Backlog queue"
        >
          <ListOrdered size={14} className="text-indigo-400" />
          <span className="hidden sm:inline">Backlog</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold">
            {backlogCount}
          </span>
        </button>

        {/* Share Room Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-600/25"
          title="Copy room invite link"
        >
          {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
          <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Invite'}</span>
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenUserModal}
          className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
          title={`Signed in as: ${currentUser?.name || 'Teammate'} (Click to change)`}
        >
          <span className="text-sm">{currentUser?.avatar || '👑'}</span>
          <span className="hidden lg:inline truncate max-w-[80px]">{currentUser?.name || 'Teammate'}</span>
        </button>
      </div>
    </header>
  );
}
