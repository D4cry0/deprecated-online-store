import * as fs from 'fs';

export const getHtmlFile = (url: string) => {


    const page = fs.readFileSync(url).toString();

    return page;

}