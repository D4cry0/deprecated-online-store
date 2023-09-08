"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";

type Props = {
  children?: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
    return (
      <ThemeProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ThemeProvider>
    );
};