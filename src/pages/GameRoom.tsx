import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { GameState } from '../../shared/types';
import Board from '../components/Board';
import ControlPanel from '../components/ControlPanel';

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket, connected } = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!socket || !connected || !roomId) return;

    // Listen for updates
    socket.on('game_state_update', (state: GameState) => {
      setGameState(state);
    });

    socket.on('error', (msg: string) => {
        setError(msg);
    });

    // Clean up
    return () => {
      socket.off('game_state_update');
      socket.off('error');
    };
  }, [socket, connected, roomId]);

  if (!connected) return <Container><CircularProgress /> Connecting...</Container>;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;
  if (!gameState) return <Container><CircularProgress /> Waiting for game state...</Container>;

  const playerId = socket?.id || '';

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#eceff1', p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Room: {roomId}
      </Typography>

      <Grid container spacing={2} sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Board gameState={gameState} playerId={playerId} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ControlPanel gameState={gameState} playerId={playerId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameRoom;
