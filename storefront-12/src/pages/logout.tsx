import React, { useEffect } from 'react';

import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { Logout_Page } from '@/interfaces';

interface Props {
    lan: Logout_Page;
    locale: string;
}

const UserLogout: NextPage<Props> = ({lan, locale}) => {

    const router = useRouter();

    useEffect(() => {

        const signOut = async() => {
            try {
                await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/auth/logout`, {
                    method: 'DELETE',
                });

                router.push(`/${locale}`);
                // router.reload();
                
            } catch (error) {
                console.log('Failed to logout');
            }
        }
        signOut();
    }, [router, locale]);

    return (
        <div className={`flex flex-row justify-center items-center w-full h-screen text-center p-5 bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-gray-100 to-teal-100`}>
            <div className='text-center m-5 xs:text-2xl sm:text-4xl md:text-7xl xl:text-9xl'>
                <h1>
                    { lan.Msg_Logout.TEXT }
                </h1>
            </div>
            {/* TODO: Implementar un grafico */}
        </div>
    )
}

export default UserLogout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {

    let lan: Logout_Page;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sections: [
                    'Logout_Page'
                ]
            })
        });
        const json = await data.json();
        lan = json.Logout_Page;
    } catch (error) {
        lan = {
            Title: {
                TEXT: 'Logout'
            },
            Msg_Logout: {
                TEXT: 'Cerrando sesión...'
            }
        }
    }

    return {
        props: {
            lan,
            locale,
        },
    }
}