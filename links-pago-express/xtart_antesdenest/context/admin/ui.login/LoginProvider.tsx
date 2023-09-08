import { FC, useReducer, ReactNode } from 'react';
import { FieldSet, LoginState } from '@/interfaces';
import { LoginContext, loginReducer } from './';

const Login_INITIAL_STATE: LoginState = {
    user: '',
    email: '',
    pass: '',
    cpass: '',
    modeLogin: false,
    success: false,
    errMsg: '',
}

interface Props {
    children: ReactNode;
}

export const LoginProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( loginReducer, Login_INITIAL_STATE );


    // Methods with dispatch
    const setLoginMod = ( isLogin: boolean ) => {
        dispatch( { type: '[MOD-LOGIN]', payload: isLogin } );
    }

    const setField = ( field: FieldSet, data: string ) => {
        dispatch( { type: '[SET]', payload: { field, data } });
    }

    const login = () => {
        // TODO: LLAMADO A LA API
    }


    return (
        <LoginContext.Provider value={{
            state,

            // Methods with dispatch reference
            setLoginMod,
            setField,
            login,
        }}>
            { children }
        </LoginContext.Provider>
    )
};