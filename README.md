# 🃏 SprintPoker — Real-Time Agile Story Point Estimation

> **A high-velocity, real-time multiplayer Scrum Planning Poker web application with 3D card flips, consensus detection, Web Audio tactile feedback, and 1-click Jira export.** Built for remote Agile engineering teams, Scrum Masters, and Delivery Leads.

Developed by **Balaji Palani** (Senior Scrum Master / Technical Agile Delivery Lead, CSM®, SAFe® 6 SSM).

---

## 🌟 Key Features

- 🃏 **Multiplayer Real-Time Estimation Table:** Oval felt poker table with trigonometric teammate seating, 3D face-down cards to prevent anchoring bias, and synchronized reveals.
- 📐 **Multiple Agile Sizing Decks:** 
  - Standard Scrum Fibonacci (`0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ☕, ❓`)
  - Modified Fibonacci (`0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100`)
  - T-Shirt Sizing (`XS, S, M, L, XL, XXL`)
  - Powers of 2 (`0, 1, 2, 4, 8, 16, 32, 64`)
- 🏆 **Smart Consensus & Divergence Detection:**
  - Automated average, min, max, and consensus calculation.
  - Confetti celebration explosion upon unanimous team consensus.
  - Discussion prompts highlighting estimate outliers when divergence occurs.
- 📋 **Integrated Sprint Backlog Drawer:**
  - Real-time queue tracking of estimated vs pending user stories.
  - "Accept Estimate & Next Story" workflow with instant velocity tally.
  - RFC 4180 **Jira CSV Export** for instant Jira sprint backlog import.
  - 1-click formatted **Markdown table copy** for Confluence or Slack.
- 🔊 **Tactile Web Audio Synthesizer:** Zero external audio assets—native Web Audio API harmonic sound effects for card placement, flip reveals, consensus chimes, and divergence warnings.
- 🎲 **Recruiter 1-Click Sandbox Dock:** Instant evaluation buttons (`Simulate Split Votes`, `Simulate Consensus`, `Reveal`) allowing interviewers to test the full real-time gaming loop in seconds without needing multiple browsers.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide React, Canvas Confetti.
- **Audio:** Web Audio API Procedural Synthesizer.
- **Backend / Synchronization:** Node.js WebSocket Server (`ws`) + Native HTTP static file server.
- **Deployment & Cost:** $0.00 zero-cost footprint, production-ready for Render, Fly.io, or Railway free tiers.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Real-Time Server
```bash
npm start
```
Runs at `http://localhost:5179` with WebSocket relay and static asset serving.

### 3. Or Run Development Server with HMR
```bash
npm run dev
```
Runs Vite on `http://localhost:5178`.

---

## 📜 License
MIT © Balaji Palani
