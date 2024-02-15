import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useSocket } from '@/context/socket';

import Game from '@/class/Game';

const WarGamePage = () => {
  const router = useRouter();
  const socket = useSocket();

  const { gameId } = router.query;

  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!gameId) return;

    socket.emit('get-war-game');

    socket.on('war-game-update', (_game: Game) => {
      setGame(_game);
    });
  }, [gameId]);

  if (!game) return <p>Loading the game...</p>;

  return (
    <div className="flex flex-col items-start">
      <p>Game id: {game.id}</p>
      <p>Max players: {game.maxPlayers}</p>
      <p>Player count: {game.players.length + 1}</p>

      <br />
      <p>Owner username: {game.owner.username}</p>
    </div>
  );
};

export default WarGamePage;
