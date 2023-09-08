import React, { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { Card, Alert, Typography, Button } from '@material-tailwind/react';

import { Addresses, Information } from '@/components';
import { Account_Page, Login_Page, System_Error, System_General, Verify_Account_Page, CustomerAddresses, CustomerInformation, CustomerSingleAddress } from '@/interfaces';
import { verifyLogin } from '@/services/verifyLogin';

interface VerifyProps {
    Login_Page: Login_Page;
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
    Account_Page: Account_Page;
    System_General: System_General;
}

interface Props {
    qDataInformation: CustomerInformation;
    qDataAddresses: CustomerAddresses;
    lan: VerifyProps;
    cuCode: string;
}


const CustomerEdit: NextPage<Props> = ({ cuCode, qDataInformation, qDataAddresses, lan }) => {


    const router = useRouter();
    const { query } = router;
    const tableHeader = ['Dirección', 'Ciudad', 'Contacto', '' ];

    const [ showAlert, setShowAlert ] = useState(false);
    const [ errMsg, setErrMsg ] = useState('');

    const [ editAddress, setEditAddress ] = useState(false);
    const [ selectedAddress, setSelectedAddress ] = useState({} as CustomerSingleAddress);

    const handleEditAddress = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const index = parseInt(event.currentTarget.getAttribute('index-data') || '-1');
        const add = qDataAddresses.addresses.at(index);

        if(add != undefined) {
            setSelectedAddress(add);
            setEditAddress(true);
        }
    }

    useEffect(() => {   
        if(query['editAdd'] == 'false') {
            setEditAddress(false);
            router.replace('/customers/[cucode]', `/customers/${cuCode}`, { shallow: true });
        }
    }, [query]);

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 4500);

        return () => clearTimeout(timer);
    }, [showAlert]);

    return (

        <>
            
            <Head>
                <title>Clientes</title>
            </Head>
            {
                qDataInformation.errCode === 'none'
                ? <div className='col-span-10 min-h-screen p-4 border-s-2 border-gray-200'>
                    
                    {

                        !editAddress 
                        ? <Information 
                            qDataInformation={qDataInformation} 
                            lan={lan} 
                            cuCode={cuCode}
                            setErrMsg={setErrMsg}
                            setShowAlert={setShowAlert}
                          />
                        : <Addresses
                            qData={selectedAddress}
                            lan={lan}
                            phone_code_list={qDataAddresses.phone_code_list}
                            parcel_suppliers_list={qDataAddresses.parcel_suppliers_list}
                            states_list={qDataAddresses.states_list}
                            countries_list={qDataAddresses.countries_list}
                            cuCode={cuCode}
                            setErrMsg={setErrMsg}
                            setShowAlert={setShowAlert}
                        />
                    }

                    <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  w-full'>
                        <Card className='col-span-6 m-5 overflow-scroll'>
                            <table className='w-full min-w-max table-auto text-left'>
                                <thead>
                                <tr>
                                    {tableHeader.map((header) => (
                                    <th key={header} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
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
                                {qDataAddresses.addresses.map(( add, index) => (
                                    <tr key={index} index-data={index} className='even:bg-blue-gray-50/50'>
                                        <td className='p-4'>
                                            <Typography variant='small' color='blue-gray' className='font-normal'>
                                                {add.addresses.address + ' ' + add.addresses.ext_number}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography variant='small' color='blue-gray' className='font-normal'>
                                                {add.addresses.city}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography variant='small' color='blue-gray' className='font-normal'>
                                                {add.contact}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Button variant='text' onClick={handleEditAddress} className='font-medium text-sky-500'>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    

                </div>
                : <Alert color='orange' variant='filled' className='col-span-5 w-full h-fit'>
                    <span className='text-white'>
                        Error en la cuenta del cliente, se requiere crear una relación de información. <br />
                        Usar el 
                        <Link href={`/customers`} className='mx-2 text-sky-800'>
                            enlace
                        </Link>
                        para confirmar datos del cliente y poder generar dicha relación.
                    </span>
                  </Alert>
            }
            {
                showAlert &&
                <div className='fixed bottom-4 w-full flex justify-center items-center'>
                    <Alert color='orange' variant='filled' className='w-full md:w-1/4'>
                        <h3 className='text-white'>{errMsg}</h3>
                    </Alert>
                </div>
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale, req }) => {
    
    const cucode = params?.cucode as string;
    let lan: VerifyProps;
    let qDataAddresses = {} as CustomerAddresses;
    let qDataInformation = {} as CustomerInformation;

    const session = await verifyLogin(req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', ['CUSTOMER'], true);

    if(!session || session === 'Unauthorized roles') {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}/login${ session === 'Unauthorized roles' ? '?e=roles' : ''}`,
            }
        }
    }

    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            },
            body: JSON.stringify({
                sections: [
                    'Login_Page',
                    'Verify_Account_Page',
                    'System_Error',
                    'Account_Page',
                    'System_General'
                ]
            })
        });
        lan = await data.json();
    } catch (error) {
        console.log(error);

        return {
            redirect: {
                permanent: false,
                destination: `/500`
            }
        }
    }

    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/customers/admin/information/${cucode}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            }
        });
        const jsn = await data.json();
        qDataInformation = jsn.qDataInformation;
        qDataAddresses = jsn.qDataAddresses;

        if(qDataInformation.errCode === 'customer' || qDataAddresses.errCode === 'customer') qDataInformation.errMsg = lan.Verify_Account_Page.System_Error_Account_Details.TEXT;
    } catch (error) {
        console.log(error);
        qDataInformation.errCode = 'server';
        qDataInformation.errMsg = lan.System_Error.Server_1000.TEXT;
    }


    return {
        props: {
            cuCode: cucode,
            lan,
            qDataInformation,
            qDataAddresses
        }
    }
}

export default CustomerEdit;