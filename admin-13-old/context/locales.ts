import dev from '../dev.json' assert { type: 'json' };

export const getLocale = (locale: string) => {

    switch (locale) {
        case 'en':
            return LocalesNavMenu['en'];
        case 'zh':
            return LocalesNavMenu['zh'];
        case 'es':
            return LocalesNavMenu['es'];
        default:
            return LocalesNavMenu['dev'];
    }
}

export const LocalesNavMenu = {
    'es': {
        UINavMenu: {
            BUTTON_1: 'PROMOCIONES',
            BUTTON_2: 'CATÁLOGO',
            BUTTON_3: 'CATÁLOGO POR CÓDIGOS',
            BUTTON_4: 'SERVICIOS',
            BUTTON_5: 'NOSOTROS',
            BUTTON_USER_SETTINGS: 'Cuenta'
        }
    },
    'en': {
        UINavMenu: {
            BUTTON_1: 'DEALS',
            BUTTON_2: 'CATALOG',
            BUTTON_3: 'CATALOG BY CODES',
            BUTTON_4: 'SERVICIOS',
            BUTTON_5: 'ABOUT US',
            BUTTON_USER_SETTINGS: 'Account'
        }
    },
    'zh': {
        UINavMenu: {
            BUTTON_1: 'DEALS',
            BUTTON_2: 'CATALOG',
            BUTTON_3: 'CATALOG BY CODES',
            BUTTON_4: 'SERVICIOS',
            BUTTON_5: 'ABOUT US',
            BUTTON_USER_SETTINGS: 'Account'
        }
    },
    'dev': {
        UINavMenu: {
            BUTTON_1: 'PROMOCIONES',
            BUTTON_2: 'CATÁLOGO',
            BUTTON_3: 'CATÁLOGO POR CÓDIGOS',
            BUTTON_4: 'SERVICIOS',
            BUTTON_5: 'NOSOTROS',
            BUTTON_USER_SETTINGS: 'Cuenta'
        }
    },
}

// export const getLocaleLada = (locale: string) => {

//     switch (locale) {
//         case 'en':
//             return '+1';
//         case 'zh':
//             return '+86'
//         case 'es':
//             return '+52';
//         default:
//             return '+52';
//     }
// }

// export const getLocaleCountry = (locale: string) => {

//     switch (locale) {
//         case 'en':
//             return LocalesNavMenu['en'];
//         case 'zh':
//             return LocalesNavMenu['zh'];
//         case 'es':
//             return LocalesNavMenu['es'];
//         default:
//             return LocalesNavMenu['dev'];
//     }
// }

export const devLocale: LocalesInterface = dev;

export interface LocalesInterface {
    Hero_Video_Banner: {
        TITLE: string;
    }
    Login_Page: {    
        TITLE: string;
        TITLE_REGISTER: string;
        TextField_User: {
            PLACEHOLDER: string,
            MSG_REQUIRED_VALUE: string,
            MSG_NOT_VALID: string,
            MSG_DUPLICATE_USER: string;
        }
        TextField_Password: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string; 
            MSG_NOT_EQUAL: string; 
            MSG_NOT_VALID: string; 
        }
        TextField_Email: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
            MSG_DUPLICATE_EMAIL: string;
        }
        BUTTON_REGISTER: string; 
        BUTTON_LOGIN: string; 
        SYSTEM_ERROR_PASSWORD: string; 
        SYSTEM_ERROR_PERMISSIONS: string; 
    }
    Logout_Page: {
        TITLE: string; 
        MSG_LOGOUT: string; 
    }
    Verify_Account_Page: {
        TITLE: string;
        CREATE_ACCOUNT: string;
        SELECT_DROPDOWN_PLACEHOLDER: string;
        TextField_Contact_Name: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_Last_Name: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_Company: {
            PLACEHOLDER: string;
            MSG_NOT_VALID: string;
        }
        TextField_Org_Name: {
            PLACEHOLDER: string;
            MSG_NOT_VALID: string;
        }
        TextField_Phone: {
            PLACEHOLDER: string;
            PLACEHOLDER_FORMAT: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
            MSG_DUPLICATE_PHONE: string;
        }
        TextField_Tax_Id: {
            PLACEHOLDER: string;
            MSG_NOT_VALID: string;
        }
        Select_Parcel_Supplier: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
        }
        Select_Destiny: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
        }
        TextField_Address: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_Second_Address: {
            PLACEHOLDER: string;
            MSG_NOT_VALID: string;
        }
        Label_Ext_Int_Number: {
            TEXT: string;
        }
        TextField_Ext_Number: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_Int_Number: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_District: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_Postal_Code: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        TextField_City: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
            MSG_NOT_VALID: string;
        }
        Select_State: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
        }
        Select_Country: {
            PLACEHOLDER: string;
            MSG_REQUIRED_VALUE: string;
        }
        TextArea_Reference: {
            PLACEHOLDER: string;
            MSG_NOT_VALID: string;
        }
        BUTTON_VERIFY: string;
        MSG_ACCOUNT_VERIFIED: string;
        MSG_SAVED: string;
        SYSTEM_ERROR_LINK_EXPIRE: string;
        SYSTEM_ERROR_ACCOUNT_DETAILS: string;
        SYSTEM_ERROR_ACCOUNT_ACTIVE: string;
    }
    SYSTEM_ERROR: string;
    SYSTEM_DB_ERROR: string;
}