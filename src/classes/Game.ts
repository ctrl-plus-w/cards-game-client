import PlayingCard from './PlayingCard';

import { Player } from '@/type/socket';

class Game {
  id: string;
  owner: Player;
  maxPlayers: IntRange<2, 11>;
  players: Player[];
  playerCards: Record<string, PlayingCard[]>;

  constructor(id: string, owner: Player, maxPlayers: IntRange<2, 11>) {
    this.id = id;
    this.owner = owner;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.playerCards = {};
  }
}

export default Game;
