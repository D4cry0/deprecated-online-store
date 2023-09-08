'use client'

import React, { use, useEffect } from 'react';

import { useParams } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { Logout_Page } from '@/app/_interfaces';

const useGetLocale = async (): Promise<Logout_Page> => {
    const lang = useParams().lang;

    try {
        const data = await fetch(`${process.env.HOSTURL}/api/v1/locales/${lang}`, {
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
        return json.Logout_Page;
    } catch (error) {
        return {
            Title: {
                TEXT: 'Logout'
            },
            Msg_Logout: {
                TEXT: 'Cerrando sesión...'
            }
        }
    }
}


export default async function UserLogout() {

    const lang = useParams().lang;
    const lan = use(useGetLocale());

    useEffect(() => {
        signOut({
            callbackUrl: `/${lang}`,
        });
    }, []);

    return (
        <div className='text-center m-5'>
            <h1>
                { lan.Msg_Logout.TEXT }
            </h1>
        </div>
    )
}