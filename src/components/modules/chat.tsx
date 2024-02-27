import React, { useState } from 'react';

import { useSocket } from '@/context/socket';

import Take6Game from '@/class/Take6Game';
import WarGame from '@/class/WarGame';

import { cn } from '@/util/style.util';

interface IProps {
  game: Take6Game | WarGame | null;

  sendEvent: string;

  className?: string;
}

interface IMessagesProps {
  game: Take6Game | WarGame;
}

const Messages = ({ game }: IMessagesProps) => {
  return (
    <div className="flex flex-col gap-1 h-full mb-2">
      {game.messages.map(({ message, player }, i) => (
        <p key={i}>
          <strong>{player.username}:</strong> {message}
        </p>
      ))}
    </div>
  );
};

const Chat = ({ game, sendEvent, className }: IProps) => {
  const socket = useSocket();

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!socket) return;

    socket.emit(sendEvent, { message });
  };

  return (
    <div className={cn('h-full border border-neutral-400 p-1 flex flex-col rounded', className)}>
      {game ? <Messages game={game} /> : <></>}

      <div className="flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Bonjour..."
          className="border border-neutral-800 px-2 py-1 rounded"
        />

        <button onClick={sendMessage} className="bg-neutral-800 text-white px-4 py-1 rounded-md">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
