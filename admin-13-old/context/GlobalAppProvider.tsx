import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { StoreNav, Footer } from '@/templates/modules';
import { GlobalAppContext, SysUser } from './GlobalAppContext';
import { globalappReducer } from './globalAppReducer';
import { getLocale } from '@/locales/locales';
import { StaticImageData } from 'next/image';

import logoSrc from '../../public/assets/img/logo.png';
const logoAltTxt = 'Logo';

export interface GlobalAppState {
    user: SysUser;
    logoSrc: StaticImageData;
    logoAltTxt: string;
}

const GlobalApp_INITIAL_STATE: GlobalAppState = {
    user: {
        login_name: '',
        status: '',
        roles: [],
    },
    logoSrc: logoSrc,
    logoAltTxt: logoAltTxt
}

interface Props {
    children: ReactNode
}

export const GlobalAppProvider: FC<Props> = ({ children }) => {

    const {locale} = useRouter();
    const menuNav = [
        {
            label: getLocale(locale || '').UINavMenu.BUTTON_1 ,
            route: '/promociones'
        },
        {
            label: getLocale(locale || '').UINavMenu.BUTTON_2,
            route: '/catalogo'
        },
        {
            label: getLocale(locale || '').UINavMenu.BUTTON_3,
            route: '/catalogo/images'
        },
        // {
        //     label: getLocale(locale || '').UINavMenu.BUTTON_4,
        //     route: '/servicios'
        // },
        // {
        //     label: getLocale(locale || '').UINavMenu.BUTTON_5,
        //     route: '/nosotros'
        // },
    ];

    const adminNav = {
        userSettings: {
            label: getLocale(locale || '').UINavMenu.BUTTON_USER_SETTINGS,
            route: '/account'
        }
    }
    
    const [state, dispatch] = useReducer( globalappReducer, GlobalApp_INITIAL_STATE );
    const { data, status } = useSession();
    const currentPath = useRouter().asPath;
    const showStoreNav = currentPath.match(/^\/(admin|login|logout|controlapi)(\/.*)?/g);

    // Methods with dispatch

    // const setButtonsPlaceholders = (btnPalceholders: BtnMenu) => {
    //     dispatch({ type: '[SET-BTN]', payload: btnPalceholders });
    // }

    useEffect(() => {
        if( status === 'authenticated'){
            dispatch({ type: '[AUTH] - Login', payload: data?.user as unknown as SysUser});
        }
    }, [status, data]);

    return (
        <GlobalAppContext.Provider value={{
            ...state,
            logoSrc,
            logoAltTxt
            // Methods with dispatch reference
            
        }}>
            {
                !showStoreNav && 
                <StoreNav
                    currentPath={currentPath}
                    loginPath={'/login'}
                    logoutPath={'/logout'}
                    menuNav={menuNav}
                    adminNav={adminNav}
                    isSession={status === 'authenticated'}
                />
            }
            { children }
            {
                !showStoreNav && 
                <Footer />
            }
        </GlobalAppContext.Provider>
    )
};


