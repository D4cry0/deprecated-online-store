import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className='flex justify-center'>
      <div className='grid md:grid-flow-col grid-flow-row items-center justify-center md:justify-between gap-7 w-full m-5'>
          <div className='gap-3 flex justify-center items-center h-[20px]'>
            <Link href='https://www.facebook.com/' target='_blank'>
              <Image src='/assets/img/iconmonstr-facebook-6.svg' alt='Facebook' width={0} height={30} sizes='100vw' className='h-[30px] w-auto'/>
            </Link>
            <Link href='https://www.instagram.com/' target='_blank'>
              <Image src='/assets/img/iconmonstr-instagram-13.svg' alt='Instagram' width={0} height={30} sizes='100vw'  className='h-[30px] w-auto mx-1'/>
            </Link>
            <Link href='https://www.tiktok.com/' target='_blank'>
              <Image src='/assets/img/logo-tiktok-svgrepo-com.svg' alt='Tiktok' width={0} height={30} sizes='100vw' className='h-[30px] w-auto'/>
            </Link>
          </div>
          <div className='gap-1 flex flex-col justify-center items-center text-center'>
              <span className='xs:text-lg sm:text-lg md:text-xl'>® 2023</span>
              <span className='xs:text-xs sm:text-sm md:text-base'>contacto@</span>
              <span className='xs:text-xs sm:text-sm md:text-base'>ventas@</span>
          </div>
          <div className='gap-2 flex justify-center items-center text-center'>
          </div>
      </div>
    </div>
  )
}
