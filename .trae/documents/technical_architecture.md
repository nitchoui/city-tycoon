# Technical Architecture - City Tycoon

## 1. High-Level Architecture
The application follows a client-server architecture with real-time bidirectional communication. The server is the single source of truth (authoritative), managing the game state and validating all actions. The client is a presentation layer that renders the state and sends user inputs.

## 2. Tech Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) + Emotion
- **State Management**: Zustand (for local UI state) + Socket.IO (for remote game state syncing)
- **Styling**: Tailwind CSS (optional utility) / MUI System
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (for HTTP APIs) + Socket.IO (for Game Events)
- **Language**: TypeScript
- **Database**: 
  - **Redis**: Temporary game state storage, session management.
  - **PostgreSQL (Supabase)**: User accounts, match history, permanent records.

## 3. Data Structures

### 3.1 GameState Schema
```typescript
interface GameState {
  roomId: string;
  players: Player[];
  board: Tile[]; // 40 tiles
  currentTurn: number; // Index of current player
  phase: 'ROLL' | 'ACTION' | 'AUCTION' | 'TRADE' | 'END';
  dice: [number, number];
  bank: number; // Infinite, but tracked
  decks: {
    events: Card[]; // Shared deck
  };
  auctions: Auction | null;
  trades: TradeRequest | null;
  logs: GameLog[];
  settings: GameSettings;
}

interface Player {
  id: string;
  name: string;
  color: string;
  position: number;
  money: number;
  properties: string[]; // Property IDs
  jailStatus: {
    isInJail: boolean;
    turnsInJail: number;
    getOutCards: number;
  };
  isConnected: boolean;
}
```

## 4. Communication Protocols

### 4.1 WebSocket Events (Client -> Server)
- `JOIN_ROOM`: { roomId, playerName }
- `PLAYER_READY`: { isReady }
- `START_GAME`: {} (Host only)
- `ROLL_DICE`: {}
- `BUY_PROPERTY`: { propertyId }
- `START_AUCTION`: { propertyId }
- `PLACE_BID`: { amount }
- `END_TURN`: {}
- `PROPOSE_TRADE`: { targetPlayerId, offer, request }
- `ACCEPT_TRADE`: { tradeId }
- `REJECT_TRADE`: { tradeId }

### 4.2 WebSocket Events (Server -> Client)
- `ROOM_UPDATE`: { players, readyStatus }
- `GAME_STATE_UPDATE`: Full or partial GameState
- `EVENT_LOG`: { message, type }
- `ERROR`: { message }

## 5. Directory Structure
```
/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
├── server/          # Node.js Backend
│   ├── src/
│   │   ├── engine/  # Game Logic
│   │   ├── events/  # Socket Handlers
│   │   ├── models/  # DB Models
│   │   └── utils/
└── shared/          # Shared Types
    └── types.ts
```

## 6. Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Vercel (if using serverless compatible sockets, otherwise VPS)
