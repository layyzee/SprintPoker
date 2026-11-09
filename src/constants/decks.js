// Agile Story Point Card Decks for SprintPoker
export const DECKS = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci (Standard Scrum)',
    description: 'The industry-standard sequence for Agile sizing.',
    cards: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '☕', '❓']
  },
  modified: {
    id: 'modified',
    name: 'Modified Fibonacci',
    description: 'Rounded numbers for larger, rougher epics.',
    cards: ['0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '☕', '❓']
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Sizing',
    description: 'Ideal for early-stage roadmap and epic triage.',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '☕', '❓']
  },
  powersOfTwo: {
    id: 'powersOfTwo',
    name: 'Powers of 2',
    description: 'Binary sizing for engineering capacity modeling.',
    cards: ['0', '1', '2', '4', '8', '16', '32', '64', '☕', '❓']
  }
};

export const SAMPLE_BACKLOG = [
  {
    id: 'story-1',
    key: 'PAY-184',
    title: 'Zero-Downtime Payments Webhook Migration',
    description: 'Migrate legacy payment notification webhooks to idempotency-backed event stream with Redis deduplication.',
    acceptanceCriteria: [
      'Webhook processing latency under 120ms',
      'Idempotency key prevents duplicate transactions',
      'Zero message loss during Redis failover'
    ],
    estimate: null,
    status: 'estimating'
  },
  {
    id: 'story-2',
    key: 'AUTH-92',
    title: 'Biometric FaceID & WebAuthn MFA Login',
    description: 'Add support for FIDO2 WebAuthn authentication across web and mobile web banking clients.',
    acceptanceCriteria: [
      'Fallback to SMS/Email OTP if device lacks hardware biometric sensor',
      'Session token encrypted with AES-GCM-256'
    ],
    estimate: null,
    status: 'backlog'
  },
  {
    id: 'story-3',
    key: 'PERF-105',
    title: 'PostgreSQL Transactions Index Optimization',
    description: 'Add composite indexes and table partition by quarter on the ledger_entries table to eliminate full table scans.',
    acceptanceCriteria: [
      'Statement execution time under 45ms for p95 queries',
      'Zero lock contention during non-blocking index creation'
    ],
    estimate: null,
    status: 'backlog'
  },
  {
    id: 'story-4',
    key: 'UI-240',
    title: 'Dark Mode High-Contrast Accessibility Theme',
    description: 'Implement WCAG 2.1 AAA high-contrast dark theme for customer statement tables.',
    acceptanceCriteria: [
      'Color contrast ratio exceeds 7:1 for text elements',
      'User preference persists in localStorage and syncs with OS'
    ],
    estimate: null,
    status: 'backlog'
  }
];

export const PRESET_TEAMMATES = [
  { id: 'usr-bala', name: 'Bala (Scrum Master)', role: 'Facilitator', avatar: '👑', color: '#f59e0b', vote: '5' },
  { id: 'usr-sarah', name: 'Sarah (DevOps)', role: 'DevOps Lead', avatar: '💻', color: '#6366f1', vote: '5' },
  { id: 'usr-alex', name: 'Alex (Backend)', role: 'Architect', avatar: '⚡', color: '#10b981', vote: '5' },
  { id: 'usr-jordan', name: 'Jordan (Design)', role: 'UI/UX', avatar: '🎨', color: '#f43f5e', vote: '3' },
  { id: 'usr-priya', name: 'Priya (QA)', role: 'QA Lead', avatar: '🔍', color: '#a855f7', vote: '5' }
];
