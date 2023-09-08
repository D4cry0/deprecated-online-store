import React, { FC, ReactNode } from 'react';
import Head from 'next/head';

interface Props {
    children: ReactNode;
    title?: string;
}

export const MainLayout: FC<Props> = ({children, title}) => {

    return (
        <>
            <Head>
                <title>{ title }</title>
            </Head>
            {/* BODY */}
            <div className='flex flex-col justify-center'>
                    { children }
            </div>
        </>
    )
}
