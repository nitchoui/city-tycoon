# City Tycoon

A multiplayer real-time board game inspired by Monopoly, built with React, TypeScript, Node.js, and Socket.IO.

## Features

- **Real-time Multiplayer**: Play with 2-6 players in real-time.
- **Game Logic**: Full server-authoritative game engine handling turns, dice rolls, movement, buying properties, and paying rent.
- **Board**: 40-tile board with properties, railroads, utilities, tax, and special tiles.
- **UI**: Modern, responsive interface using Material UI.
- **Room System**: Create or join private game rooms via ID.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Material UI (MUI)
- **Backend**: Node.js, Express, Socket.IO
- **State Management**: Server-side in-memory game state (extensible to Redis)
- **Communication**: WebSockets (Socket.IO)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

### Running Locally

Start both the client and server in development mode:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

### Deployment

#### 1. Backend (API)
The backend requires a persistent environment for WebSockets (Socket.IO). We recommend deploying to **Render**, **Railway**, or **Heroku**.

**Deploy to Render:**
1. Fork/Push this repo to GitHub.
2. Create a new **Web Service** on Render.
3. Connect your repo.
4. Render should detect the `render.yaml` automatically, or use these settings:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server:start`
5. Copy the deployed URL (e.g., `https://city-tycoon-api.onrender.com`).

#### 2. Frontend (Client)
The frontend can be deployed to Vercel, Netlify, or any static host.

1. Deploy to Vercel (or similar).
2. Add an Environment Variable:
   - `VITE_API_URL`: Your Backend URL (e.g., `https://city-tycoon-api.onrender.com`)
3. Redeploy.

### How to Play

1. Open the client in multiple browser tabs/windows.
2. **Tab 1**: Enter your name and click "Create New Game". Copy the Room ID.
3. **Tab 2+**: Enter a name, paste the Room ID, and click "Join Game".
4. Once all players are in, the host (first player - technically anyone right now) can start via the console or just start rolling if logic allows (currently auto-starts or waits for players).
   *Note: The current implementation requires at least 2 players to start the game loop properly.*

## Project Structure

- `api/`: Backend server code
  - `game/`: Game engine and logic
  - `services/`: Socket service
- `src/`: Frontend React application
  - `components/`: UI components (Board, ControlPanel)
  - `context/`: Socket context
  - `pages/`: Game pages (Lobby, GameRoom)
- `shared/`: Shared TypeScript types between client and server

## License

MIT
