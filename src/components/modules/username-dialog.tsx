import React, { FormEventHandler, useState } from 'react';

import { uuid } from 'uuidv4';

import { useProfile } from '@/context/profile';
import { useSocket } from '@/context/socket';

import { cn } from '@/util/style.util';

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

const UsernameDialog = ({ className }: IProps) => {
  const socket = useSocket();

  const { setProfile } = useProfile();

  const [username, setUsername] = useState('');

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (!socket) {
      console.error('Socket not available');
      return;
    }

    const id = uuid();

    await socket.emit('create-profile', { id, username });

    setProfile({ id, username });
  };

  return (
    <form className={cn('flex flex-col items-start p-2', className)} onSubmit={onSubmit}>
      <label htmlFor="username" className="mb-1">
        Nom d&apos;utilisateur
      </label>
      <input
        className="border boder-neutral-300 rounded-md px-2 py-1"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Jack"
      />

      <button className="bg-neutral-800 text-white px-4 py-1 rounded-md mt-4">Valider</button>
    </form>
  );
};

export default UsernameDialog;
