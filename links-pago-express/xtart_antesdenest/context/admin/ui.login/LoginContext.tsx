import { createContext } from 'react';
import { FieldSet, LoginState } from '../../../interfaces/ui.login';

interface ContextProps {
    state: LoginState;

    // Methods provider's definitions
    setLoginMod: ( login: boolean ) => void;
    setField: ( field: FieldSet, data: string ) => void;
    login: ( ) => void;
}

export const LoginContext = createContext<ContextProps>({} as ContextProps);