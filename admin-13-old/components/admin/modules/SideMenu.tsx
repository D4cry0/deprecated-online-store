import React, { FC } from 'react';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { Badge } from 'primereact/badge';

interface Props {
    logo: StaticImageData;
    logoHeight: number;
    alt?: string;
    loginName: string;
    appVersion: string;
}

export const SideMenu: FC<Props> = ({ logo, logoHeight, alt = '', loginName, appVersion = 'no version' }: Props) => {

    return (
        <div className='flex flex-col gap-2 mx-1'>
            <Image className='m-2' src={logo} alt={alt} height={logoHeight} />
            
            <div className='h-2rem' />

            {/* <h6 className='text-uppercase fs-4 text-start mx-3'>ALMACEN</h6> */}

            <Badge size='large' className='flex justify-content-start align-items-center m-0 p-0 text-lg'>
                <i className='pi-info text-gray-800 mx-3'></i> { appVersion }
            </Badge>
            <Badge size='large' className='flex justify-content-start align-items-center m-0 p-0 text-lg'>
                <i className='pi-cloud text-green-400 mx-3'></i> { loginName }
            </Badge>

            <div className='h-2rem' />
            <Link href={'/admin'} className='flex align-items-center w-full p-0 m-0 p-button'>
                <i className='material-icons mx-3'>home</i>
                <span className='text-start w-full'>Inicio</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            <Link href={'/exchange'} className='flex align-items-center w-full  p-0 m-0 p-button'>
                <i className='material-icons mx-3'>autorenew</i>
                <span className='text-start w-full'>Exchange</span>
                <i className='material-icons'>chevron_right</i>
            </Link>
            {/* <Link href={'/admin'} className='btn d-flex align-items-center w-100 p-0 m-0'>
                <i className='material-icons mx-3'>contacts</i>
                <span className='text-start w-100'>Clientes</span>
                <i className='material-icons'>chevron_right</i>
            </Link> */}
        </div>
    )
}
