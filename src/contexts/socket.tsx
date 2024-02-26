import React, { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface IProps {
  children?: React.ReactNode;
}

const SocketContextProvider = ({ children }: IProps) => {
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    setSocket(socket);

    socket.on('join-war-game', async (gameId: string) => {
      await router.push(`/war-game/${gameId}`);
    });

    socket.on('join-take-6-game', async (gameId: string) => {
      await router.push(`/take-6-game/${gameId}`);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketContextProvider;
