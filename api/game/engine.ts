import { GameState, Player, PlayerId, Tile, TileType } from '../../shared/types';
import { generateBoard } from './boardData';
import { v4 as uuidv4 } from 'uuid';

export class GameEngine {
  private state: GameState;

  constructor(roomId: string) {
    this.state = {
      id: roomId,
      players: {},
      board: generateBoard(),
      currentTurn: '',
      turnOrder: [],
      phase: 'LOBBY',
      dice: [0, 0],
      lastRollWasDouble: false,
      consecutiveDoubles: 0,
      winner: null,
      logs: [],
    };
  }

  getState(): GameState {
    return this.state;
  }

  addPlayer(id: PlayerId, name: string): Player {
    if (this.state.phase !== 'LOBBY') {
        // Allow rejoin logic here if needed, simplified for now
        throw new Error("Game already started");
    }
    const player: Player = {
      id,
      name,
      color: this.getRandomColor(),
      money: 1500,
      position: 0,
      properties: [],
      jailTurns: 0,
      isReady: false,
      connected: true
    };
    this.state.players[id] = player;
    this.state.turnOrder.push(id);
    this.log(`${name} joined the game.`);
    return player;
  }

  removePlayer(id: PlayerId) {
    if (this.state.players[id]) {
        this.state.players[id].connected = false;
        this.log(`${this.state.players[id].name} disconnected.`);
    }
  }

  startGame() {
    if (this.state.turnOrder.length < 2) {
        throw new Error("Not enough players");
    }
    this.state.phase = 'ROLL_DICE';
    this.state.currentTurn = this.state.turnOrder[0];
    this.log("Game started!");
  }

  rollDice(playerId: PlayerId) {
    if (playerId !== this.state.currentTurn) return;
    if (this.state.phase !== 'ROLL_DICE') return;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    this.state.dice = [d1, d2];
    this.log(`${this.state.players[playerId].name} rolled ${d1} + ${d2} = ${d1 + d2}`);

    const isDouble = d1 === d2;
    this.state.lastRollWasDouble = isDouble;
    
    if (isDouble) {
        this.state.consecutiveDoubles++;
    } else {
        this.state.consecutiveDoubles = 0;
    }

    if (this.state.consecutiveDoubles >= 3) {
        this.goToJail(playerId);
        this.state.phase = 'END_TURN';
        return;
    }

    this.movePlayer(playerId, d1 + d2);
  }

  movePlayer(playerId: PlayerId, steps: number) {
    const player = this.state.players[playerId];
    let newPos = player.position + steps;
    
    if (newPos >= 40) {
        newPos -= 40;
        player.money += 200; // Salary
        this.log(`${player.name} passed GO and collected $200.`);
    }
    
    player.position = newPos;
    this.handleTileLanding(playerId, newPos);
  }

  handleTileLanding(playerId: PlayerId, pos: number) {
    const tile = this.state.board[pos];
    this.log(`${this.state.players[playerId].name} landed on ${tile.name}`);

    if (tile.type === 'GO_TO_JAIL') {
        this.goToJail(playerId);
        this.state.phase = 'END_TURN';
        return;
    }

    if (['PROPERTY', 'RAILROAD', 'UTILITY'].includes(tile.type)) {
        if (!tile.owner) {
            // Offer to buy
            this.state.phase = 'MAIN_ACTION'; // Allow buy
        } else if (tile.owner !== playerId) {
            // Pay rent
            this.payRent(playerId, tile);
            this.state.phase = 'END_TURN'; // Or allow other actions?
        } else {
             this.state.phase = 'END_TURN';
        }
    } else {
        // Handle other tiles (Tax, Chance, etc.) - Simplified
        this.state.phase = 'END_TURN';
    }
    
    if (this.state.lastRollWasDouble && this.state.phase === 'END_TURN') {
        this.state.phase = 'ROLL_DICE'; // Roll again
        this.log(`${this.state.players[playerId].name} rolled doubles and goes again.`);
    } else if (this.state.phase === 'MAIN_ACTION' && !tile.owner) {
        // Stay in main action to buy
    } else {
        this.state.phase = 'END_TURN';
    }
  }

  buyProperty(playerId: PlayerId, propertyId: string) {
    const player = this.state.players[playerId];
    const tile = this.state.board.find(t => t.id === propertyId);
    
    if (!tile || tile.owner || player.money < (tile.price || 0)) return;

    player.money -= tile.price || 0;
    tile.owner = playerId;
    player.properties.push(propertyId);
    this.log(`${player.name} bought ${tile.name} for $${tile.price}`);
    
    if (this.state.lastRollWasDouble) {
         this.state.phase = 'ROLL_DICE';
    } else {
         this.state.phase = 'END_TURN';
    }
  }

  payRent(playerId: PlayerId, tile: Tile) {
     const player = this.state.players[playerId];
     const owner = this.state.players[tile.owner!];
     let rent = 0;
     
     if (tile.rent && tile.rent.length > 0) {
         rent = tile.rent[tile.houses || 0];
     } else {
         rent = (tile.price || 0) * 0.1; // Fallback
     }
     
     player.money -= rent;
     owner.money += rent;
     this.log(`${player.name} paid $${rent} rent to ${owner.name}`);
     
     if (player.money < 0) {
         this.handleBankruptcy(playerId);
     }
  }

  goToJail(playerId: PlayerId) {
      const player = this.state.players[playerId];
      player.position = 10; // Jail pos
      player.jailTurns = 3;
      this.log(`${player.name} went to detention!`);
  }

  endTurn(playerId: PlayerId) {
      if (playerId !== this.state.currentTurn) return;
      
      const currentIndex = this.state.turnOrder.indexOf(playerId);
      const nextIndex = (currentIndex + 1) % this.state.turnOrder.length;
      this.state.currentTurn = this.state.turnOrder[nextIndex];
      this.state.phase = 'ROLL_DICE';
      this.state.dice = [0, 0];
      this.state.lastRollWasDouble = false;
      this.state.consecutiveDoubles = 0;
      this.log(`Turn ended. It is now ${this.state.players[this.state.currentTurn].name}'s turn.`);
  }
  
  handleBankruptcy(playerId: PlayerId) {
      this.log(`${this.state.players[playerId].name} is bankrupt!`);
      // Simplified bankruptcy
  }

  private log(message: string) {
      this.state.logs.push(message);
      if (this.state.logs.length > 50) this.state.logs.shift();
  }

  private getRandomColor() {
      const colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#ff9800'];
      return colors[Math.floor(Math.random() * colors.length)];
  }
}
