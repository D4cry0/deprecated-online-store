import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button, Input, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import { Navbar } from '@/interfaces';
import { logoAltTxt, logoSrc } from '@/services/constants';
import { loginStatus } from '@/services/verifyLogin';

export const NavBar = () => {
    const router = useRouter();
    
    const [lan, setLan] = useState({
        Menu: {
            TEXT: 'Menú'
        },
        Button_1: {
            TEXT: 'Promociones'
        },
        Button_2: {
            TEXT: 'Catálogo'
        },
        Button_3: {
            TEXT: 'Catálogo por códigos'
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
        },
        Search_Bar: {
            PLACEHOLDER: 'Ingresa tu búsqueda ...'
        },
        Button_Search: {
            TEXT: 'Buscar'
        }
    } as Navbar);


    const [sessionStatus, setSessionStatus] = useState(false);


    
    const { locale, pathname, query, asPath } = router;
    
    useEffect(() => {
        const getLocale = async () => {

            try {
                const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
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
                setLan(json.Navbar);
            } catch (error) {
                console.log('Navbar error: ',error);
            }
        };

        getLocale();
    }, [locale]);
    
    useEffect(() => {
        
        const getSessionStatus = async () => {

            setSessionStatus(
                query['e'] === undefined
                ? (await loginStatus( process.env.NEXT_PUBLIC_HOSTURLAPI || '' )) //se necesita un valor true
                : false
            );
        };
        getSessionStatus();
    }, [query]);
    
    const menuNav = [
        {
            label: lan.Button_1.TEXT ,
            route: '/promociones'
        },
        {
            label: lan.Button_2.TEXT,
            route: '/catalogo'
        },
        {
            label: lan.Button_3.TEXT,
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

    return (
        <div className='w-full fixed z-50'>
            <nav className='relative'>
                <div className='absolute bg-white w-full xs:h-[2.8rem] sm:h-[3.1rem] lg:h-[3.9rem]'></div>
                <div className='absolute bg-blue-gray-900 w-full xs:top-[2.8rem] sm:top-[3.1rem]'>
                    
                    <div className='w-full h-[2rem] xs:hidden sm:hidden lg:flex items-center align-middle justify-end'>
                        {
                            menuNav.map( (menu,index) => (
                                    <Link key={`nav-${index}`} href={menu.route} className='text-white font-bold hover:text-lg ease-out transition-all duration-200 px-3'>
                                        {menu.label}
                                    </Link>
                                )
                            )
                        }
                    </div>

                    <div className='w-full h-[2rem] hidden xs:flex sm:flex lg:hidden items-center align-middle justify-end'>
                        <Menu placement="bottom-end">
                            <MenuHandler>
                                <Link href={''} className='text-white font-bold hover:text-base xs:text-sm sm:text-md ease-out transition-all duration-200 px-3'>
                                    {lan.Menu.TEXT}
                                </Link>
                            </MenuHandler>
                            <MenuList className='w-[20rem]'>
                                {
                                    menuNav.map( (menu,index) => (
                                            <MenuItem key={`nav-${index}`}>
                                                <Link key={`nav-${index}`} href={menu.route} className='font-bold xs:text-xs sm:text-sm px-3'>
                                                    {menu.label}
                                                </Link>
                                            </MenuItem>
                                        )
                                    )
                                }
                                
                                {/* <MenuItem>
                                    <div className='flex justify-center items-center px-2 text-lg mr-3'>
                                        <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'en'} >
                                            <small>En</small>
                                        </Link>
                                        <small>&nbsp;|&nbsp;</small>
                                        <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'zh'} >
                                            <small>Zh</small>
                                        </Link>
                                        <small>&nbsp;|&nbsp;</small>
                                        <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'es'} >
                                            <small>Es</small>
                                        </Link>
                                    </div>
                                </MenuItem> */}

                            </MenuList>
                        </Menu>

                        
                        {
                            !sessionStatus &&     
                            <Button 
                                variant='text'
                                className='text-white hover:text-red-500 ease-out transition-all duration-500 border-none flex items-center' 
                                size='sm'
                                onClick={ () => {router.push(`/login?p=${pathname}`)} } 
                            >
                                <i className='material-icons-outlined'>person_outline</i>
                                <small className='text-1rem ps-2'>{lan.Button_Login.TEXT}</small>
                            </Button>
                        }

                        {
                            sessionStatus &&
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                        <Button 
                                            variant="text"
                                            className='text-sky-200 hover:text-white ease-out transition-all duration-500 border-none flex items-center' 
                                            size='sm'
                                        >
                                            <i className='material-icons-outlined'>manage_accounts</i>
                                            <small className='text-1rem ps-2'>{sessionStatus}</small>
                                        </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>        
                                        <Link 
                                            className='w-full text-sky-500 hover:text-black ease-out transition-all duration-500 border-none flex items-center' 
                                            href={'/account'} 
                                        >
                                            <i className='material-icons-outlined'>settings</i>
                                            <small className='text-1rem ps-2'>{lan.Button_User_Settings.TEXT}</small>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>        
                                        <Link 
                                            className='w-full text-red-600 hover:text-black ease-out transition-all duration-500 border-none flex items-center' 
                                            href={'/logout'} 
                                        >
                                            <i className='material-icons-outlined'>person_off</i>
                                            <small className='text-1rem ps-2'>{lan.Button_Logout.TEXT}</small>
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        }
                    </div>
                </div>
                <div className='absolute bg-transparent flex flex-row w-full xs:h-[2.2rem] sm:h-[2.2rem] lg:h-[3rem] pt-4'>
                    <Link href={'/'}>
                        <Image src={logoSrc} alt={logoAltTxt} priority className='absolute drop-shadow-md xs:px-1 sm:px-5 xs:top-5 xs:h-[35px] sm:h-[48px] lg:h-[66px]  w-auto ' />
                    </Link>

                        <div className='w-full pb-3 flex items-center justify-end'>
                            <div className='relative flex xs:w-[14rem] sm:w-[15rem] md:w-[20rem] mdl:w-[25rem] lg:w-[30rem] xl:w-[40rem]'>
                                <Input
                                    type='text'
                                    placeholder={lan.Search_Bar.PLACEHOLDER}
                                    color='black'
                                    variant='standard'
                                    className='font-bold'
                                    containerProps={{
                                        className: 'min-w-0 ',
                                    }}
                                    
                                />
                                <Button
                                    size='sm'
                                    variant='text'
                                    className='!absolute right-1 top-1 rounded flex items-center text-black'
                                    disabled={true}
                                >
                                    <i className='material-icons-outlined'>search</i>
                                    <span className='xs:hidden sm:hidden md:block'>{lan.Button_Search.TEXT}</span>
                                </Button>
                            </div>
                        </div>

                        <div className='ml-3 xs:w-full sm:w-full lg:w-[30%] xl:w-[20%] flex flex-row xs:pb-2 sm:pb-3 items-center justify-end lg:flex sm:hidden xs:hidden'>

                            {
                                !sessionStatus &&     
                                <Button 
                                    variant='text'
                                    className='text-black hover:text-red-500 ease-out transition-all duration-500 border-none flex items-center' 
                                    size='sm'
                                    onClick={ () => {router.push(`/login?p=${pathname}`)} } 
                                >
                                    <i className='material-icons-outlined'>person_outline</i>
                                    <small className='text-1rem ps-2'>{lan.Button_Login.TEXT}</small>
                                </Button>
                            }

                            {
                                sessionStatus &&
                                <Menu placement="bottom-end">
                                    <MenuHandler>
                                            <Button 
                                                variant="text"
                                                className='text-sky-600 hover:text-red-500 ease-out transition-all duration-500 border-none flex items-center' 
                                                size='sm'
                                            >
                                                <i className='material-icons-outlined'>manage_accounts</i>
                                                <small className='text-1rem ps-2'>{sessionStatus}</small>
                                            </Button>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem>        
                                            <Link 
                                                className='w-full text-sky-500 hover:text-black ease-out transition-all duration-500 border-none flex items-center' 
                                                href={'/account'} 
                                            >
                                                <i className='material-icons-outlined'>settings</i>
                                                <small className='text-1rem ps-2'>{lan.Button_User_Settings.TEXT}</small>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>        
                                            <Link 
                                                className='w-full text-red-600 hover:text-black ease-out transition-all duration-500 border-none flex items-center' 
                                                href={'/logout'} 
                                            >
                                                <i className='material-icons-outlined'>person_off</i>
                                                <small className='text-1rem ps-2'>{lan.Button_Logout.TEXT}</small>
                                            </Link>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            }

                            {/* <div className='flex justify-center items-center px-2 text-black text-lg mr-3'>
                                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'en'} >
                                    <small>En</small>
                                </Link>
                                <small>&nbsp;|&nbsp;</small>
                                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'zh'} >
                                    <small>Zh</small>
                                </Link>
                                <small>&nbsp;|&nbsp;</small>
                                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'es'} >
                                    <small>Es</small>
                                </Link>
                            </div> */}
                        </div>
                </div>
            </nav>
        </div>
    )
}