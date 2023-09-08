import '../styles/global.css';

import type { AppProps } from 'next/app';

import { ThemeProvider } from "@material-tailwind/react";
import { NavBar } from '@/components';


export default function App({ Component,  pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <ThemeProvider>
        <NavBar />
        <Component {...pageProps} />
    </ThemeProvider>
  )
}