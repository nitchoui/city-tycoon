import React from 'react';
import { Box, Button, Paper, Typography, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { GameState, Player } from '../../shared/types';
import { useSocket } from '../context/SocketContext';

interface ControlPanelProps {
  gameState: GameState;
  playerId: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, playerId }) => {
  const { socket } = useSocket();
  const player = gameState.players[playerId];
  const isMyTurn = gameState.currentTurn === playerId;
  const currentTile = gameState.board[player?.position || 0];

  const handleRoll = () => {
    socket?.emit('roll_dice', gameState.id);
  };

  const handleBuy = () => {
    if (currentTile) {
        socket?.emit('buy_property', gameState.id, currentTile.id);
    }
  };

  const handleEndTurn = () => {
    socket?.emit('end_turn', gameState.id);
  };

  const handleStartGame = () => {
    socket?.emit('start_game', gameState.id);
  };

  if (!player) return null;

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Game Info */}
      <Box>
        <Typography variant="h5" gutterBottom>Game Controls</Typography>
        <Typography variant="body1">Phase: <Chip label={gameState.phase} color="primary" size="small" /></Typography>
        <Typography variant="body1">Current Turn: {gameState.players[gameState.currentTurn]?.name || 'Waiting to start'}</Typography>
        {gameState.dice[0] > 0 && (
             <Typography variant="h6" sx={{ mt: 1 }}>
                Dice: {gameState.dice[0]} + {gameState.dice[1]} = {gameState.dice[0] + gameState.dice[1]}
             </Typography>
        )}
      </Box>

      <Divider />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {gameState.phase === 'LOBBY' && gameState.turnOrder[0] === playerId && (
             <Button 
                 variant="contained" 
                 color="primary" 
                 onClick={handleStartGame}
                 disabled={gameState.turnOrder.length < 1} // Allow 1 player
             >
               Start Game ({gameState.turnOrder.length}/6)
             </Button>
         )}
        
        {gameState.phase !== 'LOBBY' && (
            <>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleRoll}
                    disabled={!isMyTurn || gameState.phase !== 'ROLL_DICE'}
                >
                  Roll Dice
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleBuy}
                    disabled={!isMyTurn || gameState.phase !== 'MAIN_ACTION' || !!currentTile.owner || !currentTile.price}
                >
                  Buy Property
                </Button>
                <Button 
                    variant="contained" 
                    color="warning" 
                    onClick={handleEndTurn}
                    disabled={!isMyTurn || gameState.phase === 'ROLL_DICE'} // Can end if not rolling
                >
                  End Turn
                </Button>
            </>
        )}
      </Box>

      <Divider />

      {/* My Stats */}
      <Box>
        <Typography variant="h6">My Status</Typography>
        <Typography>Money: ${player.money}</Typography>
        <Typography>Position: {currentTile?.name}</Typography>
        <Typography>Properties: {player.properties.length}</Typography>
      </Box>

      <Divider />

      {/* Logs */}
      <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 200, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
        <List dense>
            {gameState.logs.slice().reverse().map((log, i) => (
                <ListItem key={i}>
                    <ListItemText primary={log} />
                </ListItem>
            ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ControlPanel;
