
export interface LoginState {
    // To Server
    user: string;
    email: string;
    pass: string;

    // To UI
    cpass: string;
    modeLogin: boolean;
    success: boolean;
    errMsg: string;
}