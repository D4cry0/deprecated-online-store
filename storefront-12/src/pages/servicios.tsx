import React from 'react';

import { NextPage, GetServerSideProps } from 'next';

import { getHtmlFile } from '@/services/html-handler';

interface Props {
    page: string;
}

export const servicios: NextPage<Props> = ({ page }) => {

    const markup = { __html: page };

    return (
        <div dangerouslySetInnerHTML={markup} />
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    return {
        props: {
            // page: getHtmlFile('src/client/public/html/promociones/index.html'),
            page: getHtmlFile( process.env.NODE_ENV === 'production' ? 'public/html/test.html' : 'public/html/test.html'),
        }
    }
}


export default servicios;

