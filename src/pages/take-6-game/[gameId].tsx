import React, { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Chat from '@/module/chat';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

import Take6Game from '@/class/Take6Game';

import { isDefined, lastEl } from '@/util/array.util';
import { calculateBeefHead } from '@/util/game.util';
import { cn } from '@/util/style.util';

const Take6GamePage = () => {
  const router = useRouter();
  const socket = useSocket();

  const { profile } = useProfile();

  const { gameId } = router.query;

  const [messages, setMessages] = useState<{ playerId: string; message: string }[]>([]);
  const [game, setGame] = useState<Take6Game | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [_hasGameBeenDeleted, setHasGameBeenDeleted] = useState(false);

  const shouldSelectColumnToReplace = useMemo(() => {
    if (!profile || !game) return false;

    if (Object.keys(game.playedCard).length !== game.maxPlayers) return false;
    if (!(profile.id in game.playedCard)) return false;
    if (!game.playedCard[profile.id]) return false;

    const minPlayableCard = Math.min(
      ...Object.values(game.columns)
        .map((column) => lastEl(column))
        .filter(isDefined)
        .map((card) => card.rank),
    );

    const minPlayedCard = Math.min(
      ...Object.values(game.playedCard)
        .filter(isDefined)
        .map((card) => card.rank),
    );

    const cardRank = game.playedCard[profile.id].rank;
    return cardRank < minPlayableCard && cardRank === minPlayedCard;
  }, [profile, game]);

  const playCard = () => {
    if (!socket || !selectedCard) return;

    socket.emit('play-take-6-game-card', { rank: selectedCard });
  };

  const setColumnToReplace = (column: number) => () => {
    if (!socket) return;

    socket.emit('set-column-to-replace-take-6-game', { column });
  };

  const updateGame = (_game: Take6Game) => {
    setGame(_game);

    if (profile && profile.id in _game.playedCard && _game.playedCard[profile.id])
      setSelectedCard(_game.playedCard[profile.id].rank);
  };

  useEffect(() => {
    if (!gameId || !socket) return;

    socket.emit('get-take-6-game');

    socket.on('take-6-game-not-found', async () => {
      await router.push('/');
    });

    socket.on('take-6-game-update', updateGame);

    socket.on('take-6-game-deleted', (_game: Take6Game) => {
      setGame(_game);
      setHasGameBeenDeleted(true);
    });
  }, [gameId]);

  if (!game) return <p>Loading the game...</p>;
  if (!profile) return <p>Loading the profile...</p>;

  if (Object.keys(game.playerCards).length !== game.maxPlayers)
    return (
      <div className="flex p-2 gap-2">
        <div className="flex flex-col items-start">
          <p>Connecté sous le pseudo: {profile.username}</p>
          <p>Identifiant de la partie: {game.id}</p>
          <p>
            Nombre de joueurs: {game.players.length + 1} / {game.maxPlayers}
          </p>
        </div>

        <Chat game={game} sendEvent="send-take-6-message" className="ml-auto" />
      </div>
    );

  if (game.isFinished) {
    return (
      <div className="flex flex-col items-start p-2">
        <h1>Fin de la partie.</h1>

        <div className="flex flex-col gap-2">
          {Object.keys(game.playerPickedCards).map((id) => {
            const player = game.players.find((p) => p.id === id);
            if (!player) return <></>;

            const summedCards = game.playerPickedCards[id].reduce((acc, curr) => acc + calculateBeefHead(curr), 0);

            return (
              <p key={id}>
                {player.username} : {summedCards} tête(s) de boeuf
              </p>
            );
          })}
        </div>

        <Link href="/">Retourner à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full p-2">
      <div className="flex flex-col">
        <p>Connecté sous le pseudo : {profile.username}</p>

        <p>
          {selectedCard &&
            selectedCard <
              Math.min(
                ...Object.values(game.columns)
                  .map((column) => lastEl(column))
                  .filter(isDefined)
                  .map((card) => card.rank),
              )}
        </p>

        <div className="flex gap-4 mx-auto mb-8">
          {game.columns.map((col, i) => (
            <div className="flex flex-col-reverse items-center justify-start gap-2" key={i}>
              {shouldSelectColumnToReplace ? (
                <button onClick={setColumnToReplace(i)}>Colonne {i + 1}</button>
              ) : (
                <p>Colonne {i + 1}</p>
              )}
              {col.map((card) => (
                <div
                  className={cn('relative flex flex-col items-start p-1 w-28 h-40', 'rounded bg-neutral-200 shadow')}
                  key={card.rank}
                >
                  <p>{card.rank}</p>

                  <p>{calculateBeefHead(card)} tête(s) de boeuf</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {shouldSelectColumnToReplace && (
          <p className="mx-auto mb-4 text-red-600">
            Veuillez sélectionner une colonne par laquelle remplacer votre carte.
          </p>
        )}

        {game.playedCard[profile.id] && (
          <div className="relative flex justify-center items-center p-1 w-28 h-40 mx-auto rounded bg-neutral-200 shadow mb-4 text-3xl">
            {game.playedCard[profile.id].rank}
          </div>
        )}

        <div className="flex items-center mx-auto transform -translate-x-6 mt-auto">
          {game.playerCards[profile.id].filter(isDefined).map((card) => (
            <button
              className={cn(
                'relative flex flex-col items-start p-1 w-28 h-40 -ml-12',
                'rounded bg-neutral-200 shadow',
                'transform translate-x-12',
                selectedCard === card.rank && 'bg-neutral-400 shadow-xl',
              )}
              onClick={() => setSelectedCard(card.rank)}
              key={card.rank}
            >
              {card.rank}
            </button>
          ))}
        </div>

        <button className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4 mx-auto" onClick={playCard}>
          Jouer la carte
        </button>
      </div>

      <Chat game={game} sendEvent="send-take-6-message" className="ml-auto" />
    </div>
  );
};

export default Take6GamePage;
