import type { ReactElement } from 'react';
import React from 'react';

import UsernameDialog from '@/module/username-dialog';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

const HomePage = (): ReactElement => {
  const socket = useSocket();
  const { profile, setProfile } = useProfile();

  const createWarGame = async () => {
    if (!socket || !profile) return;

    await socket.emit('create-war-game');
  };

  const logout = async () => {
    if (!socket || !profile) return;

    await socket.emit('delete-profile', profile);
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
    </div>
  );
};

export default HomePage;
