import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';

import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Card } from 'react-bootstrap';

import { LoginPlaceHolders, LoginState } from '@/interfaces';
import { LoginLayout } from './_ui.layouts';
import { LoginContext } from '@/context/admin/ui.login';


interface Props {
    isAdmin: boolean
    view: LoginPlaceHolders;
}

export const UILogin: FC<Props> = ({ isAdmin, view }) => {

    const { state, setLoginMod } = useContext( LoginContext );
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<LoginState>();

    useEffect(() => {
        setLoginMod(isAdmin)
    }, []);
    
    const onSubmit: SubmitHandler<LoginState> = (data) => {
        // TODO: 
        console.log(data);
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
        <LoginLayout>
            <Card className='mb-5'>
                <Card.Body className='p-sm-5'>
                    <div className='d-flex justify-content-center mb-5'>
                        <Image src={view.logo.logoSrc} alt={view.logo.alt} height={70} />
                    </div>
                    <h2 className='text-uppercase text-center mb-4'>{state.modeLogin ? view.titleLogin : view.titleRegister}</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <input
                                className='form-control'
                                id='inUser'
                                type='text'
                                placeholder={view.user.placeholder}
                                autoFocus={true}
                                {...register('user', { required: true })} 
                            />
                            {errors.user && <small className='text-danger'>{view.user.msgValue}</small>}
                        </div>
                        
                        <div className='my-3'>
                            <input
                                className='form-control'
                                id='inEmail'
                                type='text'
                                placeholder={view.email.placeholder}
                                {...register('email', { required: true })}
                            />
                            {errors.email && <small className='text-danger'>{view.email.msgValue}</small>}
                        </div>


                        {
                            !isAdmin && !state.modeLogin &&
                            <div className='my-3'>
                                <input
                                    className='form-control'
                                    id='inPass'
                                    type='password'
                                    placeholder={view.pass.placeholder}
                                    {...register('pass', 
                                        { 
                                            required: true,
                                            minLength: {
                                                value: 8,
                                                message: view.pass.validateErrorMsg1
                                            },
                                        }
                                    )}
                                />
                                {errors.pass && <small className='text-danger'>{view.pass.requiredMsg}</small>}
                            </div>
                        }

                        {
                            !isAdmin && !state.modeLogin &&
                            <div className='my-3'>
                                <input
                                    className='form-control'
                                    id='incPass'
                                    type='password'
                                    placeholder={view.pass.placeholder}
                                    {...register('cpass', 
                                        { 
                                            required: view.pass.requiredMsg,
                                            minLength: {
                                                value: 8,
                                                message: view.pass.validateErrorMsg1
                                            },
                                            validate: (val: string) => {
                                                if (watch('pass') !== val) {
                                                    return view.pass.validateErrorMsg2;
                                                }
                                            },
                                        }
                                    )}
                                />
                                <small className='text-danger'>{errors.cpass?.message || ''}</small>
                            </div>
                        }
                        
                        <div className='my-5'>
                            {
                                !isAdmin && !state.modeLogin &&
                                <Button
                                    variant='danger'
                                    type='submit'
                                    className='d-block w-100 my-3'
                                >
                                    {view.btnRegister?.placeholder || ''}
                                </Button>
                            }
                            
                            {
                                state.modeLogin &&
                                <Button
                                    variant='primary'
                                    type='submit'
                                    className='d-block w-100 my-3'
                                >   
                                    {view.btnLogin.placeholder}
                                </Button>
                            }

                            {
                                !state.modeLogin &&
                                <Button
                                    variant='outline-primary'
                                    type='button'
                                    className='d-block w-100 my-3'
                                    onClick={onLogin}
                                >
                                    {view.btnLogin.placeholder}
                                </Button>
                            }

                            {
                                state.modeLogin && !isAdmin &&
                                <Button
                                    variant='outline-danger'
                                    type='button'
                                    className='d-block w-100 my-3'
                                    onClick={onRegister}
                                >
                                    {view.btnRegister?.placeholder || ''}
                                </Button>
                            }

                        </div>
                    </form>
                </Card.Body>
            </Card>
        </LoginLayout>
    )
}
