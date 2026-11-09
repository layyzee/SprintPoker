import React, { useState } from 'react';
import { X, Check, User, Crown } from 'lucide-react';
import { PRESET_TEAMMATES } from '../constants/decks';
import { playSound } from '../utils/sound';

export default function UserJoinModal({
  isOpen,
  onClose,
  currentUser,
  onSaveUser
}) {
  const [name, setName] = useState(currentUser?.name || 'Bala Palani');
  const [role, setRole] = useState(currentUser?.role || 'Scrum Master');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '👑');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    playSound('pop');
    setName(preset.name);
    setRole(preset.role);
    setAvatar(preset.avatar);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound('pop');
    const updated = {
      id: currentUser?.id || `user-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Engineer',
      avatar: avatar || '👤'
    };

    onSaveUser(updated);
    onClose();
  };

  const AVATAR_OPTIONS = ['👑', '💻', '⚡', '🧪', '🎯', '🎨', '🚀', '🔥', '🛡️', '🧠'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Your Poker Persona</h3>
              <p className="text-xs text-slate-400">Choose how teammates see you at the table</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Persona Presets */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quick Persona Select
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_TEAMMATES.map((preset) => {
              const isSelected = name === preset.name;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 ring-2 ring-indigo-500/20 text-white'
                      : 'bg-slate-800/60 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <span className="text-xl">{preset.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{preset.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Bala Palani"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Scrum Master / Tech Lead"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Avatar Emoji
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {AVATAR_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setAvatar(em);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                    avatar === em
                      ? 'bg-indigo-600 text-white scale-110 shadow-md ring-2 ring-indigo-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all"
            >
              Save & Join Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
