import type { ReactElement } from 'react';
import React, { useState } from 'react';

import UsernameDialog from '@/module/username-dialog';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

const HomePage = (): ReactElement => {
  const socket = useSocket();
  const { profile, setProfile } = useProfile();

  const [warGameId, setWarGameId] = useState('');
  const [take6GameId, setTake6GameId] = useState('');
  const [take6MaxPlayers, setTake6MaxPlayers] = useState<number | null>(2);

  const createWarGame = async () => {
    if (!socket || !profile) return;

    socket.emit('create-war-game', {
      owner: profile,
      maxPlayers: 2,
    });
  };

  const createTake6Game = async () => {
    if (!socket || !profile) return;

    socket.emit('create-take-6-game', {
      owner: profile,
      maxPlayers: take6MaxPlayers ?? 2,
    });
  };

  const logout = async () => {
    if (!socket || !profile) return;

    socket.emit('delete-profile', profile);
    setProfile(null);
  };

  if (!profile) return <UsernameDialog />;

  return (
    <div className="flex flex-col items-start p-2 gap-2">
      <button onClick={logout} className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4">
        Se déconnecter
      </button>

      <p>{profile.username}</p>

      <div className="flex flex-col items-start gap-2 p-2 border border-neutral-400 rounded">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Jeu de la bataille</h2>

          <button onClick={createWarGame} className="bg-neutral-800 text-white px-4 py-1 rounded-md">
            Créer une partie de bataille
          </button>
        </div>

        <p className="">
          On distribue les 52 cartes aux joueurs (la bataille se joue généralement à deux) qui les rassemblent face
          cachée en paquet devant eux. Chacun tire la carte du dessus de son paquet et la pose face visible sur la
          table. Celui qui a la carte la plus forte ramasse les autres cartes.
        </p>

        <div className="flex items-center mt-9 gap-2">
          <input
            value={warGameId}
            onChange={(e) => setWarGameId(e.target.value)}
            placeholder="gameId"
            className="border border-neutral-800 px-2 py-1 rounded"
          />
          <button
            onClick={() => socket && socket.emit('join-war-game', { gameId: warGameId })}
            className="bg-neutral-800 text-white px-4 py-1 rounded-md"
          >
            Rejoindre une partie de bataille
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 p-2 border border-neutral-400 rounded">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Jeu du 6 qui prend</h2>

          <button onClick={createWarGame} className="bg-neutral-800 text-white px-4 py-1 rounded-md">
            Créer une partie de 6 qui prend
          </button>
        </div>

        <p className="">
          A chaque tour, les joueurs choisissent une carte et la révèlent à tous en même temps : ces cartes sont
          ajoutées à l&apos;une des 4 séries qui se forment sur la table. Celui qui doit jouer la sixième carte
          d&apos;une série «récolte» les 5 premières... et toutes leurs têtes de boeufs !
        </p>

        <div className="flex items-center mt-9 gap-2">
          <input
            value={take6MaxPlayers ?? ''}
            onChange={(e) =>
              setTake6MaxPlayers(isNaN(+e.target.value) ?? e.target.value === '' ? null : +e.target.value)
            }
            type="number"
            placeholder="Nombre de joueurs"
            className="border border-neutral-800 px-2 py-1 rounded"
          />
          <button onClick={createTake6Game} className="bg-neutral-800 text-white px-4 py-1 rounded-md">
            Créer une partie de 6 qui prend
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={take6GameId}
            onChange={(e) => setTake6GameId(e.target.value)}
            placeholder="gameId"
            className="border border-neutral-800 px-2 py-1 rounded"
          />
          <button
            onClick={() => socket && socket.emit('join-take-6-game', { gameId: take6GameId })}
            className="bg-neutral-800 text-white px-4 py-1 rounded-md"
          >
            Rejoindre une partie de 6 qui prend
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
