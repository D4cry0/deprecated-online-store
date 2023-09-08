import React, { useContext, useState } from 'react';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

import { getUser } from '@/services/prisma';
import { SideMenu } from '@/templates/interfaces/admin/modules';
import { VerifyAccountAdmin } from '@/templates/interfaces/admin/modules/home/VerifyAccountAdmin';
import { GlobalAppContext } from '@/context/GlobalAppContext';

interface Props {
    host: string;
    loginName: string;
    appVersion: string;
}

export default function Home({ host, loginName, appVersion }: Props) {
    // TODO: Opciones para saber que panel mostrar context
    const { logoSrc, logoAltTxt } = useContext( GlobalAppContext );

    const [codeCustomer, setCodeCustomer] = useState('');

    const createLink = async() => {
        try {
            const resp = await fetch( `${host}/api/v1/auth/verify/${codeCustomer}`, {
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
    
            let msg = '';
            if(resp.ok) {
                const data = await resp.json();
                msg = data['url'];
            } else {
                msg = 'Verificar el código de cliente o contactar al administrador';
            }
    
            return msg;
        } catch (error) {
            return 'Error de servidor, intente de nuevo o contacte al administrador';
        }

    }

    const getCustomer = async() => {
        try {
            const resp = await fetch( `${host}/api/v1/auth/verify/${codeCustomer}`, {
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
    
            if(! resp.ok) {
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

    return (
        <>

            <div className='grid m-0 p-0 w-full max-w-full h-screen'>
                <div className='row'>
                    <div className='col-2'>
                        <SideMenu logo={logoSrc} alt={logoAltTxt} logoHeight={60} loginName={loginName} appVersion={appVersion}/>
                    </div>
                    <div className='col-10 m-0 p-1 border-1 border-gray-400'>
                        <VerifyAccountAdmin
                            createLink={createLink}
                            getCustomer={getCustomer}
                            codeCustomer={codeCustomer}
                            setCodeCustomer={setCodeCustomer}
                        />
                        {/* <OrdersPanel /> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    let dbUser;
    const sessionUser = session?.user as any;
    const appVersion = process.env.APPVERSION;

    if(sessionUser) dbUser = await getUser(sessionUser.login_name, '', true);

    console.log({dbUser});

    const eroles = dbUser && dbUser.roles.find(role => role === 'CUSTOMER') ? '&e=roles' : '';

    if (!session || eroles !== '') {
        return {
            redirect: {
                permanent: false,
                destination: `/${ctx.locale}/login?p=/admin${eroles}`,
            }
        }
    }

    return {
        props: {
            host: process.env.HOSTURL,
            loginName: dbUser?.login_name,
            appVersion: appVersion
        }
    }
}