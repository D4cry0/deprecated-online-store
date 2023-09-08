
import type { AppProps } from 'next/app';

import '@/styles/globals.scss';
import '../public/assets/fonts/material-icons.min.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  )
}
