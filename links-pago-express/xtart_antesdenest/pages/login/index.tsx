import React from 'react';

import { NextPage } from 'next';


import { LoginProvider } from '@/context/admin/ui.login';
import { LoginPlaceHolders } from '@/interfaces';

import Logo from '../../public/assets/img/logo-v4.2-noshadow.svg'
import { UILogin } from '@/components/templates';

const UserLogin: NextPage = () => {

    const viewProps: LoginPlaceHolders = {
        titleLogin: 'INICIAR SESIÓN',
        titleRegister: 'REGISTRAR',
        logo: {
            logoSrc: Logo,
            alt: 'Logo'
        },
        user: {
            placeholder: 'Nombre completo',
            msgValue: 'El nombre es obligatorio'
        },
        email: {
            placeholder: 'Correo electrónico',
            msgValue: 'El correo electrónico es obligatorio'
        },
        pass: {
            placeholder: 'Contraseña',
            requiredMsg: 'La contraseña es obligatoria',
            validateErrorMsg1: 'Las contraseñas no coinciden',
            validateErrorMsg2: 'La contraseña debe se mínimo de 8 dígitos y contener al menos: un símbolo, números, minúsculas y mayúsculas.'
        },
        error: '',
        btnRegister: {
            placeholder: 'CREAR CUENTA'
        },
        btnLogin: {
            placeholder: 'INICIAR SESIÓN'
        },
    }

    return (
        <LoginProvider >
            <UILogin isAdmin={false} view={viewProps} />
        </LoginProvider>
    );
}

export default UserLogin;