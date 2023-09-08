import React, { useEffect, useState } from 'react';

import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, Input, Button } from '@material-tailwind/react';

import { Login_Page, LoginState, System_Error } from '@/interfaces';
import { verifyLogin } from '@/services/verifyLogin';

interface LoginProps {
    Login_Page: Login_Page;
    System_Error: System_Error;
}

interface Props {
    errorLogin: string;
    isAdmin: boolean;
    lan: LoginProps;
}

const UserLogin: NextPage<Props> = ({ errorLogin, isAdmin, lan }) => {

    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState(errorLogin);

    const [ loginMod, setLoginMod ] = useState(isAdmin);

    const login = async({ user, pass }: LoginState) => {
        try {
            const r = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userlogin_name: user,
                    password: pass
                }),
            });

            if( !r.ok && r.status != 200 ) {
                const msg = await r.json();
                if(msg?.cause === 'Bad credentials') {
                    setErrorMsg(lan.Login_Page.System_Error_Password.TEXT);
                } else {
                    setErrorMsg(lan.Login_Page.System_Error_Permissions.TEXT);
                }
            } else {
                router.push(`/${router.locale}/${router.query.p || ''}`);
                // router.reload();
            }
                
            
        } catch (error) {
            setErrorMsg(lan.System_Error.Server_1000.TEXT)
        }
    }

    const reg = async(data: LoginState) => {
        // TODO: REGISTER
    }

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<LoginState>();

    useEffect(() => {
        
        const deleteCookie = async() => {
            try {
                await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/auth/logout`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.log('Failed to logout');
            }
        }

        if( errorLogin !== '' ) deleteCookie();

    }, [errorLogin]);
    
    const onSubmit: SubmitHandler<LoginState> = (data) => {
        loginMod 
        ?   login(data)
        :   reg(data);
    }
    
    const onRegister = () => {
        if( isAdmin ){
            // new account
        } else {
            // change to Register mode
            setLoginMod( false );
            reset();
        }
    }

    const onLogin = () => {
        if( isAdmin ){
            // login
        } else {
            // change to login mode
            setLoginMod( true );
            reset();
        }
    }

    return (
        <>
            <Head>
                <title>{ lan.Login_Page.Title.TEXT }</title>
            </Head>
            <div className={`flex flex-row justify-center items-center w-full h-screen bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-gray-100 to-teal-100`}>
                <Card className='p-5 xs:w-[90%] sm:w-[90%] md:w-3/4 mdl:w-3/6 lg:w-2/4 xl:w-2/6 2xl:w-1/4'>
                    {/* <div className='flex justify-center mb-16'>
                        <Link className='no-underline' href={'/'}>
                            <Image src={logoSrc} alt={logoAltTxt} width={0} height={70} sizes='100vw' priority />
                        </Link>
                    </div> */}
                    <h2 className='uppercase text-3xl text-center mb-4'>{loginMod ? lan.Login_Page.Title.TEXT : lan.Login_Page.Title_Register.TEXT}</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <Input
                                id='inUser'
                                label={lan.Login_Page.TextField_User.PLACEHOLDER}
                                autoFocus={true}
                                {...register('user', 
                                    { 
                                        required: lan.Login_Page.TextField_User.MSG_REQUIRED_VALUE,
                                        maxLength: {
                                            value: 45,
                                            message: lan.Login_Page.TextField_User.MSG_NOT_VALID
                                        }
                                    }
                                )} 
                            />
                            <small className='text-red-500'>{errors.user?.message || ''}</small>
                        </div>
                        
                        {
                            !isAdmin && !loginMod &&
                            <div className='my-3'>
                                <Input
                                    id='inEmail'
                                    label={lan.Login_Page.TextField_Email.PLACEHOLDER}
                                    {...register('email', 
                                        { 
                                            required: lan.Login_Page.TextField_Email.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Login_Page.TextField_Email.MSG_NOT_VALID
                                            },
                                            validate: (val: string) => {
                                                if( !val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) )
                                                return lan.Login_Page.TextField_Email.MSG_NOT_VALID
                                            }
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.email?.message || ''}</small>
                            </div>
                        }

                        <div className='my-3'>
                            <label htmlFor='inPass'></label>
                            <Input
                                id='inPass'
                                label={lan.Login_Page.TextField_Password.PLACEHOLDER}
                                type='password'
                                {...register('pass', 
                                    { 
                                        required: lan.Login_Page.TextField_Password.MSG_REQUIRED_VALUE,
                                        // minLength: {
                                        //     value: 8,
                                        //     message: config.TextField_Password.MSG_NOT_VALID || devLocale.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                        // },
                                        maxLength: {
                                            value: 255,
                                            message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                        },
                                    }
                                )}
                            />
                            <small className='text-red-500'>{errors.pass?.message || ''}</small>
                        </div>

                        {
                            !isAdmin && !loginMod &&
                            <div className='my-3'>
                                <Input
                                    id='incPass'
                                    label={lan.Login_Page.TextField_Password.PLACEHOLDER}
                                    type='password'
                                    {...register('cpass', 
                                        { 
                                            required: lan.Login_Page.TextField_Password.PLACEHOLDER,
                                            minLength: {
                                                value: 8,
                                                message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                            },
                                            validate: (val: string) => {
                                                if (watch('pass') !== val) {
                                                    return lan.Login_Page.TextField_Password.MSG_NOT_EQUAL;
                                                }
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.cpass?.message || ''}</small>
                            </div>
                        }
                        <div className='my-3'>
                            <small className='text-red-500'>{errorMsg || ''}</small>
                        </div>
                        
                        <div className='my-5'>
                            {
                                !isAdmin && !loginMod &&
                                <Button
                                    type='submit'
                                    className='w-full my-3'
                                    color='indigo'
                                >
                                    {lan.Login_Page.Button_Register.TEXT}
                                </Button>
                            }
                            
                            {
                                loginMod &&
                                <Button
                                    type='submit'
                                    className='w-full my-3'
                                    color='indigo'
                                >   
                                    {lan.Login_Page.Button_Login.TEXT}
                                </Button>
                            }

                            {
                                !loginMod &&
                                <Button
                                    type='button'
                                    className='w-full my-3'
                                    onClick={onLogin}
                                    color='light-blue'
                                >
                                    {lan.Login_Page.Button_Login.TEXT}
                                </Button>
                            }

                            {
                                loginMod && !isAdmin &&
                                <Button
                                    type='button'
                                    className='w-full my-3'
                                    onClick={onRegister}
                                    color='light-blue'
                                >
                                    {lan.Login_Page.Button_Register.TEXT}
                                </Button>
                            }

                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({req, res, query, locale}) => {

    let errorMsg = '';
    const session = await verifyLogin( req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', [], true );
    const {p, e} = query;

    let lan: LoginProps;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sections: [
                    'Login_Page',
                    'System_Error'
                ]
            })
        });
        lan = await data.json();
    } catch (error) {
        console.log(error);

        return {
            redirect: {
                permanent: false,
                destination: `/500`
            }
        }
    }

    if (session && session !== 'Unauthorized roles' && !e) {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}/${p ? p?.toString() : ''}`
            }
        }
    }

    if(e === 'roles'){
        errorMsg = lan.Login_Page.System_Error_Permissions.TEXT;
    }

    return {
        props: {
            errorLogin: errorMsg,
            isAdmin: true, //Hasta que se habilite el registro
            lan,
        }
    }
}

export default UserLogin;

