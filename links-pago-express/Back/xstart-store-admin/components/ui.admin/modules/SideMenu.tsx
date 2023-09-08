import React, { FC } from 'react';

import Image from 'next/image';

import { Badge, Button, Stack } from 'react-bootstrap';

interface Props {
    logo: string;
    logoHeight: number;
    alt?: string;
}

export const SideMenu: FC<Props> = ({ logo, logoHeight, alt = '' }: Props) => {

    return (
        <Stack direction='vertical' gap={2} className='mx-1'>
            <Image src={logo} alt={alt} height={logoHeight} />
            
            <div style={{height: '25px'}} />

            <h6 className="text-uppercase fs-4 text-start mx-3">ALMACEN</h6>

            <Badge pill bg='light' text='success' className='fs-6 d-flex justify-content-start align-items-center m-0 p-0'>
                <i className="material-icons text-success mx-3">cloud</i> ACORBA 
            </Badge>

            <div style={{height: '25px'}} />
            <Button variant='' type='button' className='d-flex align-items-center w-100 p-0 m-0'>
                <i className="material-icons mx-3">home</i>
                <span className="text-start w-100">Inicio</span>
                <i className="material-icons">chevron_right</i>
            </Button>
            <Button variant='' type='button' className='d-flex align-items-center w-100 p-0 m-0'>
                <i className="material-icons mx-3">attach_money</i>
                <span className="text-start w-100">Ordenes</span>
                <i className="material-icons">chevron_right</i>
            </Button>
            <Button variant='' type='button' className='d-flex align-items-center w-100 p-0 m-0'>
                <i className="material-icons mx-3">contacts</i>
                <span className="text-start w-100">Clientes</span>
                <i className="material-icons">chevron_right</i>
            </Button>
        </Stack>
    )
}
