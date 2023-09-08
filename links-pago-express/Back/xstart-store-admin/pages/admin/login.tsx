import React, { FC } from 'react'
import { UILogin } from '@/components/templates';
import { LoginProvider } from '@/context/ui.login';
import { LoginPlaceHolders } from '@/interfaces';


const Login: FC = () => {

    const onRegister = () => {

    }

    const onLogin = () => {

    }

    const iFaceProps: LoginPlaceHolders = {
        title: 'REGISTRAR',
        logoSrc: '',
        user: {
            placeholder: 'Nombre',
            msgValue: 'El nombre es obligatorio'
        },
        email: {
            placeholder: 'Correo',
            msgValue: 'El correo es obligatorio'
        },
        pass: {
            placeholder: 'Contraseña',
            requiredMsg: 'La contraseña es obligatoria',
            validateErrorMsg: 'Las contraseñas no coinciden'
        },
        btnRegister: {
            placeholder: 'CREAR CUENTA',
            actionF: onRegister
        },
        btnLogin: {
            placeholder: 'INICIAR SESIÓN',
            actionF: onLogin
        },
        error: ''
    }

    return (
        <LoginProvider >
            <UILogin isAdmin={true} iface={iFaceProps} />
        </LoginProvider>
    );
}

export default Login;