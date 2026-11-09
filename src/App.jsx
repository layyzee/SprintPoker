import React, { useState, useEffect } from 'react';
import { usePokerSync } from './hooks/usePokerSync';
import PokerNavbar from './components/PokerNavbar';
import PokerTable from './components/PokerTable';
import CardDeckSelector from './components/CardDeckSelector';
import BacklogDrawer from './components/BacklogDrawer';
import UserJoinModal from './components/UserJoinModal';
import RecruiterDemoBanner from './components/RecruiterDemoBanner';

export default function App() {
  // Extract roomId from URL or default
  const [roomId, setRoomId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || 'sprint-demo';
  });

  // Current user persona with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sprintpoker_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      id: 'bala-lead',
      name: 'Bala Palani',
      role: 'Senior Scrum Master',
      avatar: '👑'
    };
  });

  const handleSaveUser = (updated) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('sprintpoker_user', JSON.stringify(updated));
    } catch (e) {}
  };

  // Drawer & modal states
  const [isBacklogOpen, setIsBacklogOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showRecruiterBanner, setShowRecruiterBanner] = useState(true);

  // Sync state & actions
  const {
    connectionStatus,
    deckType,
    setDeckType,
    currentStory,
    backlog,
    participants,
    userVote,
    areCardsRevealed,
    votesSummary,
    submitVote,
    clearVote,
    revealCards,
    resetRound,
    acceptEstimate,
    selectStory,
    addStory,
    simulateTeamVotes
  } = usePokerSync({ roomId, currentUser });

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* Top Navigation Bar */}
      <PokerNavbar
        roomId={roomId}
        deckType={deckType}
        onSelectDeck={setDeckType}
        connectionStatus={connectionStatus}
        participantsCount={participants.length}
        onOpenBacklog={() => setIsBacklogOpen(true)}
        backlogCount={backlog.length}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        currentUser={currentUser}
        onResetRound={resetRound}
        onSimulateVotes={() => simulateTeamVotes(false)}
      />

      {/* Recruiter 1-Click Interactive Test Banner */}
      {showRecruiterBanner && (
        <RecruiterDemoBanner
          onSimulateDivergence={() => simulateTeamVotes(false)}
          onSimulateConsensus={() => simulateTeamVotes(true)}
          onRevealCards={revealCards}
          onResetRound={resetRound}
          areCardsRevealed={areCardsRevealed}
        />
      )}

      {/* Center Gaming Canvas: Felt Poker Table */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <PokerTable
          currentStory={currentStory}
          participants={participants}
          areCardsRevealed={areCardsRevealed}
          votesSummary={votesSummary}
          onRevealCards={revealCards}
          onResetRound={resetRound}
          onAcceptEstimate={acceptEstimate}
          currentUser={currentUser}
          onSimulateVotes={() => simulateTeamVotes(false)}
        />
      </main>

      {/* Bottom Card Deck Hand Dock */}
      <CardDeckSelector
        deckType={deckType}
        selectedVote={userVote}
        onSelectCard={submitVote}
        onClearVote={clearVote}
        disabled={areCardsRevealed}
      />

      {/* Right Slide-over Backlog Queue Drawer */}
      <BacklogDrawer
        isOpen={isBacklogOpen}
        onClose={() => setIsBacklogOpen(false)}
        backlog={backlog}
        currentStory={currentStory}
        onSelectStory={(story) => {
          selectStory(story);
          setIsBacklogOpen(false);
        }}
        onAddStory={addStory}
      />

      {/* Teammate Persona Picker Modal */}
      <UserJoinModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveUser}
      />
    </div>
  );
}
