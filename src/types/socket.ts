export type Player = {
  id: string;
  name: string;
};

export type Game = {
  id: string;
  players: Player[];
};
