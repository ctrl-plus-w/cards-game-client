export enum CardSymbol {
  HEART = 'HEART',
  DIAMOND = 'DIAMOND',
  CLUB = 'CLUB',
  SPADE = 'SPADE',
}

class PlayingCard {
  rank: IntRange<1, 13>;
  symbol: CardSymbol;

  constructor(rank: IntRange<1, 13>, symbol: CardSymbol) {
    this.rank = rank;
    this.symbol = symbol;
  }
}

export default PlayingCard;
