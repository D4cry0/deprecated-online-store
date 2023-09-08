import React, { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { verifyLogin } from '@/services/verifyLogin';
import { AddressesPanel, InformationPanel, OrdersPanel } from '@/components/account';
import { Account_Page, CustomerAddresses, CustomerInformation, Login_Page, System_Error, System_General, Verify_Account_Page } from '@/interfaces';

interface VerifyProps {
    Login_Page: Login_Page;
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
    Account_Page: Account_Page;
    System_General: System_General;
}

interface Props {
    qDataAddresses : CustomerAddresses,
    qDataInformation: CustomerInformation,
    lan: VerifyProps;
}

const Account: NextPage<Props> = ({ qDataAddresses, qDataInformation, lan }) => {

    // 1 - Ordenes
    // 2 - Direcciones
    // 3 - Editar mi información
    // 4 - Error con la cuenta de usuario
    const [ viewPanel, setViewPanel ] = useState( (qDataAddresses.errCode === 'customer' || qDataInformation.errCode === 'customer') ? 4 : 2);

    return (
        <>
            <Head>
                <title>Cuenta</title>
            </Head>
            <div className='fixed xs:top-[4.72rem] sm:top-[5.12rem] bg-red-600 border-t-2 border-t-white w-full z-50'>
                <div className='w-full h-[2rem] flex flex-row'>
                    <div className='w-3/4 flex text-start items-center align-middle xs:px-3 sm:px-10'>
                        <span className='text-xs font-bold text-white tracking-wider'>
                            {lan.Account_Page.Breadcrumb.TEXT} / 
                            { 
                                viewPanel === 1 
                                    ? ` ${lan.Account_Page.Breadcrumb_Orders.TEXT}` 
                                    : viewPanel === 2 
                                        ? ` ${lan.Account_Page.Breadcrumb_Addresses.TEXT}` 
                                        : ` ${lan.Account_Page.Breadcrumb_Information.TEXT}`
                            }
                        </span>
                    </div>
                    {
                        viewPanel !== 4 &&
                        <div className='w-1/4 flex items-center align-middle justify-end gap-4'>
                            {/* <div>
                                <Link
                                    className='w-full text-white hover:text-black ease-out transition-all duration-500 border-none flex items-center'
                                    href={''}
                                    onClick={() => setViewPanel(1)}
                                >
                                    <i className='material-icons-outlined'>receipt_long</i>
                                </Link>
                            </div> */}
                            <div>
                                <Link
                                    className='w-full text-white hover:text-black ease-out transition-all duration-500 border-none flex items-center'
                                    href={''}
                                    onClick={() => setViewPanel(2)}
                                >
                                    <i className='material-icons-outlined'>place</i>
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className='w-full text-white hover:text-black ease-out transition-all duration-500 border-none flex items-center'
                                    href={''}
                                    onClick={() => setViewPanel(3)}
                                >
                                    <i className='material-icons-outlined'>settings</i>
                                    
                                </Link>
                            </div>
                        </div>
                    }
                    <div className='flex items-center align-middle justify-end px-4'>
                        {
                            viewPanel !== 4 && 
                            <Menu>  
                                <MenuHandler>
                                        <Link 
                                            href={''}
                                            className='text-gray-200 hover:text-black ease-out transition-all duration-500 border-none flex items-center' 
                                        >
                                            <i className='material-icons-outlined'>menu</i>
                                        </Link>
                                </MenuHandler>
                                <MenuList>
                                    {/* <MenuItem>        
                                        <Link 
                                            className='w-full text-black hover:text-sky-500  ease-out transition-all duration-500 border-none flex items-center' 
                                            href={''} 
                                            onClick={() => setViewPanel(1)}
                                        >
                                            <i className='material-icons-outlined'>receipt_long</i>
                                            <small className='text-1rem ps-2'>{lan.Account_Page.Breadcrumb_Orders.TEXT}</small>
                                        </Link>
                                    </MenuItem> */}
                                    <MenuItem>        
                                        <Link 
                                            className='w-full text-black hover:text-sky-500  ease-out transition-all duration-500 border-none flex items-center' 
                                            href={''} 
                                            onClick={() => setViewPanel(2)}
                                        >
                                            <i className='material-icons-outlined'>place</i>
                                            <small className='text-1rem ps-2'>{lan.Account_Page.Breadcrumb_Addresses.TEXT}</small>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>        
                                        <Link 
                                            className='w-full text-black hover:text-sky-500 ease-out transition-all duration-500 border-none flex items-center' 
                                            href={''} 
                                            onClick={() => setViewPanel(3)}
                                        >
                                            <i className='material-icons-outlined'>settings</i>
                                            <small className='text-1rem ps-2'>{lan.Account_Page.Breadcrumb_Information.TEXT}</small>
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        }
                    </div>
                    
                </div>
            </div>

            <div className='pt-[8rem]'>
                
                {
                    viewPanel === 1 && <OrdersPanel />
                }

                {
                    viewPanel === 2 && <AddressesPanel qData={qDataAddresses} lan={lan} />
                }

                {
                    viewPanel === 3 && <InformationPanel qData={qDataInformation} lan={lan} />
                }

                {
                    viewPanel === 4 && 
                    <div className='flex flex-col w-full justify-center items-center text-center'>
                        <h1 className='text-lg'>{lan.Verify_Account_Page.System_Error_Account_Active.TEXT}</h1>
                    </div>
                }

            </div>

        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, res, locale}) => {

    let lan: VerifyProps;

    let qDataAddresses = {} as CustomerAddresses;
    let qDataInformation = {} as CustomerInformation;

    const session = await verifyLogin(req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', [], true);

    if(!session || session === 'Unauthorized roles') {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}/login?p=account${ session === 'Unauthorized roles' ? '&e=roles' : '' }`
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
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/customers/storefront/addresses`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            }
        });
        const jsn = await data.json();
        qDataAddresses = jsn.qData;

        if(qDataAddresses.errCode === 'customer') qDataAddresses.errMsg = lan.Verify_Account_Page.System_Error_Account_Details.TEXT;
    } catch (error) {
        console.log(error);
        qDataAddresses.errCode = 'server';
        qDataAddresses.errMsg = lan.System_Error.Server_1000.TEXT;
    }

    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/customers/storefront/information`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            }
        });
        const jsn = await data.json();
        qDataInformation = jsn.qData;

        if(qDataInformation.errCode === 'customer') qDataInformation.errMsg = lan.Verify_Account_Page.System_Error_Account_Details.TEXT;
    } catch (error) {
        console.log(error);
        qDataInformation.errCode = 'server';
        qDataInformation.errMsg = lan.System_Error.Server_1000.TEXT;
    }

    return {
        props: {
            lan,
            qDataAddresses,
            qDataInformation
        }
    }
}

export default Account;