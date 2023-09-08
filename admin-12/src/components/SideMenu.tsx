import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { Chip } from '@material-tailwind/react';
import { logoAltTxt, logoSrc } from '@/services/constants';
import { loginStatus } from '@/services/verifyLogin';

export const SideMenu = () => {

    const [ loginName, setLoginName ] = useState('')
    const router = useRouter();
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
                // setLan(json.Navbar);
            } catch (error) {
                console.log('Navbar error: ',error);
            }
        };

        getLocale();
    }, [locale]);

    useEffect(() => {
        const verifySession = async () => {
            const val = await loginStatus( process.env.NEXT_PUBLIC_HOSTURLAPI || '' ) //se necesita un valor true

            setLoginName( val ? val : '' );
        };

        verifySession();
    }, []);
    
    return (
        pathname !== `/login` && pathname !== '/logout' ?
        <div className='col-span-2 flex flex-col gap-2 mx-4'>

            <div className='flex items-center justify-center w-full'>
                <Image src={logoSrc} alt={logoAltTxt} width={0} height={60} sizes='100vw' className='h-14 m-2' />
            </div>
            
            <div className='h-2rem' />
            
            {/* <div className='flex justify-center items-center px-2 text-lg mr-3'>
                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'en'} >
                    <small>EN</small>
                </Link>
                <small>&nbsp;|&nbsp;</small>
                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'zh'} >
                    <small>ZH</small>
                </Link>
                <small>&nbsp;|&nbsp;</small>
                <Link className='hover:font-bold ease-out transition-all duration-200' href={{ pathname, query }} as={asPath} locale={'es'} >
                    <small>ES</small>
                </Link>
            </div> */}

            <div className='h-2rem' />


            {/* <h6 className='text-uppercase fs-4 text-start mx-3'>ALMACEN</h6> */}

            <Chip size='lg' value={ process.env.NEXT_PUBLIC_APPVERSION || 'Unversioned' } className='flex m-0 px-9 text-lg bg-transparent text-black' 
                icon={<i className='material-icons text-sky-500 mx-3'>info</i> } />

            <Chip size='lg' value={ loginName } color='light-green' className='flex m-0 px-9 text-lg bg-transparent text-black' 
                icon={<i className='material-icons text-green-800 mx-3'>cloud</i> } />
                

            <div className='h-2rem' />
            <Link href={'/'} className='flex align-items-center w-full p-2 hover:bg-blue-gray-300 rounded-md'>
                <i className='material-icons mx-3'>home</i>
                <span className='text-start w-full'>Inicio</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            <Link href={`/customers`} className='flex align-items-center w-full p-2 hover:bg-blue-gray-300 rounded-md'>
                <i className='material-icons mx-3'>people</i>
                <span className='text-start w-full'>Clientes</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            <Link href={`/assets-manager`} className='flex align-items-center w-full p-2 hover:bg-blue-gray-300 rounded-md'>
                <i className='material-icons mx-3'>perm_media</i>
                <span className='text-start w-full'>Multimedia</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            <Link href={`https://server.com`} className='flex align-items-center w-full p-2 hover:bg-blue-gray-300 rounded-md'>
                <i className='material-icons mx-3'>autorenew</i>
                <span className='text-start w-full'>Ruta</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            <Link href={`/logout`} className='flex align-items-center w-full p-2 hover:bg-blue-gray-300 rounded-md'>
                <i className='material-icons mx-3'>logout</i>
                <span className='text-start w-full'>Logout</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            {/* <Link href={'/admin'} className='btn d-flex align-items-center w-100 p-0 m-0'>
                <i className='material-icons mx-3'>contacts</i>
                <span className='text-start w-100'>Clientes</span>
                <i className='material-icons'>chevron_right</i>
            </Link> */}
        </div>
        : <></>
    )
}
