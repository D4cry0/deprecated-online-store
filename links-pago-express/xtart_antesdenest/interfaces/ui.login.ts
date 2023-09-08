

export interface LoginState {
    // DATA to Server
    user: string;
    email: string;
    pass: string;

    // Utils to UI
    cpass: string;
    modeLogin: boolean;
    success: boolean;
    errMsg: string;
}

export interface LoginSet {
    field: FieldSet;
    data: string;
}

export type FieldSet = 'user' | 'email' | 'pass';

export interface LoginPlaceHolders {
    titleLogin: string;
    titleRegister: string;
    logo: {
        logoSrc: any,
        alt: string
    },
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
        validateErrorMsg1: string;
        validateErrorMsg2?: string;
    }
    error: string;
    btnRegister?: {
        placeholder?: string;
    }
    btnLogin: {
        placeholder: string;
    }
    configMain?: {
        col: string
        row: string
    }
}