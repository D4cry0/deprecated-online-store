import React, { FC, useContext } from 'react';

import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { useForm } from "react-hook-form";

import { InformativeInput } from '../molecules';
import { PasswordMatch } from '../organisms/PasswordMatch';

import { LoginContext } from '@/context/ui.login';
import { LoginPlaceHolders } from '@/interfaces';

interface Props {
    isAdmin: boolean
    iface: LoginPlaceHolders;
}

export const UILogin: FC<Props> = ({ isAdmin, iface }) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSetUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField('user', e.target.value);
    }

    const onSetMail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField('email', e.target.value);
    }

    const onSetPass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField('pass', e.target.value);
    }

    const onRegister = () => {
        if( isAdmin === false){
            
        } else {

        }
    }

    const onLogin = () => {
        if( isAdmin === false){
            
        } else {

        }
    }

    return (
        <section className='py-4 py-xl-5'>
            <Container >
                <Row className='d-flex justify-content-center'>
                    <Col md='8' lg='6' xl='5' xxl='4'>
                        <Card className='mb-5'>
                            <Card.Body className='p-sm-5'>
                                <h2 className="text-uppercase text-center mb-4">{iface.title}</h2>

                                <div className="my-3">
                                    <InformativeInput
                                        id='inUser'
                                        inputValue={state.user}
                                        onInputChange={onSetUserName}
                                        type='text'
                                        autoFocus={true}
                                        placeholder={iface.user.placeholder}
                                        msgValue={iface.user.msgValue}
                                    />
                                </div>


                                <div className="my-3">
                                    <InformativeInput
                                        id='inEmail'
                                        inputValue={state.email}
                                        onInputChange={onSetMail}
                                        type='email'
                                        placeholder={iface.email.placeholder}
                                        msgValue={iface.email.msgValue}
                                    />
                                </div>
                                
                                <PasswordMatch
                                    pass={state.pass}
                                    onChangePass={onSetPass}
                                    placeholder={iface.pass.placeholder}
                                    requiredMsg={iface.pass.requiredMsg}
                                    validateErrorMsg={iface.pass.validateErrorMsg}
                                    className='my-3'
                                />


                                <div className="my-5">
                                    <Button
                                        variant='danger'
                                        type='button'
                                        className='d-block w-100 my-3'
                                        onClick={onRegister}
                                    >
                                        {iface.btnRegister.placeholder}
                                    </Button>

                                    <Button
                                        variant='outline-primary'
                                        type='button'
                                        className='d-block w-100 my-3'
                                        onClick={onLogin}
                                    >
                                        {iface.btnLogin.placeholder}
                                    </Button>
                                    <small className="form-text">{iface.error}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
