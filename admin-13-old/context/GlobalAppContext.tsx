import { StaticImageData } from 'next/image';
import { createContext } from 'react';

interface ContextProps {
    user: SysUser;
    logoSrc: StaticImageData;
    logoAltTxt: string;
    // Methods provider's definitions
}

export interface SysUser {
    login_name: string;
    status: string;
    roles: string[];
}

export const GlobalAppContext = createContext({} as ContextProps);