
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
}

export default function LogoutLayout({
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <section>
            <div className='flex justify-content-center p-5'>
                <div className='flex flex-row justify-content-center'>
                    <div className='col md:col-8 lg:col-6 xl:col-5'>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    ) 
}