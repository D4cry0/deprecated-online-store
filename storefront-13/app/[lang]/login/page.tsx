'use client'

import React, { use, useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useParams, redirect } from 'next/navigation';

import { signIn, useSession } from 'next-auth/react';

import { Card, Input, Button } from '@material-tailwind/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { LoginState, Login_Page, System_Error } from '../../_interfaces';

interface LoginProps {
    Login_Page: Login_Page;
    System_Error: System_Error;
}

const useGetLocale = async (): Promise<LoginProps> => {
    const lang = useParams().lang;

    try {
        const data = await fetch(`${process.env.HOSTURL}/api/v1/locales/${lang}`, {
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
        const json = await data.json();
        return json;
    } catch (error) {
        console.log(error);
        redirect(`/${lang}/404`);
    }
};

export default async function UserLogin() {
    const locale = useParams().lang;
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const p = searchParams.get('p');
    const callbackUrl = searchParams.get('callbackUrl');
    const e = searchParams.get('callbackUrl');
    const { data: session } = useSession();

    const [loginMod, setLoginMod] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const lan: LoginProps = use(useGetLocale());
    // can be optimized for more query parameters
    let cp = '/';
    let ce = '';
    if (callbackUrl) {
        // console.log('Hosturl: ', process.env.HOSTURL) ;     
        const callbackLocale = callbackUrl.toString().split(process.env.HOSTURL || '')[1].split('/')[1];
        // console.log({callbackLocale})
        if (locale && callbackLocale !== locale && callbackLocale?.length == 2) {
            redirect(`/${callbackLocale}/login?callbackUrl=${callbackUrl}&error=${error}`);
        }


        const qry = callbackUrl.toString().split('?')[1].split('&');
        qry.map(ele => {
            const buff = ele.split('=');
            console.log({ buff });
            if (buff[0] === 'p') cp = buff[1];
            if (buff[0] === 'e') ce = buff[1];
        });
    }

    if (session && !e && ce === '') {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}/${p?.toString() ? p?.toString() : cp}`
            }
        }
    }

    if (error && error === 'CredentialsSignin') {
        setErrorMsg(lan.Login_Page.System_Error_Password.TEXT);
    }

    if (e === 'roles' || ce === 'roles') {
        setErrorMsg(lan.Login_Page.System_Error_Permissions.TEXT);
    }

    const isAdmin = p === '/admin' || cp === '/admin';

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<LoginState>();

    const login = async ({ user, pass }: LoginState) => {

        try {
            const r = await fetch(`${process.env.HOSTURL}/api/v1/auth/login`, {
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

            if (!r.ok && r.status != 200) {
                const msg = await r.json();
                if (msg?.cause === 'Bad credentials') {
                    setErrorMsg(lan.Login_Page.System_Error_Password.TEXT);
                } else {
                    setErrorMsg(lan.Login_Page.System_Error_Permissions.TEXT);
                }
            } else
                await signIn('credentials', { user, pass });


        } catch (error) {
            setErrorMsg(lan.System_Error.Server_1000.TEXT)
        }
    }

    const reg = async (data: LoginState) => {
        // TODO: REGISTER
    }

    useEffect(() => {
        setLoginMod(isAdmin);
    }, []);

    const onSubmit: SubmitHandler<LoginState> = async (data) => {
        loginMod
            ? login(data)
            : reg(data);
    }

    const onRegister = () => {
        if (isAdmin) {
            // new account
        } else {
            // change to Register mode
            setLoginMod(false);
            reset();
        }
    }

    const onLogin = () => {
        if (isAdmin) {
            // login
        } else {
            // change to login mode
            setLoginMod(true);
            reset();
        }
    }

    return (
        <Card>
            <div className='sm:p-5'>
                <div className='flex justify-center mb-16'>
                    <Link className='no-underline' href={'/'}>
                        <Image src='/assets/img/logo.png' alt='Logo' width={0} height={70} sizes='100vw' priority />
                    </Link>
                </div>
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
                                            if (!val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
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
            </div>
        </Card>
    );
}
