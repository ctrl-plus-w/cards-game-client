import Take6Card from '@/class/Take6Card';

import { Player } from '@/type/socket';

class Take6Game {
  id: string;
  owner: Player;
  maxPlayers: IntRange<2, 11>;
  players: Player[];
  playerCards: Record<string, Take6Card[]>;
  playerPickedCards: Record<string, Take6Card[]>;
  columnToReplace: Record<string, number>;
  playedCard: Record<string, Take6Card>;
  columns: [Take6Card[], Take6Card[], Take6Card[], Take6Card[], Take6Card[], Take6Card[]];
  deck: Take6Card[];
  isFinished: boolean;

  constructor(id: string, owner: Player, maxPlayers: IntRange<2, 11>, deck: Take6Card[] = []) {
    this.id = id;
    this.owner = owner;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.playerCards = {};
    this.columnToReplace = {};
    this.playerPickedCards = {};
    this.playedCard = {};
    this.columns = [[], [], [], [], [], []];
    this.deck = deck;
    this.isFinished = false;
  }
}

export default Take6Game;
