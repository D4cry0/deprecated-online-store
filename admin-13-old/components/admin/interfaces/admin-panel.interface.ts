export interface AdminPanelState {
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

export interface AdminPanelSet {
    field: AdminPanelFieldSet;
    data: string;
}

export type AdminPanelFieldSet = 'user' | 'email' | 'pass';