'use client'

import React, { use } from 'react';
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { useSession } from 'next-auth/react';

import { Button } from '@material-tailwind/react';

import { logoSrc, logoAltTxt } from '../_lib/constants';
import { Navbar } from '../_interfaces';


const useGetLocale = async (): Promise<Navbar> => {
    const lang = useParams().lang;

    try {
        const data = await fetch(`${process.env.HOSTURL}/api/v1/locales/${lang}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sections: [
                    'Navbar'
                ]
            })
        });
        const json = await data.json();
        return json.Navbar;
    } catch (error) {
        return {
            Button_1: {
                TEXT: 'PROMOCIONES'
            },
            Button_2: {
                TEXT: 'CÁTALOGO'
            },
            Button_3: {
                TEXT: 'CÁTALOGO POR PRODUCTOS'
            },
            Button_4: {
                TEXT: ''
            },
            Button_5: {
                TEXT: ''
            },
            Button_User_Settings: {
                TEXT: 'Cuenta'
            },
            Button_Login: {
                TEXT: 'Entrar'
            },
            Button_Logout: {
                TEXT: 'Salir'
            }
        }
    }
};

export const NavBar = () => {
    const router = useRouter();
    const { data, status } = useSession();
    const path = usePathname();
    const query = useSearchParams().toString();
    const pathname = usePathname()
    const lang = useParams().lang;

    const locale = use(useGetLocale());

    // TODO: locales y activeLocale in a select menu
    // const { locales, locale: activeLocale, pathname, query, asPath } = router;
    
    const menuNav = [
        {
            label: locale.Button_1.TEXT ,
            route: '/promociones'
        },
        {
            label: locale.Button_2.TEXT,
            route: '/catalogo'
        },
        {
            label: locale.Button_3.TEXT,
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
            label: locale.Button_User_Settings,
            route: '/account'
        }
    }


    return (
        <>
            <nav className='relative z-50'>
                <div className='absolute bg-black opacity-80 w-full xs:h-[2.4rem] sm:h-[3.1rem] md:h-[3.9rem]'></div>
                <div className='absolute bg-transparent flex flex-row w-full xs:h-[1.8rem] sm:h-[2.2rem] md:h-[3rem] pt-4'>
                    <Link href={'/'}>
                        <Image src={logoSrc} alt={logoAltTxt} priority className='absolute drop-shadow-md px-5 xs:h-[33px] sm:h-[50px] md:h-[68px]  w-auto ' />
                    </Link>

                        <div className='w-full pb-3 md:flex sm:hidden xs:hidden items-center justify-end'>
                            {
                                menuNav.map( (menu,index) => (
                                        <Link key={`nav-${index}`} href={menu.route} className='text-white font-bold hover:text-lg ease-out transition-all duration-200 px-3'>
                                            {menu.label}
                                        </Link>
                                    )
                                )
                            }
                        </div>

                        <div className='xs:w-full sm:w-full md:w-[20%] flex flex-row pb-3 items-center justify-end'>

                            {
                                !(status === 'authenticated') &&     
                                <Button 
                                    className='mx-8 bg-red-500 hover:bg-indigo-500 ease-out transition-all duration-500 border-none flex items-center' 
                                    size='sm'
                                    onClick={ () => {router.push(`/login?p=${path}`)} } 
                                >
                                    <i className='material-icons-outlined'>person_outline</i>
                                    <small className='text-1rem ps-2'>{locale.Button_Login.TEXT}</small>
                                </Button>
                            }
                            {/* {
                                status === 'authenticated' &&
                                <Button icon='pi pi-cog' className='text-[2rem] hover:font-bold ease-out transition-all duration-200' text onClick={ () => {router.push(adminNav.userSettings.route)} }>
                                    <small className='text-1rem ps-2'>{adminNav.userSettings.label}</small>
                                </Button>
                            }
                            {
                                status === 'authenticated' &&
                                <Button icon='pi pi-user' className='text-[2rem] hover:font-bold ease-out transition-all duration-200' outlined severity='danger' onClick={ () => {router.push('/logout')} }>
                                    <small className='text-1rem ps-2'>Logout</small>
                                </Button>
                            } */}
                            <div className='flex justify-center items-center px-2 text-white text-lg mr-3'>
                                <Link className='hover:font-bold ease-out transition-all duration-200' replace={false} href={{ pathname, query }} locale={'en'} >
                                    <small>EN</small>
                                </Link>
                                <small>&nbsp;|&nbsp;</small>
                                <Link className='hover:font-bold ease-out transition-all duration-200' replace={false} href={{ pathname, query }} locale={'zh'} >
                                    <small>ZH</small>
                                </Link>
                                <small>&nbsp;|&nbsp;</small>
                                <Link className='hover:font-bold ease-out transition-all duration-200' replace={false} href={{ pathname, query }} locale={'es'} >
                                    <small>ES</small>
                                </Link>
                            </div>
                        </div>
                </div>
            </nav>
        </>
    )
}