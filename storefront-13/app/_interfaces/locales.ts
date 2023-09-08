export interface Navbar {
    Button_1: {
        TEXT: string;
    }
    Button_2: {
        TEXT: string;
    }
    Button_3: {
        TEXT: string;
    }
    Button_4: {
        TEXT: string;
    }
    Button_5: {
        TEXT: string;
    }
    Button_User_Settings: {
        TEXT: string;
    }
    Button_Login: {
        TEXT: string;
    }
    Button_Logout: {
        TEXT: string;
    }
}
export interface Hero_Video_Banner {
    Title: {
        TEXT: string;
    }
}
export interface Login_Page {    
    Title: {
        TEXT: string;
    }
    Title_Register: {
        TEXT: string;
    }
    TextField_User: {
        PLACEHOLDER: string;
        MSG_REQUIRED_VALUE: string;
        MSG_NOT_VALID: string;
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
    Button_Register: {
        TEXT: string;
    }
    Button_Login: {
        TEXT: string;
    }
    System_Error_Password: {
        TEXT: string;
    }
    System_Error_Permissions: {
        TEXT: string;
    }
}
export interface Logout_Page {
    Title: {
        TEXT: string;
    }
    Msg_Logout: {
        TEXT: string;
    }
}
export interface Verify_Account_Page {
    Title: {
        TEXT: string;
    }
    Create_Account: {
        TEXT: string;
    }
    Select_Dropdown_Placeholder: {
        TEXT: string;
    }
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
    Button_Verify: {
        TEXT: string;
    }
    Msg_Account_Verified: {
        TEXT: string;
    }
    Msg_Saved: {
        TEXT: string;
    }
    System_Error_Link_Expire: {
        TEXT: string;
    }
    System_Error_Account_Details: {
        TEXT: string;
    }
    System_Error_Account_Active: {
        TEXT: string;
    }
}
export interface System_Error {
    Server_1000: {
        TEXT: string;
    }
    Db_1000: {
        TEXT: string;
    }
}