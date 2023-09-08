import React, { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Input, Textarea, Button, Alert } from '@material-tailwind/react';
import { verifyLogin } from '@/services/verifyLogin';


interface Props {
    hostUrl: string;
}


const Customers: NextPage<Props> = ({ hostUrl }) => {
    
    const router = useRouter();
    
    const [ showCustomerInformation, setShowCustomerInformation ] = useState(false);
    const [ showLink, setShowLink ] = useState(false);
    const [ errMsg, setErrMsg ] = useState('');
    
    const [ url, setUrl ] = useState('');
    const [ urlMetric, seturlMetric ] = useState('')
    const [ customerData, setCustomerData ] = useState({ok: false, msg: '', data: null});
    const [ codeCustomer, setCodeCustomer ] = useState('');

    const onCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodeCustomer(e.target.value);
    }

    const genLink = async() => {
        const resp = await createLink();
        setShowCustomerInformation(false);

        if(resp.ok) {
            setShowLink(true);
            setUrl( resp.msg );
            seturlMetric( resp.urlMetrics && 'Ya visito un enlace anterior' );
        } else {
            setShowLink(false);
            setErrMsg( resp.msg );
            seturlMetric('');
            setShowAlert(true);
        }
    }

    const fetchCustomer = async() => {
        const customer = await getCustomer();
        setShowLink(false);
        
        if(customer.ok) {
            setShowCustomerInformation(true);
            setCustomerData(customer);
        } else {
            setShowCustomerInformation(false);
            setErrMsg( customer.msg );
            setShowAlert(true);
        }
    }

    const handleOnEdit = async() => {        
        const customer = await getCustomer();
        
        if(customer.ok) router.push(`/customers/${codeCustomer}`);
        else {
            setShowCustomerInformation(false);
            setShowLink(false);
            setErrMsg( customer.msg );
            setShowAlert(true);
        }
    }

    const createLink = async() => {
        try {
            const resp = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/fastverify/${codeCustomer}`, {
                method: 'POST',
                credentials: 'include',
                // body: JSON.stringify({
                //     user: user.value,
                //     wrd: userp.value,
                // }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    

            if(resp.ok) {
                const data = await resp.json();
                return {
                    ok: true,
                    msg: data['url'],
                    urlMetrics: data['urlMetrics']
                }
            } else {
                return {
                    ok: false,
                    msg: 'Verificar el código de cliente o contactar al administrador',
                }
            }
        } catch (error) {
            return {
                ok: false,
                msg: 'Error de servidor, intente de nuevo o contacte al administrador'
            }
        }

    }

    const getCustomer = async() => {
        try {
            const resp = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/fastverify/json/${codeCustomer}`, {
                method: 'GET',
                credentials: 'include',
                // body: JSON.stringify({
                //     user: user.value,
                //     wrd: userp.value,
                // }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    

            if( resp.status == 404 ) {
                return {
                    ok: false,
                    msg: 'Verificar el código de cliente o contactar al administrador',
                    data: null
                }
            }
            
            const data = await resp.json();
            const customer = data['data'];
            return {
                ok: true,
                msg: 'exito',
                data: {
                    ...customer,
                    USERS_USR: customer.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR
                }
            };
        } catch (error) {
            return {
                ok: false,
                msg: 'Error de servidor, intente de nuevo o contacte al administrador',
                data: null
            }
        }
    }

    const [ showAlert, setShowAlert ] = useState(false);
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
            <div className='col-span-10 min-h-screen p-4 border-s-2 border-gray-200'>
                <div className='flex flex-col w-2/4'>

                    <div className='flex flex-col gap-1'>
                        <h1 className='text-3xl'>Generar enlace para verificar datos del cliente</h1>
                        <Input 
                            id='inCustomer' 
                            type="text" 
                            label='Código de Customer o Cliente' 
                            value={codeCustomer} 
                            onChange={onCustomerChange}/>
                    </div>

                    <div className='flex flex-row gap-4 py-1'>
                        <Button variant='filled' className='w-full' onClick={fetchCustomer}>Consultar</Button>
                        <Button variant='filled' className='w-full' onClick={handleOnEdit}>Editar</Button>
                        <Button variant='filled' className='w-full' onClick={genLink}>Generar</Button>
                    </div>
                    
                    <div className='py-1'>
                        {
                            showLink && 
                            <Textarea resize shrink rows={5} cols={30} label='Enlace de verificación' className='w-full' value={`${hostUrl}${url}`} onChange={() => {}} />
                        }
                        {
                            showLink && urlMetric.length > 0 && 
                            <div className='py-1'>
                                <Alert color='cyan'>
                                    <div className='flex items-center gap-3'>
                                        <i className='material-icons-outlined'>info</i>
                                        <span>{urlMetric}</span>
                                    </div>
                                </Alert>
                            </div>
                        }
                        {
                            showCustomerInformation &&
                            <pre className='w-full'>
                                {JSON.stringify(customerData.data, null, 2)}
                            </pre>
                        }
                    </div>
                </div>
            </div>
            {
                showAlert &&
                <div className='fixed bottom-4 w-full flex justify-center items-center'>
                    <Alert color='orange' variant='filled' className='w-full md:w-1/4'>
                        <h3 className='text-white-700'>{errMsg}</h3>
                    </Alert>
                </div>
            }
        </>
    )

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const session = await verifyLogin(ctx.req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', ['CUSTOMER'], true);

    if(!session || session === 'Unauthorized roles') {
        return {
            redirect: {
                permanent: false,
                destination: `/${ctx.locale}/login${ session === 'Unauthorized roles' ? '?e=roles' : ''}`,
            }
        }
    }

    return {
        props: {
            hostUrl: process.env.HOSTURLSTORE,
        }
    }
}

export default Customers;