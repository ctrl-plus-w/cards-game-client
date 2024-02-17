import React, { createContext, useContext, useEffect, useState } from 'react';

import { useSocket } from '@/context/socket';

import { Player } from '@/type/socket';

interface IContextType {
  profile: Player | null;
  setProfile: (profile: Player | null) => Player | null;
}

const defaultValue: IContextType = {
  profile: null,
  setProfile: () => null,
};

export const ProfileContext = createContext<IContextType>(defaultValue);

export const useProfile = () => useContext(ProfileContext);

interface IProps {
  children?: React.ReactNode;
}

const ProfileContextProvider = ({ children }: IProps) => {
  const socket = useSocket();

  const [profile, _setProfile] = useState<Player | null>(null);

  useEffect(() => {
    if (!socket) return;

    const id = localStorage.getItem('id');
    const username = localStorage.getItem('username');

    if (!id || !username) return;

    const _profile = { id, username };

    socket.emit('set-profile', _profile);
    _setProfile(_profile);
  }, [socket]);

  const setProfile = (player: Player | null) => {
    if (player) {
      localStorage.setItem('id', player.id);
      localStorage.setItem('username', player.username);
    }

    _setProfile(player);
    return player;
  };

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
};

export default ProfileContextProvider;
