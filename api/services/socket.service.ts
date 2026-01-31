import { Server, Socket } from 'socket.io';
import { GameEngine } from '../game/engine';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for game instances
const games: Record<string, GameEngine> = {};

export const initializeSocket = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId: string, playerName: string) => {
        let game = games[roomId];
        if (!game) {
            game = new GameEngine(roomId);
            games[roomId] = game;
        }
        
        try {
            // Check if player already exists (reconnect)
            // Simplified: use socket.id as player id for now, or assume client sends a consistent ID
            // For this demo, we'll generate a new ID if it's a new connection, but a real app would use a session token
            const playerId = socket.id; 
            
            game.addPlayer(playerId, playerName);
            socket.join(roomId);
            
            io.to(roomId).emit('game_state_update', game.getState());
            socket.emit('message', `Welcome to room ${roomId}`);
        } catch (e: any) {
            socket.emit('error', e.message);
        }
    });

    socket.on('start_game', (roomId: string) => {
        const game = games[roomId];
        if (game) {
            try {
                game.startGame();
                io.to(roomId).emit('game_state_update', game.getState());
            } catch (e: any) {
                socket.emit('error', e.message);
            }
        }
    });

    socket.on('roll_dice', (roomId: string) => {
        const game = games[roomId];
        if (game) {
            game.rollDice(socket.id);
            io.to(roomId).emit('game_state_update', game.getState());
        }
    });

    socket.on('buy_property', (roomId: string, propertyId: string) => {
        const game = games[roomId];
        if (game) {
            game.buyProperty(socket.id, propertyId);
            io.to(roomId).emit('game_state_update', game.getState());
        }
    });

    socket.on('end_turn', (roomId: string) => {
        const game = games[roomId];
        if (game) {
            game.endTurn(socket.id);
            io.to(roomId).emit('game_state_update', game.getState());
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which game the player was in and handle disconnect
        for (const roomId in games) {
            const game = games[roomId];
            game.removePlayer(socket.id);
            io.to(roomId).emit('game_state_update', game.getState());
        }
    });
  });
};
