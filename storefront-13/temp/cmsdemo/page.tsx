import React from 'react';
import { getHtmlFile } from '../_lib/html-handler';

export default function Demo (){
    const markup = { __html: getHtmlFile( process.env.NODE_ENV === 'production' ? '/html/test.html' : '/html/test.html') };

    return (
        <div dangerouslySetInnerHTML={markup} />
    )
}