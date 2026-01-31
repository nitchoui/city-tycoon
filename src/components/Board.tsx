import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { GameState, Tile } from '../../shared/types';

interface BoardProps {
  gameState: GameState;
  playerId: string;
}

const TILE_SIZE = 80; // px
const BOARD_SIZE = 11 * TILE_SIZE;

const Board: React.FC<BoardProps> = ({ gameState, playerId }) => {
  const { board, players } = gameState;

  const getTileStyle = (index: number) => {
    // 0 is Bottom Right
    // 1-9 Bottom (Right to Left)
    // 10 Bottom Left
    // 11-19 Left (Bottom to Top)
    // 20 Top Left
    // 21-29 Top (Left to Right)
    // 30 Top Right
    // 31-39 Right (Top to Bottom)

    let top = 0;
    let left = 0;

    if (index >= 0 && index <= 10) {
      // Bottom Row: 10 down to 0
      top = 10 * TILE_SIZE;
      left = (10 - index) * TILE_SIZE;
    } else if (index >= 11 && index <= 20) {
      // Left Column: 11 up to 20
      left = 0;
      top = (10 - (index - 10)) * TILE_SIZE;
    } else if (index >= 21 && index <= 30) {
      // Top Row: 21 to 30
      top = 0;
      left = (index - 20) * TILE_SIZE;
    } else if (index >= 31 && index <= 39) {
      // Right Column: 31 down to 39
      left = 10 * TILE_SIZE;
      top = (index - 30) * TILE_SIZE;
    }

    return { top, left };
  };

  const getGroupColor = (group?: string) => {
    switch (group) {
      case 'brown': return '#8d6e63';
      case 'light_blue': return '#81d4fa';
      case 'pink': return '#f48fb1';
      case 'orange': return '#ffcc80';
      case 'red': return '#ef5350';
      case 'yellow': return '#fff59d';
      case 'green': return '#a5d6a7';
      case 'blue': return '#90caf9';
      case 'station': return '#bdbdbd';
      case 'utility': return '#b0bec5';
      default: return '#f5f5f5';
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: BOARD_SIZE + 4, // border 
      height: BOARD_SIZE + 4, 
      border: '2px solid #333',
      backgroundColor: '#e0f7fa',
      margin: 'auto'
    }}>
      {/* Center Logo / Info */}
      <Box sx={{
        position: 'absolute',
        top: TILE_SIZE,
        left: TILE_SIZE,
        width: BOARD_SIZE - 2 * TILE_SIZE,
        height: BOARD_SIZE - 2 * TILE_SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5
      }}>
        <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', transform: 'rotate(-45deg)' }}>
          CITY TYCOON
        </Typography>
      </Box>

      {board.map((tile, index) => {
        const { top, left } = getTileStyle(index);
        const owner = tile.owner ? players[tile.owner] : null;

        return (
          <Paper
            key={tile.id}
            elevation={3}
            sx={{
              position: 'absolute',
              top,
              left,
              width: TILE_SIZE,
              height: TILE_SIZE,
              border: '1px solid #999',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              backgroundColor: owner ? '#e8f5e9' : 'white', // Highlight owned
            }}
          >
            {/* Color Bar */}
            {tile.group && ['brown', 'light_blue', 'pink', 'orange', 'red', 'yellow', 'green', 'blue'].includes(tile.group) && (
              <Box sx={{ height: '20%', width: '100%', backgroundColor: getGroupColor(tile.group) }} />
            )}
            
            <Box sx={{ p: 0.5, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ lineHeight: 1.1, fontSize: '0.65rem', fontWeight: 'bold' }}>
                {tile.name}
              </Typography>
              {tile.price && (
                <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                  ${tile.price}
                </Typography>
              )}
            </Box>

             {/* Player Tokens */}
             <Box sx={{ position: 'absolute', bottom: 2, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                {Object.values(players).filter(p => p.position === index).map(p => (
                    <Tooltip key={p.id} title={p.name}>
                        <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: p.color, 
                            border: '1px solid white',
                            boxShadow: 1
                        }} />
                    </Tooltip>
                ))}
             </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default Board;
