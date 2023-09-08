import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
}

export default function LoginLayout({
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <section>
            <div className={`flex flex-row justify-center items-center w-full h-screen p-5 
                            bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500`}>
                <div className='xs:w-full sm:w-full md:w-3/4 mdl:w-3/6 lg:w-2/4 xl:w-2/6 2xl:w-1/4'>
                    { children }
                </div>
            </div>
        </section>
    ) 
}