# 🃏 SprintPoker — Real-Time Agile Story Point Estimation

**Engineered by Balaji Palani** (Senior Scrum Master / Technical Agile Delivery Lead, CSM®, SAFe® 6 SSM)  
**Live Cloud URL:** [sprintpoker-gnel.onrender.com](https://sprintpoker-gnel.onrender.com)  
**Repository:** [github.com/layyzee/SprintPoker](https://github.com/layyzee/SprintPoker)  
**Live Portfolio:** [layyzee.github.io](https://layyzee.github.io)  
**Local Codebase:** [`/Users/layyzee/Downloads/SprintPoker`](file:///Users/layyzee/Downloads/SprintPoker)

---

## 📸 Production Verification Gallery

````carousel
![All 5 Cards Face-Down in 3D Table](/Users/layyzee/.gemini/antigravity/brain/45615f03-778e-4bc5-85ce-c92a43547f5c/sprintpoker_voting_complete.png)
<!-- slide -->
![Synchronized 3D Flip Reveal & Consensus Celebration](/Users/layyzee/.gemini/antigravity/brain/45615f03-778e-4bc5-85ce-c92a43547f5c/sprintpoker_revealed_consensus.png)
<!-- slide -->
![Sprint Backlog Drawer with Story Acceptance & Jira Export](/Users/layyzee/.gemini/antigravity/brain/45615f03-778e-4bc5-85ce-c92a43547f5c/sprintpoker_backlog_estimated.png)
````

---

## 🌟 What Was Built

### 1. Multiplayer Felt Poker Table ([`PokerTable.jsx`](file:///Users/layyzee/Downloads/SprintPoker/src/components/PokerTable.jsx))
* **Trigonometric Seating Ring:** Coordinates 5+ teammates smoothly around an emerald oval felt table with radial distribution.
* **Anti-Anchoring Bias:** Keeps votes face-down (`🂠`) with 3D gradients until the facilitator or team triggers reveal.
* **Live Status Telemetry:** Live headcount indicators (`X of Y Teammates Voted`) and active story card with collapsible acceptance criteria.

### 2. Smart Consensus & Outlier Analytics
* Automatic mathematical calculations upon card reveal:
  * **Unanimous Consensus:** Triggers procedural Web Audio chimes and canvas confetti celebration (`Consensus Reached! (5 pts) 🏆`).
  * **Divergence Warning:** Identifies outliers (`Min: 3 | Max: 8`) and prompts structured team debate (`💬 Divergent Estimates: Discuss!`).

### 3. Integrated Sprint Backlog Drawer ([`BacklogDrawer.jsx`](file:///Users/layyzee/Downloads/SprintPoker/src/components/BacklogDrawer.jsx))
* Real-time queue showing pending, active, and estimated stories with live point tallies.
* **"Accept Estimate & Next Story":** 1-click promotion that records velocity, marks story complete, and loads the next backlog item onto the table.
* **RFC 4180 Jira CSV Export:** Instant download for direct Jira sprint backlog import.
* **Confluence Markdown Table:** 1-click clipboard copy for sprint planning documentation.

### 4. Recruiter 1-Click Interactive Sandbox ([`RecruiterDemoBanner.jsx`](file:///Users/layyzee/Downloads/SprintPoker/src/components/RecruiterDemoBanner.jsx))
* Sub-header dock giving recruiters and hiring managers instant evaluation without needing multiple browsers:
  * `🎲 Simulate Split Votes`: Populates table with divergent estimates to test discussion prompts.
  * `🏆 Simulate Consensus`: Fills table with unanimous votes to trigger celebration.
  * `👁️ Reveal`: Flips cards with 3D animation.
  * `🔄 Reset`: Starts fresh estimation round.

### 5. Tactile Web Audio Synthesizer ([`sound.js`](file:///Users/layyzee/Downloads/SprintPoker/src/utils/sound.js))
* **\$0.00 footprint:** Zero audio files downloaded over the network.
* Uses native HTML5 Web Audio API to procedurally synthesize card clicks, card flips, harmonic consensus chords, and divergence warning tones.

---

## 🏗️ Technical Architecture & Specs

```mermaid
flowchart TD
    Client1["Browser 1: Bala (Scrum Master)"] <-->|WebSocket wss://| Server["Node.js Sync Server (:5179)"]
    Client2["Browser 2: Sarah (Frontend)"] <-->|WebSocket wss://| Server
    Client3["Browser 3: Alex (Backend)"] <-->|WebSocket wss://| Server
    
    subgraph Server_Architecture ["Server Engine (:5179)"]
        Server --> RoomManager["In-Memory Room State Store"]
        RoomManager --> StatsCalc["Consensus & Variance Engine"]
        Server --> StaticServer["Static Production Asset Server (dist/)"]
    end

    subgraph Client_Features ["Client Application (:5178 / Production)"]
        Hook["usePokerSync Hook"]
        UI_Table["PokerTable (Trigonometric Oval)"]
        UI_Deck["CardDeckSelector (Fibonacci / T-Shirt)"]
        UI_Backlog["BacklogDrawer (Jira CSV Export)"]
        Audio["Web Audio Synthesizer"]
    end
```

---

## 📊 Deployment & Portfolio Status

1. **GitHub Repository:** Created and pushed cleanly to [github.com/layyzee/SprintPoker](https://github.com/layyzee/SprintPoker).
2. **Cloud Blueprint:** [`render.yaml`](file:///Users/layyzee/Downloads/SprintPoker/render.yaml) created for 100% free tier hosting ($0.00/month).
3. **Live Portfolio Showcase:** Updated and pushed to [layyzee.github.io](https://layyzee.github.io) showcasing the full three-product SaaS suite:
   * **BalaBoard:** Real-time Miro retro alternative with AI clustering.
   * **BalaGPT:** Streaming GenAI productivity workstation with native SQLite.
   * **SprintPoker:** Real-time multiplayer Agile estimation table with Jira backlog export.
