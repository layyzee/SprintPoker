import React from 'react';
import { DECKS } from '../constants/decks';
import { playSound } from '../utils/sound';
import { X, Sparkles } from 'lucide-react';

export default function CardDeckSelector({
  deckType,
  selectedVote,
  onSelectCard,
  onClearVote,
  disabled
}) {
  const activeDeck = DECKS[deckType] || DECKS.fibonacci;
  const cards = activeDeck.cards;

  const handleCardClick = (card) => {
    if (disabled) return;
    if (selectedVote === card) {
      playSound('pop');
      onClearVote();
    } else {
      playSound('card_select');
      onSelectCard(card);
    }
  };

  return (
    <footer className="w-full shrink-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.08] px-4 py-3 z-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">
        
        {/* Header Indicator */}
        <div className="flex items-center justify-between w-full max-w-2xl px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Your Hand:</span>
            {selectedVote ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles size={12} />
                Selected: <strong className="text-white font-mono text-sm">{selectedVote}</strong>
              </span>
            ) : (
              <span className="text-slate-500 italic">Select a card to place your vote face-down</span>
            )}
          </div>

          {selectedVote && (
            <button
              onClick={() => {
                playSound('pop');
                onClearVote();
              }}
              className="text-[11px] text-slate-400 hover:text-rose-400 font-bold flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Clear Vote
            </button>
          )}
        </div>

        {/* Scrollable Card Hand */}
        <div className="w-full overflow-x-auto pb-1 pt-2 flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 scrollbar-thin">
          {cards.map((card) => {
            const isSelected = selectedVote === card;

            return (
              <button
                key={card}
                onClick={() => handleCardClick(card)}
                disabled={disabled}
                className={`group relative flex flex-col items-center justify-center shrink-0 rounded-2xl transition-all duration-200 select-none ${
                  isSelected
                    ? '-translate-y-3 scale-110 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 text-slate-950 font-black shadow-[0_12px_28px_rgba(245,158,11,0.4)] border-2 border-white ring-4 ring-amber-400/30'
                    : 'bg-gradient-to-b from-slate-800 to-slate-900/90 text-slate-200 border border-white/10 hover:border-amber-400/50 hover:bg-slate-750 hover:-translate-y-1.5 shadow-md shadow-black/40'
                } w-12 h-16 sm:w-14 sm:h-20 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {/* Top Corner Pip */}
                <span className={`absolute top-1 left-1.5 text-[9px] font-mono font-bold leading-none ${
                  isSelected ? 'text-slate-900/70' : 'text-slate-400'
                }`}>
                  {card}
                </span>

                {/* Center Value */}
                <span className={`text-base sm:text-xl font-mono font-black ${
                  isSelected ? 'text-slate-950' : 'text-white group-hover:text-amber-300'
                }`}>
                  {card}
                </span>

                {/* Bottom Corner Pip */}
                <span className={`absolute bottom-1 right-1.5 text-[9px] font-mono font-bold leading-none rotate-180 ${
                  isSelected ? 'text-slate-900/70' : 'text-slate-400'
                }`}>
                  {card}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
