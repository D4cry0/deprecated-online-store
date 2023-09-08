export interface VerifyAccState {

    // To Server
    idCu: number;
    idCon: number;
    idAdd: number;
    idUsr: number;
    idUsrSys: number;
    idOrg: number;
    idCushadd: number;

    user: string;
    pass: string;
    email: string;

    contact_name: string;
    contact_last_name: string;
    company: string;
    orgname: string;
    phone: string;
    phoneCtryCode: string;
    tax_id: string;
    idParcel: number;
    parcel_supplier: string;
    parcel_suppliers_list: {
        idPars: number;
        parsName: string;
    }[];
    destiny: string;

    address: string;
    second_address: string;
    ext_number: string;
    int_number: string;
    district: string;
    postal_code: string;
    city: string;
    idState: number;
    state: string;
    states_list: {
        idSt: number;
        stateName: string;
        country: number;
    }[];
    idCountry: number;
    country: string;
    countries_list: {
        idCtry: number;
        ctryName: string;
        ctryLada: string;
        ctryAbbrev: string;
    }[];
    phone_code_list: {
        ladaOption: string;
        ctryLada: string;
    }[];
    reference: string;

    // To UI
    hasAccount: boolean;
    cpass: string;
    createAccount: boolean;
    confirmed: number;
    err: {
        errMsg: string;
        errCode: VerifyAccErrCode;
    }
}
export type VerifyAccErrCode = 'none' | 'server' | 'link' | 'customer';