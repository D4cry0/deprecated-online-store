
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation'

import { HeroVideo } from '../_components/HeroVideo';
import RootBody from '../_components/root/Body';
import { Hero_Video_Banner } from '../_interfaces';

export default async function Home({ 
        params: { lang } 
} : { 
        params: { lang: string  } 
}) {

    interface LocalesProps {
        Hero_Video_Banner: Hero_Video_Banner;
    }

    let lan: LocalesProps;
    try {
        const data = await fetch(`${process.env.HOSTURL}/api/v1/locales/${lang}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sections: [
                    'Hero_Video_Banner'
                ]
            })
        });
        lan = await data.json();
    } catch (error) {
        console.log(error);
        redirect(`/${lang}/404`);
    }

    return (
        
        <div className='bg-gradient-to-r from-slate-500 to-yellow-100'>
            <div className='w-full xs:h-[10rem] sm:h-[15rem] md:h-[20rem]'>
                <HeroVideo lan={lan.Hero_Video_Banner}/>
            </div>
            <div className='flex justify-center text-center px-3 mt-3'>
            
                <div className='sm:hidden w-[90%]'>
                    <Link href='https://www.whatsapp.com/catalog/5213326170269/?app_absent=0' target='_blank'>
                        <Image src='/assets/img/banner_whatsapp_precios_especiales.webp' alt='Catalogo WhatsApp' width={0} height={0} sizes='100vw' className='img-fluid'/>
                    </Link>
                </div>
            </div>
            

            <RootBody />
            
            
            <div className='whatsapp-float hover:animate-pulse' title='Envia mensaje de Whatsapp'>
                <Link href='https://wa.me/523326170269'>
                    <Image src='/assets/img/Whatsapp_Digital_Glyph_Black.svg' alt='Logo Whatsapp' height={60} width={60} />            
                </Link>
            </div>
        </div>
       
    )
}