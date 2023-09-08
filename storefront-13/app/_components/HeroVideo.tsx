'use client'

import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// import imgheroEs from '../../../../public/assets/img/promociones_video_es.webp';
// import imgheroEn from '../../../../public/assets/img/promociones_video_en.webp';
// import imgheroZh from '../../../../public/assets/img/promociones_video_zh.webp';

import { Hero_Video_Banner } from '../_interfaces';
import { useRouter } from 'next/navigation';
import { Typography } from '@material-tailwind/react';

interface Props {
    lan: Hero_Video_Banner;
}

// const getImgHero = (locale: string) => {
//     switch (locale) {
//         case 'es':
//             return imgheroEs;
//         case 'en':
//             return imgheroEn;
//         case 'zh':
//             return imgheroZh;
//         default:
//             return imgheroEs;
//     }
// }

export const HeroVideo: FC<Props> = ({ lan }) => {

    return (
        <div className='relative flex flex-row justify-center h-full w-full'>
            <div className='absolute flex flex-row justify-center xs:pt-[2.4rem] sm:pt-[3.1rem] md:pt-[3.9rem] w-full h-full'>
                    {/* <InputGroup className='my-2'>
                        <Form.Control type='text' placeholder='Buscar' className='bg-dander form-control-lg' />
                        <button className='btn btn-danger' type='button'>
                            <i className='material-icons'>search</i>
                        </button>
                    </InputGroup> */}
                        <div className='flex flex-row justify-center items-center h-full w-full xs:text-4xl sm:text-5xl  md:text-7xl lg:text-9xl font-extrabold text-white hover:text-black hover:bg-white hover:mix-blend-screen transition-all duration-500'>
                            {/* <div className='position-absolute bg-dark w-100 h-fit' style={{opacity: '30%', zIndex: 0}}>
                            
                        </div> */}
                            {/* <h1 className='w-[90%] fs-1 fw-bold' 
                                style={{textAlign: 'center', color: 'white', fontWeight: 'bolder', zIndex: 1}}>
                                { lan.Hero_Video_Banner.TITLE || devLocale.Hero_Video_Banner.TITLE }
                            </h1> */}
                            <Link className='no-underline flex items-center' href={'/promociones'}>
                                <span className='hover:text-light-blue-500 hover:animate-pulse transition-colors duration-200 ease-in mx'>
                                    {lan.Title.TEXT}
                                </span> 
                            </Link>
                            {/* <Typography className='text-9xl font-extrabold text-black bg-lime-200 mix-blend-screen'>
                                PROMOCIONES
                            </Typography> */}
                            {/* <Image src={getImgHero(locale || 'es')} id='imghero' className='h-[30%]' alt='Promociones' /> */}
                        </div>
            </div>
            <div className={`w-full absolute overflow-hidden -z-50
                    xs:h-[10rem] sm:h-[15rem] md:h-[20rem]
            `} >
                <video className='block relative w-auto min-w-full h-auto' autoPlay loop muted>
                    <source src='/assets/video/hero.mp4' type='video/mp4' />
                </video>
            </div>
        </div>
    )
}