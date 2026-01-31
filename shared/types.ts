export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  color: string;
  money: number;
  position: number;
  properties: string[]; // Property IDs
  jailTurns: number; // 0 if not in jail
  isReady: boolean;
  connected: boolean;
}

export type TileType = 'PROPERTY' | 'RAILROAD' | 'UTILITY' | 'TAX' | 'START' | 'JAIL' | 'GO_TO_JAIL' | 'FREE_PARKING' | 'CHANCE' | 'COMMUNITY_CHEST';

export interface Tile {
  id: string;
  name: string;
  type: TileType;
  position: number;
  price?: number;
  rent?: number[]; // Base, 1 house, ..., hotel
  group?: string; // Color group or type
  owner?: PlayerId;
  houses?: number; // 0-4 houses, 5 = hotel
  mortgaged?: boolean;
  costHouse?: number;
}

export interface GameState {
  id: string; // Room ID
  players: Record<PlayerId, Player>;
  board: Tile[];
  currentTurn: PlayerId;
  turnOrder: PlayerId[];
  phase: 'LOBBY' | 'ROLL_DICE' | 'MAIN_ACTION' | 'AUCTION' | 'BANKRUPTCY' | 'END_TURN';
  dice: [number, number];
  lastRollWasDouble: boolean;
  consecutiveDoubles: number;
  winner: PlayerId | null;
  logs: string[];
  auction?: {
    propertyId: string;
    currentBid: number;
    highestBidder: PlayerId | null;
    participants: PlayerId[];
    timer: number;
  };
}

export interface ClientToServerEvents {
  'join_room': (roomId: string, playerName: string) => void;
  'start_game': (roomId: string) => void;
  'roll_dice': (roomId: string) => void;
  'buy_property': (roomId: string, propertyId: string) => void;
  'end_turn': (roomId: string) => void;
  'bid': (roomId: string, amount: number) => void;
  'pass_auction': (roomId: string) => void;
  'reconnect': (roomId: string, playerId: string) => void;
}

export interface ServerToClientEvents {
  'game_state_update': (state: GameState) => void;
  'error': (message: string) => void;
  'message': (message: string) => void;
}
