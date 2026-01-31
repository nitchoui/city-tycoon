# Product Requirements Document - City Tycoon

## 1. Project Overview
"City Tycoon" is a multiplayer web-based board game inspired by Monopoly. The game features real-time interaction for 2-6 players, where users buy properties, collect rent, trade, bid in auctions, and aim to be the last player standing or the wealthiest tycoon.

## 2. Core Features

### 2.1 Multiplayer System
- **Lobby System**: Users can create rooms or join via code/link.
- **Host Controls**: Host can start the game.
- **Real-time Sync**: Game state updates instantly for all players using WebSockets.
- **Reconnection**: Players can rejoin the same room if they disconnect.
- **Turn Timer**: Configurable timer (e.g., 45s) with auto-pass/auto-roll.

### 2.2 Game Board & Rules
- **Board Layout**: 40 tiles including Properties, Start (Salary), Tax, Events, Detention, and Parking.
- **Dice**: Deterministic server-side RNG with animations. Doubles rule applies (3 doubles = Detention).
- **Movement**: Animated token movement.
- **Properties**: 
  - 3 Color Groups per set (typical).
  - Utilities and Transport Hubs.
- **Buying**:
  - Purchase unowned properties on landing.
  - Auction system if player declines to buy.
- **Building**:
  - Build Houses and Towers/Hotels.
  - Even-building rule enforced across color sets.
- **Rent**: Calculated based on improvements and set ownership.
- **Events**: "Event" tiles (Chance/Community Chest equivalent) with effects (Pay, Move, Collect, etc.).
- **Detention**: Jail system with "Go to Detention" tile and rules for getting out.

### 2.3 Economy & Trading
- **Trading System**: 
  - Players can trade Money, Properties, and "Get Out of Detention" cards.
  - Dual-acceptance required. Server locks state during trade.
- **Auctions**: Real-time bidding UI for declined properties or forced sales.
- **Bankruptcy**:
  - Assets transferred to creditor.
  - Player eliminated if debts cannot be paid.

### 2.4 Victory Conditions
- **Last Man Standing**: One player remains.
- **Net Worth**: Optional limit (cash or turns) with winner determined by total asset value.

## 3. User Interface (UI) & Experience (UX)
- **Style**: Clean, modern, glassmorphism panels, subtle shadows.
- **Layout**: 
  - Center: Game Board.
  - Right Sidebar: Turn info, player list, balances, assets.
  - Bottom Panel: Actions (Roll, Buy, Auction, Trade, etc.).
- **Animations**: Token movement, dice rolls, card reveals.
- **Accessibility**: Keyboard navigation, colorblind-friendly.

## 4. Technical Constraints
- **Platform**: Web (Desktop first, Mobile supported).
- **Tech Stack**: React, TypeScript, Vite, Node.js, Socket.IO.
- **State**: Server-authoritative.
- **Persistence**: Redis (Session), Postgres (History/Accounts).
