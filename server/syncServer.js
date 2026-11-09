// SprintPoker Real-Time WebSocket Synchronization Server
// High-performance, zero-cost multiplayer planning poker relay

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_BACKLOG, DECKS } from '../src/constants/decks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const PORT = process.env.PORT || process.env.WS_PORT || 5179;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// In-Memory Room Store
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    const isDemo = roomId === 'sprint-demo' || roomId.includes('demo');
    const simulatedTeammates = isDemo ? [
      { id: 'usr-sarah', name: 'Sarah (DevOps)', role: 'DevOps Lead', avatar: '💻', color: '#6366f1' },
      { id: 'usr-alex', name: 'Alex (Backend)', role: 'Architect', avatar: '⚡', color: '#10b981' },
      { id: 'usr-jordan', name: 'Jordan (Design)', role: 'UI/UX', avatar: '🎨', color: '#f43f5e' },
      { id: 'usr-priya', name: 'Priya (QA)', role: 'QA Lead', avatar: '🔍', color: '#a855f7' }
    ] : [];

    const initialVotes = isDemo ? {
      'usr-sarah': '5',
      'usr-alex': '5',
      'usr-jordan': '5',
      'usr-priya': '5'
    } : {};

    rooms.set(roomId, {
      id: roomId,
      deckType: 'fibonacci',
      currentStory: JSON.parse(JSON.stringify(SAMPLE_BACKLOG[0])),
      backlog: JSON.parse(JSON.stringify(SAMPLE_BACKLOG)),
      votes: initialVotes,
      areCardsRevealed: false,
      timerSeconds: 120,
      isTimerRunning: false,
      timerInterval: null,
      simulatedTeammates,
      clients: new Map() // ws -> User
    });
  }
  return rooms.get(roomId);
}

function broadcastToRoom(roomId, message, senderWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = JSON.stringify(message);
  for (const [clientWs] of room.clients.entries()) {
    if (clientWs !== senderWs && clientWs.readyState === WebSocket.OPEN) {
      try {
        clientWs.send(data);
      } catch (err) {
        console.error('Error broadcasting to client:', err.message);
      }
    }
  }
}

function broadcastFullState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const clientParticipants = Array.from(room.clients.values()).map(user => ({
    id: user.id,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    color: user.color,
    isFacilitator: user.isFacilitator,
    hasVoted: !!room.votes[user.id],
    vote: room.areCardsRevealed ? (room.votes[user.id] || null) : null
  }));

  const simulatedParticipants = (room.simulatedTeammates || []).map(bot => ({
    ...bot,
    hasVoted: !!room.votes[bot.id],
    vote: room.areCardsRevealed ? (room.votes[bot.id] || null) : null
  }));

  const participants = [...clientParticipants, ...simulatedParticipants];

  const payload = {
    type: 'ROOM_STATE_SYNC',
    payload: {
      roomId: room.id,
      deckType: room.deckType,
      currentStory: room.currentStory,
      backlog: room.backlog,
      areCardsRevealed: room.areCardsRevealed,
      timerSeconds: room.timerSeconds,
      isTimerRunning: room.isTimerRunning,
      participants,
      votesSummary: room.areCardsRevealed ? computeStats(room.votes) : null
    }
  };

  broadcastToRoom(roomId, payload);
}

function computeStats(votes) {
  const values = Object.values(votes).filter(v => v !== null && v !== undefined && v !== '☕' && v !== '❓');
  if (values.length === 0) return { average: null, agreement: 0, min: null, max: null, consensus: false };

  // If numbers
  const numeric = values.map(Number).filter(n => !isNaN(n));
  if (numeric.length > 0) {
    const sum = numeric.reduce((a, b) => a + b, 0);
    const avg = +(sum / numeric.length).toFixed(1);
    const min = Math.min(...numeric);
    const max = Math.max(...numeric);
    const isConsensus = min === max;
    return {
      average: avg,
      min,
      max,
      consensus: isConsensus,
      totalVotes: values.length
    };
  }

  // T-shirt sizing
  const unique = new Set(values);
  return {
    average: null,
    min: null,
    max: null,
    consensus: unique.size === 1,
    totalVotes: values.length
  };
}

// HTTP Server
const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'SprintPoker Real-Time Sync Server',
      port: PORT,
      activeRooms: rooms.size,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Serve static files from dist/ if available (for Render production)
  if (fs.existsSync(DIST_DIR)) {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || !reqPath) reqPath = '/index.html';

    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return;
      } catch (err) {
        // Fall through
      }
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('SprintPoker WebSocket Relay Running');
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let currentUser = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      const { type, roomId, payload } = msg;

      if (type === 'JOIN_ROOM') {
        currentRoomId = roomId || 'sprint-demo';
        currentUser = {
          id: payload.user?.id || 'usr-' + Math.random().toString(36).substring(2, 8),
          name: payload.user?.name || 'Teammate',
          role: payload.user?.role || 'Engineer',
          avatar: payload.user?.avatar || '🚀',
          color: payload.user?.color || '#6366f1',
          isFacilitator: payload.user?.isFacilitator || false
        };

        const room = getOrCreateRoom(currentRoomId);
        room.clients.set(ws, currentUser);

        broadcastFullState(currentRoomId);
      }

      if (!currentRoomId) return;
      const room = getOrCreateRoom(currentRoomId);

      switch (type) {
        case 'SUBMIT_VOTE': {
          room.votes[currentUser.id] = payload.card;
          broadcastFullState(currentRoomId);
          break;
        }

        case 'CLEAR_VOTE': {
          delete room.votes[currentUser.id];
          broadcastFullState(currentRoomId);
          break;
        }

        case 'REVEAL_CARDS': {
          room.areCardsRevealed = true;
          broadcastFullState(currentRoomId);
          break;
        }

        case 'RESET_ROUND': {
          room.votes = {};
          room.areCardsRevealed = false;
          broadcastFullState(currentRoomId);
          break;
        }

        case 'SIMULATE_VOTES': {
          const isConsensus = payload?.consensus;
          const votesMap = isConsensus
            ? { 'usr-sarah': '5', 'usr-alex': '5', 'usr-jordan': '5', 'usr-priya': '5' }
            : { 'usr-sarah': '3', 'usr-alex': '5', 'usr-jordan': '8', 'usr-priya': '5' };

          room.simulatedTeammates = [
            { id: 'usr-sarah', name: 'Sarah (DevOps)', role: 'DevOps Lead', avatar: '💻', color: '#6366f1' },
            { id: 'usr-alex', name: 'Alex (Backend)', role: 'Architect', avatar: '⚡', color: '#10b981' },
            { id: 'usr-jordan', name: 'Jordan (Design)', role: 'UI/UX', avatar: '🎨', color: '#f43f5e' },
            { id: 'usr-priya', name: 'Priya (QA)', role: 'QA Lead', avatar: '🔍', color: '#a855f7' }
          ];

          Object.assign(room.votes, votesMap);
          if (currentUser && !room.votes[currentUser.id]) {
            room.votes[currentUser.id] = '5';
          }
          broadcastFullState(currentRoomId);
          break;
        }

        case 'ACCEPT_ESTIMATE': {
          const { estimate } = payload;
          if (room.currentStory) {
            room.currentStory.estimate = estimate;
            room.currentStory.status = 'estimated';

            // Update in backlog array
            const idx = room.backlog.findIndex(s => s.id === room.currentStory.id);
            if (idx !== -1) {
              room.backlog[idx] = { ...room.currentStory };
            }

            // Find next unestimated story
            const nextStory = room.backlog.find(s => s.status !== 'estimated' && s.id !== room.currentStory.id);
            if (nextStory) {
              nextStory.status = 'estimating';
              room.currentStory = { ...nextStory };
            }
          }

          // Reset votes for next story
          room.votes = {};
          room.areCardsRevealed = false;
          broadcastFullState(currentRoomId);
          break;
        }

        case 'SET_STORY': {
          room.currentStory = payload.story;
          room.votes = {};
          room.areCardsRevealed = false;
          broadcastFullState(currentRoomId);
          break;
        }

        case 'ADD_STORY': {
          room.backlog.push(payload.story);
          broadcastFullState(currentRoomId);
          break;
        }

        case 'SET_DECK': {
          room.deckType = payload.deckType;
          room.votes = {};
          room.areCardsRevealed = false;
          broadcastFullState(currentRoomId);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err.message);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId);
      room.clients.delete(ws);
      if (currentUser && room.votes[currentUser.id]) {
        delete room.votes[currentUser.id];
      }
      broadcastFullState(currentRoomId);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🃏 SprintPoker Sync Server running at http://${HOST}:${PORT}`);
  console.log(`   Serving static assets from: ${DIST_DIR}`);
});
