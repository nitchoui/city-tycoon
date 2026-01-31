import { Tile, TileType } from '../../shared/types';

export const generateBoard = (): Tile[] => {
  const board: Tile[] = [];
  const types: TileType[] = [
    'START', 'PROPERTY', 'COMMUNITY_CHEST', 'PROPERTY', 'TAX', 'RAILROAD', 'PROPERTY', 'CHANCE', 'PROPERTY', 'PROPERTY',
    'JAIL', 'PROPERTY', 'UTILITY', 'PROPERTY', 'PROPERTY', 'RAILROAD', 'PROPERTY', 'COMMUNITY_CHEST', 'PROPERTY', 'PROPERTY',
    'FREE_PARKING', 'PROPERTY', 'CHANCE', 'PROPERTY', 'PROPERTY', 'RAILROAD', 'PROPERTY', 'PROPERTY', 'UTILITY', 'PROPERTY',
    'GO_TO_JAIL', 'PROPERTY', 'PROPERTY', 'COMMUNITY_CHEST', 'PROPERTY', 'RAILROAD', 'CHANCE', 'PROPERTY', 'TAX', 'PROPERTY'
  ];

  const propertyNames = [
    "Old Kent Road", "Whitechapel Road", "The Angel Islington", "Euston Road", "Pentonville Road",
    "Pall Mall", "Whitehall", "Northumberland Avenue", "Bow Street", "Marlborough Street", "Vine Street",
    "Strand", "Fleet Street", "Trafalgar Square", "Leicester Square", "Coventry Street", "Piccadilly",
    "Regent Street", "Oxford Street", "Bond Street", "Park Lane", "Mayfair"
  ];

  const groups = [
    "brown", "brown", "light_blue", "light_blue", "light_blue",
    "pink", "pink", "pink", "orange", "orange", "orange",
    "red", "red", "red", "yellow", "yellow", "yellow",
    "green", "green", "green", "blue", "blue"
  ];

  const prices = [
    60, 60, 100, 100, 120,
    140, 140, 160, 180, 180, 200,
    220, 220, 240, 260, 260, 280,
    300, 300, 320, 350, 400
  ];

  let propIndex = 0;

  for (let i = 0; i < 40; i++) {
    const type = types[i];
    const tile: Tile = {
      id: `tile_${i}`,
      name: `Tile ${i}`,
      type: type,
      position: i,
    };

    if (type === 'START') tile.name = "Go";
    if (type === 'JAIL') tile.name = "Detention";
    if (type === 'GO_TO_JAIL') tile.name = "Go To Detention";
    if (type === 'FREE_PARKING') tile.name = "Free Parking";
    if (type === 'TAX') tile.name = "Tax";
    if (type === 'RAILROAD') {
        tile.name = "Station";
        tile.price = 200;
        tile.group = "station";
    }
    if (type === 'UTILITY') {
        tile.name = "Utility";
        tile.price = 150;
        tile.group = "utility";
    }

    if (type === 'PROPERTY') {
      tile.name = propertyNames[propIndex] || `Property ${propIndex}`;
      tile.price = prices[propIndex] || 200;
      tile.group = groups[propIndex] || "white";
      tile.rent = [tile.price * 0.1, tile.price * 0.5, tile.price * 1.5, tile.price * 3, tile.price * 5, tile.price * 7]; // Simplified rent
      tile.costHouse = tile.price * 0.5;
      propIndex++;
    }

    board.push(tile);
  }

  return board;
};
