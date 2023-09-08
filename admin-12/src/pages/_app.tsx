import '../styles/global.css';

import type { AppProps } from 'next/app';

import { ThemeProvider } from "@material-tailwind/react";

import { SideMenu } from '@/components';


export default function App({ Component,  pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <ThemeProvider>
      <div className='grid grid-cols-12 grid-rows-1 m-0 p-0 w-full min-h-screen'>
        <SideMenu />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}