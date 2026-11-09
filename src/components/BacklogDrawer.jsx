import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { playSound } from '../utils/sound';

export default function BacklogDrawer({
  isOpen,
  onClose,
  backlog = [],
  currentStory,
  onSelectStory,
  onAddStory
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const totalPoints = backlog.reduce((sum, s) => sum + (Number(s.estimate) || 0), 0);
  const estimatedCount = backlog.filter(s => s.status === 'estimated').length;

  const handleCreateStory = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const generatedKey = newKey.trim() || `STORY-${backlog.length + 101}`;
    const newStory = {
      id: `story-${Date.now()}`,
      key: generatedKey.toUpperCase(),
      title: newTitle.trim(),
      description: newDescription.trim() || 'No description provided.',
      acceptanceCriteria: ['Pass automated unit and e2e acceptance tests.'],
      estimate: null,
      status: 'pending'
    };

    playSound('pop');
    onAddStory(newStory);
    setNewKey('');
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  // Export Backlog as Jira CSV
  const handleExportJiraCSV = () => {
    playSound('pop');
    const headers = ['Issue Key', 'Summary', 'Description', 'Story Points', 'Status'];
    const rows = backlog.map(s => [
      `"${s.key}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${(s.description || '').replace(/"/g, '""')}"`,
      s.estimate !== null ? s.estimate : '',
      `"${s.status === 'estimated' ? 'Estimated' : 'Ready'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sprint-Estimation-Backlog-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Markdown Table for Confluence / Slack / GitHub
  const handleCopyMarkdown = () => {
    playSound('pop');
    let md = `| Key | Summary | Story Points | Status |\n|---|---|---|---|\n`;
    backlog.forEach(s => {
      md += `| **${s.key}** | ${s.title} | ${s.estimate !== null ? s.estimate : '—'} | ${s.status === 'estimated' ? '✅ Estimated' : '⏳ Ready'} |\n`;
    });
    md += `\n**Total Estimated Velocity:** ${totalPoints} Story Points\n`;

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      {/* Slide-over Content Drawer */}
      <aside className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col z-10 animate-slideInRight">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Sprint Backlog</h2>
              <p className="text-xs text-slate-400">
                {estimatedCount} of {backlog.length} estimated • <strong className="text-emerald-400">{totalPoints} pts</strong> total
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {backlog.map((story) => {
            const isActive = currentStory?.id === story.id;
            const isEstimated = story.status === 'estimated';

            return (
              <div
                key={story.id}
                onClick={() => {
                  playSound('pop');
                  onSelectStory(story);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 border-indigo-500/50 ring-2 ring-indigo-500/20 shadow-lg'
                    : 'bg-slate-800/60 border-white/5 hover:border-white/15 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    {story.key}
                  </span>
                  {isEstimated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle2 size={11} /> {story.estimate} pts
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 text-[10px] font-bold flex items-center gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {story.title}
                </h4>

                {story.description && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {story.description}
                  </p>
                )}

                {isActive && (
                  <div className="mt-2 pt-2 border-t border-indigo-500/20 flex items-center justify-between text-[10px] font-bold text-indigo-300">
                    <span>Active on Poker Table</span>
                    <span>🎲 Sizing now</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Add Story Section */}
          {showAddForm ? (
            <form onSubmit={handleCreateStory} className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2 mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Add Story to Backlog</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                placeholder="Story Key (e.g. CORE-101)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                placeholder="Story Title *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <textarea
                placeholder="Description & Acceptance Criteria..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md"
              >
                Add Story
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                playSound('pop');
                setShowAddForm(true);
              }}
              className="w-full py-3 rounded-2xl border border-dashed border-white/20 hover:border-indigo-400/50 text-slate-400 hover:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all mt-3"
            >
              <Plus size={14} /> Add User Story
            </button>
          )}
        </div>

        {/* Footer Actions: Jira CSV & Markdown Export */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJiraCSV}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              title="Download RFC 4180 Jira-compatible CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Jira CSV</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              title="Copy formatted Markdown table"
            >
              {copiedMd ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-indigo-400" />}
              <span>{copiedMd ? 'Copied!' : 'Copy MD'}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
