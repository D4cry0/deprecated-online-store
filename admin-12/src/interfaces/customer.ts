

export interface CustomerInformation {
    idUsr: number;

    // pass: string;
    email: string;
    contact_name: string;
    contact_last_name: string;
    company: string;
    orgname: string;
    phone: string;
    phone_code_list: {
        ladaOption: string;
        ctryLada: string;
    }[];
    phone_ctry_code: string;
    tax_id: string;
    contact_promotions: string;
    contact_notifications: string;

    // To UI
    // apass: string;
    // cpass: string;
    errMsg: string;
    errCode: string;
}

export interface CustomerAddresses {
    idCu: number;

    parcel_suppliers_list: {
        idPars: number;
        parsName: string;
    }[];
    states_list: {
        idSt: number;
        stateName: string;
        country: number;
    }[];
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

    addresses: CustomerSingleAddress[],

    // To UI
    errCode: string;
    errMsg: string;
}

export interface CustomerSingleAddress {
    idCushadd: number;
    idAdd: number;
    contact: string;
    phone: string;
    primary: boolean;
    parcel_supplier: string;
    addresses: {
        address: string;
        second_address: string;
        ext_number: string;
        int_number: string;
        district: string;
        postal_code: string;
        city: string;
        state: string;
        country: string;
        reference: string;
    },
    phone_ctry_code: string;
}