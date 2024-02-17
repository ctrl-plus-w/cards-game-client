import type { ReactElement } from 'react';
import React, { useState } from 'react';

import UsernameDialog from '@/module/username-dialog';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

const HomePage = (): ReactElement => {
  const socket = useSocket();
  const { profile, setProfile } = useProfile();

  const [gameId, setGameId] = useState('');

  const createWarGame = async () => {
    if (!socket || !profile) return;

    socket.emit('create-war-game', {
      owner: profile,
      maxPlayers: 2,
    });
  };

  const logout = async () => {
    if (!socket || !profile) return;

    socket.emit('delete-profile', profile);
    setProfile(null);
  };

  if (!profile) return <UsernameDialog />;

  return (
    <div>
      <button onClick={logout} className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4">
        Se déconnecter
      </button>

      <p>{profile.username}</p>

      <button onClick={createWarGame} className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4">
        Créer une partie de bataille
      </button>

      <div className="flex flex-col items-start mt-9">
        <input value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="gameId" />
        <button
          onClick={() => socket && socket.emit('join-war-game', { gameId })}
          className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4"
        >
          Rejoindre une partie
        </button>
      </div>
    </div>
  );
};

export default HomePage;
