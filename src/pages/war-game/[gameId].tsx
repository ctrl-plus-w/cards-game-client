import React, { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

import WarGame from '@/class/WarGame';

import { cn } from '@/util/style.util';

const WarGamePage = () => {
  const router = useRouter();
  const socket = useSocket();

  const { profile } = useProfile();

  const { gameId } = router.query;

  const [game, setGame] = useState<WarGame | null>(null);
  const [_hasGameBeenDeleted, setHasGameBeenDeleted] = useState(false);

  const playCard = () => {
    if (!socket) return;

    socket.emit('play-war-game-card');
  };

  const deleteGame = () => {
    if (!socket) return;

    socket.emit('delete-war-game');
  };

  const topCard = useMemo(() => {
    if (!game?.playerCards || !profile) return;

    const playerCards = game.playerCards[profile.id];
    if (!playerCards || !playerCards.length) return;

    return playerCards[playerCards.length - 1];
  }, [game?.playerCards, profile]);

  useEffect(() => {
    if (!gameId || !socket) return;

    socket.emit('get-war-game');

    socket.on('war-game-not-found', async () => {
      await router.push('/');
    });

    socket.on('war-game-update', (_game: WarGame) => {
      setGame(_game);
    });

    socket.on('war-game-deleted', (_game: WarGame) => {
      setGame(_game);
      setHasGameBeenDeleted(true);
      router.push('/');
    });
  }, [gameId]);

  if (!game) return <p>Loading the game...</p>;
  if (!profile) return <p>Loading the profile...</p>;

  if (Object.keys(game.playerCards).length !== game.maxPlayers)
    return (
      <div className="flex flex-col items-start p-2">
        <p>Connecté sous le pseudo: {profile.username}</p>
        <p>Identifiant de la partie: {game.id}</p>
        <p>
          Nombre de joueurs: {game.players.length + 1} / {game.maxPlayers}
        </p>
      </div>
    );

  return (
    <>
      <p>Connecté sous le pseudo : {profile.username}</p>

      <button className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4 mx-auto" onClick={deleteGame}>
        Supprimer la partie
      </button>

      <div className="flex flex-col justify-center gap-2 flex-wrap">
        <div className="flex justify-center gap-2">
          {[...game.players, game.owner]
            .filter((player) => player.id !== profile.id)
            .map(
              (player) =>
                player.id in game.playedCards &&
                game.playedCards[player.id].map((card, i, arr) => (
                  <div
                    key={card.rank + card.symbol}
                    className={cn(
                      'flex flex-col items-center py-1 w-28 h-40 rounded bg-neutral-200 shadow shadow-black/20',
                      arr.length > 1 && '-mr-8 ',
                      i % 2 && 'bg-neutral-500',
                    )}
                    style={{ zIndex: i }}
                  >
                    {i % 2 === 0 ? (
                      <>
                        <p>{card.rank}</p>
                        <p>{card.symbol}</p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                )),
            )}
        </div>
        <div className="w-40 h-px bg-neutral-700 mx-auto"></div>
        <div className="flex justify-center gap-2">
          {profile.id in game.playedCards &&
            game.playedCards[profile.id].map((card, i, arr) => (
              <div
                key={card.rank + card.symbol}
                className={cn(
                  'flex flex-col items-center py-1 w-28 h-40 rounded bg-neutral-200 shadow shadow-black/20',
                  arr.length > 1 && '-mr-8 ',
                  i % 2 && 'bg-neutral-500',
                )}
                style={{ zIndex: i }}
              >
                {i % 2 === 0 ? (
                  <>
                    <p>{card.rank}</p>
                    <p>{card.symbol}</p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-center gap-2">
          {topCard && (
            <div className="relative flex flex-col items-center py-1 w-28 h-40 rounded bg-neutral-200 shadow">
              <p>{topCard.rank}</p>
              <p>{topCard.symbol}</p>

              <div className="-z-[5] absolute top-2 w-28 h-40 rounded bg-neutral-200 shadow opacity-80"></div>
              <div className="-z-[6] absolute top-4 w-28 h-40 rounded bg-neutral-200 shadow opacity-40"></div>
            </div>
          )}
        </div>

        <button className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4 mx-auto" onClick={playCard}>
          Jouer la carte
        </button>
      </div>
    </>
  );
};

export default WarGamePage;
