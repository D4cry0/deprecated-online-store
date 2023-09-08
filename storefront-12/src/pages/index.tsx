import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { Hero_Video_Banner } from '@/interfaces';
import { HeroVideo, Footer } from '@/components';
import { MainLayout } from '@/layouts';

interface LocalesProps {
    Hero_Video_Banner: Hero_Video_Banner;
}

interface Props {
    lan: LocalesProps;
}

const Home: NextPage<Props> = ({ lan }) => {

    return (
        
        <>
            <MainLayout title=''>
                    <div className='w-full xs:h-[12rem] sm:h-[15rem] md:h-[20rem]'>
                        <HeroVideo lan={lan.Hero_Video_Banner}/>
                    </div>
                    <div className='flex justify-center text-center px-3 mt-3'>
                    
                        <div className='sm:hidden w-[90%]'>
                            <Link href='https://www.whatsapp.com/catalog/5213326170269/?app_absent=0' target='_blank'>
                                <Image src='/assets/img/banner_whatsapp_precios_especiales.webp' alt='Catalogo WhatsApp' width={0} height={0} sizes='100vw' className='img-fluid'/>
                            </Link>
                        </div>
                    </div>
                    
                    <div className='grid xl:grid-cols-3 xl:px-28 justify-center md:scale-90'>
                        <Card className='m-5 border-4 border-red-500'>
                            <CardBody className='h-full'>
                            </CardBody>
                            <CardFooter>
                            </CardFooter>
                        </Card>
                        <Card className='m-5 border-4 border-red-500'>
                            <CardBody className='h-full'>
                            </CardBody>
                            <CardFooter>
                            </CardFooter>
                        </Card>
                        <Card className='m-5 border-4 border-red-500'>
                            <CardBody className='h-full'>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='w-full flex justify-center p-5'>
                        <div className='w-[75%] sm:w-[90%] flex justify-center'>
                            <Image src='/assets/img/banner_envios_a_todo_mexico.webp' alt='Envios a todo Mexico' width={0} height={0} sizes='100vw' className='w-auto h-full' />
                        </div>
                    </div>
                    <div className='flex justify-center text-center p-3'>
                        <Card
                            shadow={false}
                            className="relative grid h-[40rem] w-full  items-end justify-center overflow-hidden text-center"
                        >
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            >
                            </CardHeader>
                            <CardBody className="relative py-8 px-6 md:px-12">
                            </CardBody>
                        </Card>
                    </div>
                    
                    <div className='whatsapp-float hover:animate-pulse' title='Envia mensaje de Whatsapp'>
                        <Link href='https://wa.me/'>
                            <Image src='/assets/img/Whatsapp_Digital_Glyph_Black.svg' alt='Logo Whatsapp' height={60} width={60} />            
                        </Link>
                    </div>
            </MainLayout>
            <Footer />
        </>
        
       
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    let lan: LocalesProps;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
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
        return {
            redirect: {
                destination: `/500`,
                permanent: false
            }
        }
    }

    return {
        props: {
            lan,
        },
    }
}

export default Home;