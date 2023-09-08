import { createContext } from 'react';
import { FieldSet, LoginState } from '../../interfaces/ui.login';

interface ContextProps {
    state: LoginState;

    // Methods provider's definitions
    loginData: ( login: LoginState ) => void;
    setField: ( field: FieldSet, data: string ) => void;
}

export const LoginContext = createContext<ContextProps>({} as ContextProps);