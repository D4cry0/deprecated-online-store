import { FC, useReducer, ReactNode } from 'react';
import { FieldSet, LoginState } from '@/interfaces';
import { LoginContext, loginReducer } from './';

const Login_INITIAL_STATE: LoginState = {
    user: '',
    email: '',
    pass: '',
}

interface Props {
    children: ReactNode;
}

export const LoginProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( loginReducer, Login_INITIAL_STATE );


    // Methods with dispatch
    const loginData = ( login: LoginState ) => {
        dispatch( { type: 'Login', payload: login } );
    }

    const setField = ( field: FieldSet, data: string ) => {
        dispatch( { type: '[SET]', payload: { field, data } });
    }


    return (
        <LoginContext.Provider value={{
            state,

            // Methods with dispatch reference
            loginData,
            setField
        }}>
            { children }
        </LoginContext.Provider>
    )
};