# Page Design & UI/UX - City Tycoon

## 1. Design Philosophy
- **Style**: Modern, Clean, "Glassmorphism".
- **Color Palette**: 
  - Background: Dark/Neutral (Slate/Zinc).
  - Accents: Vibrant colors for players and property groups.
  - Surface: Translucent white/dark panels with blur effects.
- **Typography**: Sans-serif (Inter or Roboto), clear hierarchy.

## 2. Key Screens

### 2.1 Home / Lobby
- **Hero Section**: Game Logo, "Play Now" button.
- **Join/Create Form**: 
  - Input for Name.
  - "Create Room" button -> Generates Code.
  - "Join Room" input -> Enters Lobby.
- **Lobby View**:
  - List of connected players with avatars/colors.
  - "Ready" toggle for each player.
  - "Start Game" button (Host only).
  - Settings panel (Timer, Max turns).

### 2.2 Game Board (Main View)
- **Layout**:
  - **Center**: The Board. Square aspect ratio. 
    - 40 Tiles arranged in a loop.
    - Center area for Dice animation, Event Card popups.
  - **Tokens**: 3D-style or distinct icons representing players on the board.
  - **Animations**: Smooth transitions when moving between tiles.

### 2.3 HUD (Heads-Up Display)
- **Right Sidebar (Dashboard)**:
  - **Turn Indicator**: Whose turn it is, Timer countdown.
  - **Player List**: Compact view of all players.
    - Name, Cash Balance.
    - Active/Inactive status.
    - Owned sets (small indicators).
- **Bottom Bar (Action Panel)**:
  - Dynamic buttons based on game phase.
  - **Phase: Roll**: Large "ROLL" button.
  - **Phase: Landed**: "BUY $200", "AUCTION", "PASS".
  - **Phase: Jail**: "PAY $50", "ROLL DOUBLES", "USE CARD".
  - **General**: "TRADE", "MORTGAGE", "END TURN".

### 2.4 Modals & Overlays
- **Property Details**:
  - Shows Rent table, Mortgage value, House cost.
  - "Build" / "Sell" buttons if owned.
- **Trade Interface**:
  - Split view: "You Give" vs "You Get".
  - Drag and drop or click-to-select assets (Cash, Properties).
  - Status indicators: "Pending", "Accepted", "Locked".
- **Auction Room**:
  - Overlay showing property card.
  - Current Bid, High Bidder.
  - "Bid +10", "Bid +100", "Custom Bid" buttons.
  - Countdown timer resetting on new bids.

## 3. Responsive Strategy
- **Desktop**: Full layout as described.
- **Tablet**: Sidebar becomes collapsible or moves to top.
- **Mobile**: 
  - Board scales down, pan/zoom might be required or simplified linear view.
  - Controls move to a bottom drawer.
  - Critical info (Current Player, Your Money) always visible.
