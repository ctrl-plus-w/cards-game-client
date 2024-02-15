import type { AppProps } from 'next/app';

import '@/style/globals.css';

import ProfileContextProvider from '@/context/profile';
import SocketContextProvider from '@/context/socket';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <ProfileContextProvider>
        <Component {...pageProps} />
      </ProfileContextProvider>
    </SocketContextProvider>
  );
}
