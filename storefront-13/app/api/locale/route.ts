import { NextResponse } from 'next/server';

import * as fs from 'fs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('lang');

    return NextResponse.json(fs.readFileSync(`./public/locales/${locale}.json`).toString(),{headers: {
        'Content-Type': 'application/json'
    }})
}