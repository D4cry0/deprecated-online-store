'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardBody, CardFooter, CardHeader, ThemeProvider, Typography } from '@material-tailwind/react';

export default function RootBody() {
    return (
        <ThemeProvider>
            <div className='grid xl:grid-cols-3 xl:px-28 justify-center md:scale-90'>
                <Card className='m-5 border-4 border-red-500'>
                    <CardBody className='h-full'>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
                <Card className='m-5 border-4 border-red-500'>
                    <CardBody className='h-full'>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
                <Card className='m-5 border-4 border-red-500'>
                    <CardBody className='h-full'>
                    </CardBody>
                </Card>
            </div>
            <div className='flex justify-center text-center p-5'>
                <div className='w-[75%] sm:w-[90%]'>
                    <Image src='/assets/img/banner_envios_a_todo_mexico.webp' alt='Envios a todo Mexico' width={0} height={0} sizes='100vw' className='w-auto h-full' />
                </div>
            </div>
            <div className='flex justify-center text-center p-3'>
                <Card
                    shadow={false}
                    className="relative grid h-[40rem] w-full  items-end justify-center overflow-hidden text-center"
                >
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                    >
                    </CardHeader>
                    <CardBody className="relative py-8 px-6 md:px-12">
                    </CardBody>
                </Card>
            </div>
        </ThemeProvider>
    )
}
