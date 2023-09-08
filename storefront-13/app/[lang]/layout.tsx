import '../globals.css';
import React, { Suspense } from 'react';

import { Footer } from '../_components/Footer';
import { NavBar } from '../_components/NavBar';
import Loading from './loading';
import ClientProviders from './provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <head>
        <title>Empresa</title>
        <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css'
            integrity='sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=='
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
      </head>
      <body>
        <ClientProviders>
            <NavBar />
              {children}
            <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
