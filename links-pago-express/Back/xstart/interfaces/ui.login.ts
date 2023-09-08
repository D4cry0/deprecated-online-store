

export interface LoginState {
    user: string;
    email: string;
    pass: string;
}

export interface LoginSet {
    field: FieldSet;
    data: string;
}

export type FieldSet = 'user' | 'email' | 'pass';

export interface LoginPlaceHolders {
    title: string;
    logoSrc: string;
    user: {
        placeholder: string;
        msgValue: string;
    }
    email: {
        placeholder: string;
        msgValue: string;
    }
    pass: {
        placeholder: string;
        requiredMsg: string;
        validateErrorMsg: string;
    }
    error: string;
    btnRegister: {
        placeholder: string;
        actionF: (...args: unknown[]) => unknown;
    }
    btnLogin: {
        placeholder: string;
        actionF: (...args: unknown[]) => unknown;
    }
    configMain?: {
        col: string
        row: string
    }
}