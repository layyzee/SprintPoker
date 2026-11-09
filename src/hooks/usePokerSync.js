import { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_BACKLOG, PRESET_TEAMMATES } from '../constants/decks';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export function usePokerSync({ roomId = 'sprint-demo', currentUser }) {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [deckType, setDeckType] = useState('fibonacci');
  const [currentStory, setCurrentStory] = useState(SAMPLE_BACKLOG[0]);
  const [backlog, setBacklog] = useState(SAMPLE_BACKLOG);
  const [areCardsRevealed, setAreCardsRevealed] = useState(false);
  const [participants, setParticipants] = useState(() => {
    // In demo or local mode, pre-load realistic teammates
    return PRESET_TEAMMATES.map(p => ({
      ...p,
      hasVoted: true,
      vote: p.vote
    }));
  });
  const [userVote, setUserVote] = useState(null);
  const [votesSummary, setVotesSummary] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Compute summary stats locally if in simulated mode
  const updateLocalStats = useCallback((teamList) => {
    const validVotes = teamList.map(t => t.vote).filter(v => v !== null && v !== undefined && v !== '☕' && v !== '❓');
    if (validVotes.length === 0) {
      setVotesSummary(null);
      return;
    }

    const numeric = validVotes.map(Number).filter(n => !isNaN(n));
    if (numeric.length > 0) {
      const sum = numeric.reduce((a, b) => a + b, 0);
      const avg = +(sum / numeric.length).toFixed(1);
      const min = Math.min(...numeric);
      const max = Math.max(...numeric);
      setVotesSummary({
        average: avg,
        min,
        max,
        consensus: min === max,
        totalVotes: validVotes.length
      });
    } else {
      const unique = new Set(validVotes);
      setVotesSummary({
        average: null,
        min: null,
        max: null,
        consensus: unique.size === 1,
        totalVotes: validVotes.length
      });
    }
  }, []);

  // WebSocket Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const isProd = import.meta.env?.PROD || window.location.port === '5179' || window.location.port === '';
    const wsUrl = isProd
      ? `${protocol}//${window.location.host}`
      : `${protocol}//${host}:5179`;

    let socket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;
    } catch (e) {
      setConnectionStatus('simulated');
      return;
    }

    socket.onopen = () => {
      setConnectionStatus('connected');
      socket.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomId,
        payload: { user: currentUser }
      }));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'ROOM_STATE_SYNC') {
          const { payload } = msg;
          if (payload.deckType) setDeckType(payload.deckType);
          if (payload.currentStory) setCurrentStory(payload.currentStory);
          if (payload.backlog) setBacklog(payload.backlog);
          if (payload.areCardsRevealed !== undefined) setAreCardsRevealed(payload.areCardsRevealed);
          if (payload.participants) {
            setParticipants(payload.participants);
            const me = payload.participants.find(p => p.id === currentUser?.id);
            if (me) setUserVote(me.vote);
          }
          if (payload.votesSummary) setVotesSummary(payload.votesSummary);
        }
      } catch (err) {
        console.error('Error parsing sync message:', err);
      }
    };

    socket.onerror = () => {
      setConnectionStatus('simulated');
    };

    socket.onclose = () => {
      setConnectionStatus('simulated');
    };

    return () => {
      if (socket) socket.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [roomId, currentUser]);

  // Actions
  const submitVote = useCallback((card) => {
    playSound('card_place');
    setUserVote(card);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'SUBMIT_VOTE',
        roomId,
        payload: { card }
      }));
    } else {
      // Local / Simulated mode
      setParticipants(prev => prev.map(p => {
        if (p.id === currentUser?.id) {
          return { ...p, hasVoted: true, vote: card };
        }
        return p;
      }));
    }
  }, [roomId, currentUser]);

  const clearVote = useCallback(() => {
    playSound('pop');
    setUserVote(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CLEAR_VOTE',
        roomId,
        payload: {}
      }));
    } else {
      setParticipants(prev => prev.map(p => {
        if (p.id === currentUser?.id) {
          return { ...p, hasVoted: false, vote: null };
        }
        return p;
      }));
    }
  }, [roomId, currentUser]);

  const revealCards = useCallback(() => {
    playSound('reveal');
    setAreCardsRevealed(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'REVEAL_CARDS',
        roomId,
        payload: {}
      }));
    } else {
      updateLocalStats(participants);
      // Trigger confetti if consensus
      const votes = participants.map(p => p.vote).filter(Boolean);
      const isConsensus = votes.length > 0 && votes.every(v => v === votes[0]);
      if (isConsensus) {
        playSound('consensus');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } else {
        playSound('divergence');
      }
    }
  }, [roomId, participants, updateLocalStats]);

  const resetRound = useCallback(() => {
    playSound('pop');
    setAreCardsRevealed(false);
    setUserVote(null);
    setVotesSummary(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'RESET_ROUND',
        roomId,
        payload: {}
      }));
    } else {
      setParticipants(prev => prev.map(p => ({
        ...p,
        hasVoted: false,
        vote: null
      })));
    }
  }, [roomId]);

  const acceptEstimate = useCallback((finalEstimate) => {
    playSound('consensus');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'ACCEPT_ESTIMATE',
        roomId,
        payload: { estimate: finalEstimate }
      }));
    } else {
      // Local update
      setBacklog(prev => {
        const next = prev.map(s => s.id === currentStory.id ? { ...s, estimate: finalEstimate, status: 'estimated' } : s);
        const unestimated = next.find(s => s.status !== 'estimated' && s.id !== currentStory.id);
        if (unestimated) {
          unestimated.status = 'estimating';
          setCurrentStory({ ...unestimated });
        }
        return next;
      });
      resetRound();
    }
  }, [roomId, currentStory, resetRound]);

  const selectStory = useCallback((story) => {
    playSound('pop');
    setCurrentStory(story);
    resetRound();

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'SET_STORY',
        roomId,
        payload: { story }
      }));
    }
  }, [roomId, resetRound]);

  const addStory = useCallback((story) => {
    playSound('pop');
    setBacklog(prev => [...prev, story]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'ADD_STORY',
        roomId,
        payload: { story }
      }));
    }
  }, [roomId]);

  // Simulate diverse team votes for recruiter demo testing
  const simulateTeamVotes = useCallback((targetConsensus = false) => {
    playSound('card_place');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'SIMULATE_VOTES',
        roomId,
        payload: { consensus: targetConsensus }
      }));
    } else {
      const mockValues = targetConsensus ? ['5', '5', '5', '5', '5'] : ['3', '5', '5', '8', '5'];
      setParticipants(prev => prev.map((p, idx) => ({
        ...p,
        hasVoted: true,
        vote: mockValues[idx % mockValues.length]
      })));
    }
  }, [roomId]);

  return {
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
  };
}
