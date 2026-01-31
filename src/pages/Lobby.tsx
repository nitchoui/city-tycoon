import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';

const Lobby: React.FC = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name) return alert("Enter name");
    const newRoomId = uuidv4().slice(0, 6); // Short ID
    socket?.emit('join_room', newRoomId, name);
    navigate(`/game/${newRoomId}`);
  };

  const handleJoin = () => {
    if (!name || !roomId) return alert("Enter name and room ID");
    socket?.emit('join_room', roomId, name);
    navigate(`/game/${roomId}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h3" align="center" gutterBottom>City Tycoon</Typography>
        
        {!connected && <Typography color="warning.main">Connecting to server...</Typography>}

        <TextField 
            label="Your Name" 
            fullWidth 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                onClick={handleCreate}
                disabled={!connected}
            >
                Create New Game
            </Button>
        </Box>

        <Typography align="center" variant="overline">OR</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
                label="Room ID" 
                fullWidth 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)} 
            />
            <Button 
                variant="outlined" 
                size="large" 
                onClick={handleJoin}
                disabled={!connected}
            >
                Join Game
            </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Lobby;
