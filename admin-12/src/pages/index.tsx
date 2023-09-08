import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { verifyLogin } from '@/services/verifyLogin';
import { Card, Typography } from '@material-tailwind/react';


interface Props {
    customersUpdated: {
        event: string,
        date: string,
        usrProps: string,
    }[];
}

const Admin: NextPage<Props> = ({ customersUpdated }) => {
    const tableHeader = ['Customer', 'Fecha UTC MX' ];

    return (
        <>
            <Head>
                <title>Admin</title>
            </Head>

            <div className='col-span-10 min-h-screen p-4 border-s-2 '>
                <h1 className='text-3xl'>Administración</h1>


                <Card className='w-full md:w-1/4 m-5 max-h-screen overflow-scroll'>
                    
                    <h2 className='text-xs p-2'>Eventos recientes de actualizacion de información</h2>
                    <table className='w-full min-w-max table-auto text-left'>
                        <thead>
                        <tr>
                            {tableHeader.map((header) => (
                                <th key={header} className='border-b border-blue-gray-100 bg-blue-gray-50 p-2'>
                                    <Typography
                                        variant='small'
                                        color='blue-gray'
                                        className='font-normal leading-none opacity-70'
                                    >
                                        {header}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                            {
                                customersUpdated[0].usrProps === 'ERROR: en la consulta de actualizaciones' 
                                ?
                                    <tr className='even:bg-blue-gray-50/50'>
                                        <td className='p-2'>
                                            <Typography variant='small' color='blue-gray' className='font-normal'>
                                                {customersUpdated[0].usrProps || ''}
                                            </Typography>
                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                : 
                                    customersUpdated.map(( customer, index) => (
                                        <tr key={index} index-data={index} className='even:bg-blue-gray-50/50'>
                                            <td className='p-2'>
                                                <Typography variant='small' color='blue-gray' className='text-xs'>
                                                    {customer.usrProps || ''}
                                                </Typography>
                                            </td>
                                            <td className='p-2'>
                                                <Typography variant='small' color='blue-gray' className='text-xs'>
                                                    { customer.date !== '' ? new Date(customer.date).toLocaleString('es-MX', {timeZone: 'America/Mexico_City'}) : ''}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </Card>
            </div>

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    let customersUpdated = [];
    const session = await verifyLogin(ctx.req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', ['CUSTOMER'], true);

    if(!session || session === 'Unauthorized roles') {
        return {
            redirect: {
                permanent: false,
                destination: `/${ctx.locale}/login${ session === 'Unauthorized roles' ? '?e=roles' : ''}`,
            }
        }
    }

    try {
        const query = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/logs/tail?data=UPDATE&skip=0&take=40`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await query.json();
        customersUpdated = data.logs;
    } catch (error) {
        console.log("Logs: ", error); 
        customersUpdated = [{
            event: '',
            date: '',
            usrProps: 'ERROR: en la consulta de actualizaciones',
        }]; 
    }

    if(customersUpdated.length < 1 ) {
        customersUpdated = [{
            event: '',
            date: '',
            usrProps: 'Sin registros por el momento',
        }]; 
    }

    if(customersUpdated[0].usrProps !== 'ERROR: en la consulta de actualizaciones' && customersUpdated[0].usrProps !== 'Sin registros por el momento') {
        customersUpdated = customersUpdated.map((log: { SYL_LOGS: string; SYL_EVENT: string; SYL_DATE: string; }) => {
            const json = JSON.parse(log.SYL_LOGS);
            return {
                event: log.SYL_EVENT,
                date: log.SYL_DATE,
                usrProps: json.usrProps,
            }
        });
    } 
    

    return {
        props: {
            customersUpdated
        }
    }
}

export default Admin;