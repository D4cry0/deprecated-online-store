import React, { useContext, useState } from 'react';

import { NextPage, GetServerSideProps } from 'next';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { useForm, SubmitHandler } from "react-hook-form";

import * as fs from 'fs';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

import { prisma } from '../../../services/prisma';
import { VerifyAccErrCode, VerifyAccState } from '@/templates/interfaces/verify-account/interfaces';
import { LocalesInterface, devLocale } from '../../../locales';
import { GlobalAppContext } from '@/context/GlobalAppContext';
import { LoginLayout } from '@/templates/layouts';


interface Props {
    qData: VerifyAccState;
    host: string;
    lan: LocalesInterface;
    locale: string;
}

const VerifyAccount: NextPage<Props> = ({ qData, host, lan, locale }) => {

    const { logoSrc, logoAltTxt } = useContext( GlobalAppContext );

    const [ newAccount, setNewAccount ] = useState(false);
    const [ hasExtNum, setHasExtNum ] = useState(!!qData.ext_number);
    const [ hasIntNum, setHasIntNum ] = useState(!!qData.int_number);
    const [ lada, setLada ] = useState(qData.phoneCtryCode || '+52');
    const [ country, setCountry ] = useState(qData.idCountry);

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm<VerifyAccState>();

    const validateUsersDataAviable = async(data: string, idUser: number) => {
    
        try {
            const res = await fetch( `${host}/api/v1/auth/verify/user/${data}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const userData = await res.json();
            
            // esta disponible
            if( !userData.idUser ) return true;
            
            if( userData.idUser &&userData.idUser  !== idUser ) return false;

            return true;
        } catch (error) {
            return false;
        }
    }
    
    const onSubmit: SubmitHandler<VerifyAccState> = async(data) => {

        qData.err.errMsg = '';
        qData.err.errCode = 'none';

        if(!await validateUsersDataAviable(data.user, qData.idUsr)) {
            qData.err.errMsg = lan.Login_Page.TextField_User.MSG_DUPLICATE_USER || devLocale.Login_Page.TextField_User.MSG_DUPLICATE_USER;
            qData.err.errCode = 'server';
        }
        if(!await validateUsersDataAviable(data.email, qData.idUsr)) {
            qData.err.errMsg = lan.Login_Page.TextField_Email.MSG_DUPLICATE_EMAIL || devLocale.Login_Page.TextField_Email.MSG_DUPLICATE_EMAIL;
            qData.err.errCode = 'server';
        }
        if(!await validateUsersDataAviable(data.phone, qData.idUsr)) {
            qData.err.errMsg = lan.Verify_Account_Page.TextField_Phone.MSG_DUPLICATE_PHONE || devLocale.Verify_Account_Page.TextField_Phone.MSG_DUPLICATE_PHONE;
            qData.err.errCode = 'server';
        }

        if(!qData.err.errMsg) {
            try {
                const r = await fetch( `${host}/api/v1/auth/verify/${qData.idCu}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify({
                        ...data,
                        user: qData.hasAccount ? qData.user : data.user,
                        idCon: qData.idCon,
                        idAdd: qData.idAdd,
                        idUsr: qData.idUsr,
                        idUsrSys: qData.idUsrSys,
                        idOrg: qData.idOrg,
                        idCushadd: qData.idCushadd,
                        phone: lada + '-' + data.phone
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(await r.json());

                if( r.ok && r.status == 200 ){
                    qData.err.errCode = 'link';
                    qData.err.errMsg = lan.Verify_Account_Page.MSG_SAVED || devLocale.Verify_Account_Page.MSG_SAVED;
                } else {
                    qData.err.errCode = 'server';
                    qData.err.errMsg = lan.SYSTEM_ERROR || devLocale.SYSTEM_ERROR;
                }
            } catch (error) {
                qData.err.errCode = 'server';
                qData.err.errMsg = lan.SYSTEM_ERROR || devLocale.SYSTEM_ERROR;
            }
        }
    }

    const onCreateNewAccount = () => {
        setNewAccount( !newAccount );
    }

    // TODO: Refactorizar para que se generen los campos de manera recursiva FormControl.tsx
    return (
        
        <LoginLayout title={ lan.Verify_Account_Page.TITLE || devLocale.Verify_Account_Page.TITLE }>
            <div className='mb-5'>
                <div className='mb:p-5 border-slate-600 border-l'>
                    <div className='flex justify-content-center mb-5'>
                        <Link className='no-underline' href={'/'}>
                            <Image src={logoSrc} alt={logoAltTxt} height={70} priority />
                        </Link>
                    </div>
                    <h2 className='uppercase text-center mb-4'>{ lan.Verify_Account_Page.TITLE || devLocale.Verify_Account_Page.TITLE }</h2>
                    
                    {
                        (qData.err.errCode === 'none' || qData.err.errCode === 'server') &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <small>Campos obligatorios  <span className='text-red-500 text-sm'>*</span> </small>
                            </div>
                            {
                                !qData.hasAccount &&
                                <div className='flex flex-row'>
                                    <Checkbox inputId='inCreateNewUser' checked={false} onChange={onCreateNewAccount} />
                                    <label htmlFor='inCreateNewUser' className="mx-2">{ lan.Verify_Account_Page.CREATE_ACCOUNT || devLocale.Verify_Account_Page.CREATE_ACCOUNT }</label>
                                </div>
                            }
                            {
                                newAccount &&
                                <>
                                    <div className='my-3'>
                                        <label htmlFor='inUser'>
                                            {lan.Login_Page.TextField_User.PLACEHOLDER || devLocale.Login_Page.TextField_User.PLACEHOLDER}
                                            <span className='text-red-500 text-sm'>*</span>
                                        </label>
                                        <InputText
                                            className='p-inputtext-sm'
                                            id='inUser'
                                            type='text'
                                            placeholder={lan.Login_Page.TextField_User.PLACEHOLDER || devLocale.Login_Page.TextField_User.PLACEHOLDER}
                                            autoFocus={true}
                                            {...register('user', 
                                            { 
                                                    value:qData.user,
                                                    required: lan.Login_Page.TextField_User.MSG_REQUIRED_VALUE || devLocale.Login_Page.TextField_User.MSG_REQUIRED_VALUE,
                                                    maxLength: {
                                                        value: 45,
                                                        message: lan.Login_Page.TextField_User.MSG_NOT_VALID || devLocale.Login_Page.TextField_User.MSG_NOT_VALID
                                                    },
                                                }
                                            )} 
                                        />
                                        <small className='text-red-500'>{errors.user?.message || ''}</small>
                                    </div>
                                    <div className='my-3'>
                                        <label htmlFor='inPass'>
                                            {lan.Login_Page.TextField_Password.PLACEHOLDER || devLocale.Login_Page.TextField_Password.PLACEHOLDER}
                                            <span className='text-red-500 text-sm'>*</span>
                                        </label>
                                        <InputText
                                            className='p-inputtext-sm'
                                            id='inPass'
                                            type='password'
                                            placeholder={lan.Login_Page.TextField_Password.PLACEHOLDER || devLocale.Login_Page.TextField_Password.PLACEHOLDER}
                                            {...register('pass', 
                                                { 
                                                    required: lan.Login_Page.TextField_Password.MSG_REQUIRED_VALUE || devLocale.Login_Page.TextField_Password.MSG_REQUIRED_VALUE,
                                                    minLength: {
                                                        value: 8,
                                                        message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || devLocale.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                                    },
                                                }
                                            )}
                                        />
                                        <small className='text-red-500'>{errors.pass?.message || ''}</small>
                                    </div>
                                    <div className='my-3'>
                                        <InputText
                                            className='p-inputtext-sm'
                                            id='incPass'
                                            type='password'
                                            placeholder={lan.Login_Page.TextField_Password.PLACEHOLDER || devLocale.Login_Page.TextField_Password.PLACEHOLDER}
                                            {...register('cpass', 
                                                { 
                                                    required: lan.Login_Page.TextField_Password.MSG_REQUIRED_VALUE || devLocale.Login_Page.TextField_Password.MSG_REQUIRED_VALUE,
                                                    minLength: {
                                                        value: 8,
                                                        message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || devLocale.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                                    },
                                                    validate: (val: string) => {
                                                        if (watch('pass') !== val) {
                                                            return lan.Login_Page.TextField_Password.MSG_NOT_EQUAL || devLocale.Login_Page.TextField_Password.MSG_NOT_EQUAL;
                                                        }
                                                    },
                                                }
                                            )}
                                        />
                                        <small className='text-red-500'>{errors.cpass?.message || ''}</small>
                                    </div>
                                    <hr />
                                </>
                            }
                            
                            

                            <div className='my-3'>
                                <label htmlFor='inName'>
                                    {lan.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inName'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER}
                                    autoFocus={true}
                                    {...register('contact_name', 
                                    { 
                                            value: qData.contact_name,
                                            required: lan.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID || ''
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.contact_name?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inLastName'>
                                    {lan.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inLastName'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER}
                                    autoFocus={true}
                                    {...register('contact_last_name', 
                                    { 
                                            value: qData.contact_last_name,
                                            required: lan.Verify_Account_Page.TextField_Last_Name.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Last_Name.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Last_Name.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Last_Name.MSG_REQUIRED_VALUE
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.contact_last_name?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inEmail'>
                                    {lan.Login_Page.TextField_Email.PLACEHOLDER || devLocale.Login_Page.TextField_Email.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inEmail'
                                    type='text'
                                    placeholder={lan.Login_Page.TextField_Email.PLACEHOLDER || devLocale.Login_Page.TextField_Email.PLACEHOLDER}
                                    {...register('email', 
                                    { 
                                            value: qData.email,
                                            required: lan.Login_Page.TextField_Email.MSG_REQUIRED_VALUE || devLocale.Login_Page.TextField_Email.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Login_Page.TextField_Email.MSG_NOT_VALID || devLocale.Login_Page.TextField_Email.MSG_NOT_VALID
                                            },
                                            validate: async(val: string) => {

                                                if( !val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) )
                                                    return lan.Login_Page.TextField_Email.MSG_NOT_VALID || devLocale.Login_Page.TextField_Email.MSG_NOT_VALID;
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.email?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inPhone'>
                                    {lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Phone.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <div className="p-inputgroup">
                                    <Dropdown
                                        id='inLada'
                                        value={qData.phoneCtryCode || '+52 MEX'}
                                        optionLabel="ladaOption"
                                        optionValue='ctryLada'
                                        options={qData.phone_code_list}
                                        onChange={(event) => setLada(event.target.value)}
                                        className='p-dropdown-sm w-2/6'
                                    />

                                    {/* <select id='inLada' className="form-select form-select-sm w-25" 
                                        defaultValue={ qData.phoneCtryCode || '+52'}
                                        onChange={(event) => setLada(event.target.value)}
                                    >
                                        { 
                                            qData.countries_list.map(( val ) => (
                                                <option
                                                    key={val.idCtry}
                                                    value={'+'+val.ctryLada}
                                                >
                                                    +{val.ctryLada} - {val.ctryAbbrev}
                                                </option>
                                            ))
                                        }
                                    </select> */}
                                    <InputText
                                        className='p-inputtext-sm w-4/6'
                                        id='inPhone'
                                        type='text'
                                        maxLength={11}
                                        placeholder={ lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT || devLocale.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT }
                                        {...register('phone', 
                                            { 
                                                value: qData.phone,
                                                required: lan.Verify_Account_Page.TextField_Phone.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Phone.MSG_REQUIRED_VALUE,
                                                maxLength: {
                                                    value: 45,
                                                    message: lan.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID
                                                },
                                                validate: async(val: string) => {

                                                    if( !val.match(/^[0-9]{2}-[0-9]{8}$/) )
                                                        return lan.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID;
                                                }
                                            }
                                        )}
                                    />
                                </div>
                                <small className='text-red-500'>{ errors.phone?.message || '' }</small>
                                <small className='text-slate-800 font-bold'>{ (qData.confirmed < 1 && !errors.phone && lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT) || (qData.confirmed < 1 && !errors.phone && devLocale.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT) }</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inCompany'>{lan.Verify_Account_Page.TextField_Company.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Company.PLACEHOLDER}</label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inCompany'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Company.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Company.PLACEHOLDER}
                                    autoFocus={true}
                                    {...register('company', 
                                    { 
                                            value: qData.company,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Company.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Company.MSG_NOT_VALID
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.company?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inOrgName'>{lan.Verify_Account_Page.TextField_Org_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Org_Name.PLACEHOLDER}</label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inOrgName'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Org_Name.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Org_Name.PLACEHOLDER}
                                    autoFocus={true}
                                    {...register('orgname', 
                                    { 
                                            value: qData.orgname,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Org_Name.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Org_Name.MSG_NOT_VALID
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.company?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inTaxId'>{lan.Verify_Account_Page.TextField_Tax_Id.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Tax_Id.PLACEHOLDER}</label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inTaxId'
                                    type='text'
                                    maxLength={13}
                                    placeholder={lan.Verify_Account_Page.TextField_Tax_Id.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Tax_Id.PLACEHOLDER}
                                    {...register('tax_id', 
                                    { 
                                            value: qData.tax_id,
                                            required: false,
                                            maxLength: {
                                                value: 15,
                                                message: lan.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID
                                            },
                                            validate: async(val: string) => {
                                                if( !val.match(/^([A-Z&Ññ]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([A\d])$/) )
                                                    return lan.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID;
                                            }
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.tax_id?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inParcelSupplier'>
                                    {lan.Verify_Account_Page.Select_Parcel_Supplier.PLACEHOLDER || devLocale.Verify_Account_Page.Select_Parcel_Supplier.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>  

                                <Dropdown
                                    id='inParcelSupplier'
                                    value={qData.idParcel > -1 ? qData.idParcel.toString() : '0'}
                                    optionLabel="parsName"
                                    optionValue='idPars'
                                    options={qData.parcel_suppliers_list}
                                    className='p-dropdown-sm'
                                    {...register('parcel_supplier', 
                                        {
                                            value: qData.idParcel > -1 ? qData.idParcel.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                />

                                {/* <select 
                                    id='inParcelSupplier' 
                                    className="form-select form-select-sm" 
                                    {...register('parcel_supplier', 
                                        {
                                            value: qData.idParcel > -1 ? qData.idParcel.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER || devLocale.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER}</option>
                                    { 
                                        qData.parcel_suppliers_list.map(( val ) => (
                                            <option
                                                key={val.idPars}
                                                value={val.idPars}
                                            >
                                                {val.parsName}
                                            </option>
                                        ))
                                    }

                                </select> */}
                                <small className='text-red-500'>{errors.parcel_supplier?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inAddress'>
                                    {lan.Verify_Account_Page.TextField_Address.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Address.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inAddress'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Address.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Address.PLACEHOLDER}
                                    {...register('address', 
                                    { 
                                            value: qData.address,
                                            required: lan.Verify_Account_Page.TextField_Address.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Address.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 100,
                                                message: lan.Verify_Account_Page.TextField_Address.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Address.MSG_NOT_VALID
                                            },

                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.address?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inSecondAddress'>{lan.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER}</label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inSecondAddress'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER}
                                    {...register('second_address', 
                                        { 
                                            value: qData.second_address,
                                            maxLength: {
                                                value: 100,
                                                message: lan.Verify_Account_Page.TextField_Second_Address.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Second_Address.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.second_address?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inExtNumber'>
                                    {lan.Verify_Account_Page.Label_Ext_Int_Number.TEXT || devLocale.Verify_Account_Page.Label_Ext_Int_Number.TEXT}
                                </label>
                                <div className='flex flex-row gap-2'>
                                    <div className='flex flex-row gap-1'> 
                                        <Checkbox checked={hasExtNum} 
                                            onChange={() => {
                                                setValue('ext_number', !hasExtNum ? qData.ext_number : '-' );
                                                setHasExtNum( !hasExtNum );
                                            }} 
                                        />
                                        <label htmlFor='inExtNumber'>
                                            {lan.Verify_Account_Page.TextField_Ext_Number.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Ext_Number.PLACEHOLDER}
                                            { hasExtNum && <span className='text-red-500 text-sm'>*</span> }
                                        </label>
                                        <InputText
                                            className='p-inputtext-sm'
                                            disabled={ !hasExtNum }
                                            id='inExtNumber'
                                            type='text'
                                            placeholder={lan.Verify_Account_Page.TextField_Ext_Number.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Ext_Number.PLACEHOLDER}
                                            {...register('ext_number',
                                                {
                                                    value: qData.ext_number || '-',
                                                    required: lan.Verify_Account_Page.TextField_Ext_Number.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Ext_Number.MSG_REQUIRED_VALUE,
                                                    maxLength: {
                                                        value: 5,
                                                        message: lan.Verify_Account_Page.TextField_Ext_Number.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Ext_Number.MSG_NOT_VALID
                                                    },
                                                }
                                            )}
                                        />
                                    </div>
                                    <div className='flex flex-row gap-1'>
                                        <Checkbox checked={hasIntNum} 
                                            onChange={() => {
                                                setValue('int_number', !hasIntNum ? qData.int_number : '-' );
                                                setHasIntNum( !hasIntNum );
                                            }} 
                                        />
                                        <label htmlFor='inIntNumber'>
                                            {lan.Verify_Account_Page.TextField_Int_Number.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Int_Number.PLACEHOLDER}
                                            { hasIntNum && <span className='text-red-500 text-sm'>*</span> }
                                        </label>
                                        <InputText
                                            className='p-inputtext-sm'
                                            disabled={ !hasIntNum }
                                            id='inIntNumber'
                                            type='text'
                                            placeholder={lan.Verify_Account_Page.TextField_Int_Number.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Int_Number.PLACEHOLDER}
                                            {...register('int_number',
                                                {
                                                    value: qData.int_number || '-',
                                                    required: lan.Verify_Account_Page.TextField_Int_Number.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Int_Number.MSG_REQUIRED_VALUE,
                                                    maxLength: {
                                                        value: 5,
                                                        message: lan.Verify_Account_Page.TextField_Int_Number.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_Int_Number.MSG_NOT_VALID
                                                    },
                                                }
                                            )}
                                        />
                                    </div>
                                </div>
                                <small className='text-red-500'>{errors.int_number?.message || errors.ext_number?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inDistrict'>
                                    {lan.Verify_Account_Page.TextField_District.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_District.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inDistrict'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_District.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_District.PLACEHOLDER}
                                    {...register('district', 
                                    { 
                                            value: qData.district,
                                            required: lan.Verify_Account_Page.TextField_District.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_District.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 120,
                                                message: lan.Verify_Account_Page.TextField_District.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_District.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.district?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inPostalCode'>
                                    {lan.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inPostalCode'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER}
                                    {...register('postal_code', 
                                        { 
                                            value: qData.postal_code,
                                            required: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 10,
                                                message: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.postal_code?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <label htmlFor='inCity'>
                                    {lan.Verify_Account_Page.TextField_City.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_City.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>
                                <InputText
                                    className='p-inputtext-sm'
                                    id='inCity'
                                    type='text'
                                    placeholder={lan.Verify_Account_Page.TextField_City.PLACEHOLDER || devLocale.Verify_Account_Page.TextField_City.PLACEHOLDER}
                                    {...register('city', 
                                    { 
                                            value: qData.city,
                                            required: lan.Verify_Account_Page.TextField_City.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.TextField_City.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 30,
                                                message: lan.Verify_Account_Page.TextField_City.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextField_City.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.city?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inState'>
                                    {lan.Verify_Account_Page.Select_State.PLACEHOLDER || devLocale.Verify_Account_Page.Select_State.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>

                                <Dropdown
                                    id='inState'
                                    value={qData.idState > -1 ? qData.idState.toString() : '0'}
                                    optionLabel="stateName"
                                    optionValue='idSt'
                                    options={qData.states_list}
                                    className='p-dropdown-sm'
                                    {...register('state', 
                                        {
                                            value: qData.idState > -1 ? qData.idState.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                />

                                {/* <select 
                                    id='inState' 
                                    className="form-select form-select-sm"
                                    {...register('state', 
                                        {
                                            value: qData.idState > -1 ? qData.idState.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER || devLocale.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER}</option>
                                    { 
                                        qData.states_list.map(( val ) => {
                                                if(val.country === country)
                                                    return (
                                                        <option
                                                            key={val.idSt}
                                                            value={val.idSt}
                                                        >
                                                            {val.stateName}
                                                        </option>
                                                    )
                                            }
                                        )
                                    }

                                </select> */}
                                <small className='text-red-500'>{errors.state?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='inCountry'>
                                    {lan.Verify_Account_Page.Select_Country.PLACEHOLDER || devLocale.Verify_Account_Page.Select_Country.PLACEHOLDER}
                                    <span className='text-red-500 text-sm'>*</span>
                                </label>  
                                
                                <Dropdown
                                    id='inState'
                                    value={qData.idCountry > -1 ? qData.idCountry.toString() : '0'}
                                    optionLabel="ctryName"
                                    optionValue='idCtry'
                                    options={qData.countries_list}
                                    className='p-dropdown-sm'
                                    {...register('country', 
                                        {
                                            onChange: (event) => {setCountry(parseInt(event.target.value))},
                                            value: qData.idCountry > -1 ? qData.idCountry.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE
                                                }
                                            }
                                            
                                        }
                                    )}
                                />
                                                    
                                {/* <select 
                                    id='inCountry' 
                                    className="form-select form-select-sm"
                                    {...register('country', 
                                        {
                                            onChange: (event) => {setCountry(parseInt(event.target.value))},
                                            value: qData.idCountry > -1 ? qData.idCountry.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE || devLocale.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE
                                                }
                                            }
                                            
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER || devLocale.Verify_Account_Page.SELECT_DROPDOWN_PLACEHOLDER}</option>
                                    { 
                                        qData.countries_list.map(( val ) => (
                                            <option
                                                key={val.idCtry}
                                                value={val.idCtry}
                                            >
                                                {val.ctryName}
                                            </option>
                                        ))
                                    }

                                </select> */}
                                <small className='text-red-500'>{errors.country?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                        
                                <label htmlFor='inReference'>{lan.Verify_Account_Page.TextArea_Reference.PLACEHOLDER || devLocale.Verify_Account_Page.TextArea_Reference.PLACEHOLDER}</label>
                                <InputTextarea 
                                    autoResize
                                    rows={8} cols={30}
                                    id='inReference'
                                    {...register('reference', 
                                    { 
                                            value: qData.reference,
                                            required: false,
                                            maxLength: {
                                                value: 200,
                                                message: lan.Verify_Account_Page.TextArea_Reference.MSG_NOT_VALID || devLocale.Verify_Account_Page.TextArea_Reference.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                ></InputTextarea>
                                <small className='text-red-500'>{errors.reference?.message || ''}</small>
                            </div>
                            {
                                (qData.err.errCode === 'server' || qData.err.errCode === 'none' ) && qData.confirmed < 1 &&
                                <div className='my-5 gap-4 flex flex-row'>
                                    <Button
                                        type='submit'
                                        raised
                                        className='block w-full my-3 uppercase'
                                    >   
                                        {lan.Verify_Account_Page.BUTTON_VERIFY || devLocale.Verify_Account_Page.BUTTON_VERIFY}
                                    </Button>
                                </div>
                            }
                        </form>
                    }
                    <div className='my-3 text-center'>
                        <h3 className='text-orange-700'>{qData.err.errMsg}</h3>
                    </div>
                </div>
            </div>
        </LoginLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    
    const { idcu } = params as { idcu: string };
    const file = fs.readFileSync(`locales/${locale}.json`).toString();
    const lan: LocalesInterface = JSON.parse(file);

    const qData:VerifyAccState = {
        idCu: -1,
        idAdd: -1,
        idCon: -1,
        idCushadd: -1,
        idOrg: -1,
        idUsr: -1,
        idUsrSys: -1,

        user: '',
        pass: '',
        email: '',

        contact_name: '',
        contact_last_name: '',
        company: '',
        orgname: '',
        phone: '',
        phoneCtryCode: '',
        tax_id: '',
        idParcel: -1,
        parcel_supplier: '',
        parcel_suppliers_list: [],
        destiny: '',

        address: '',
        second_address: '',
        ext_number: '',
        int_number: '',
        district: '',
        postal_code: '',
        city: '',
        idState: -1,
        state: '',
        states_list: [],
        idCountry: -1,
        country: '',
        countries_list: [],
        phone_code_list: [],
        reference: '',

        // To UI
        hasAccount: false,
        cpass: '',
        createAccount: false,
        confirmed: 0,
        err: {
            errMsg: '',
            errCode: 'none',
        },
    }


    try {

        const idcustomer = await prisma.nODEJS_VERIFYACCOUNT_URL.findFirst({
            select: {
                ID_CU: true,
                CREATED: true,
                CONFIRMED: true,
            },
            where: {
                PUBLIC_UUID: idcu
            }
        });


        if(!idcustomer || idcustomer?.CREATED == null || idcustomer?.ID_CU == null){
            qData.err.errCode = 'link';
            throw new Error(lan.Verify_Account_Page.SYSTEM_ERROR_LINK_EXPIRE || devLocale.Verify_Account_Page.SYSTEM_ERROR_LINK_EXPIRE);
        }
        
        const caducity = new Date();
        const current = new Date();
        if(idcustomer?.CREATED)
            caducity.setDate( idcustomer?.CREATED.getDate() + 3 );
        
        if(caducity < current){
            await prisma.nODEJS_VERIFYACCOUNT_URL.delete({
                where: {
                    ID_CU: idcustomer?.ID_CU || -1
                }
            });

            qData.err.errCode = 'link';
            throw new Error(lan.Verify_Account_Page.SYSTEM_ERROR_LINK_EXPIRE || devLocale.Verify_Account_Page.SYSTEM_ERROR_LINK_EXPIRE);
        }


        qData.parcel_suppliers_list = await prisma.pARCEL_SUPPLIERS_PARS.findMany({
            select: {
                ID_PARS: true,
                PARS_NAME: true,
            }
        }).then( suppliers => {
            return suppliers.map( supp => {
                return {
                    idPars: supp.ID_PARS,
                    parsName: supp.PARS_NAME || '',
                }
            });
        }) || [];

        // TODO: HACE PARA MAS PAISES
        qData.states_list = await prisma.sTATES_ST.findMany({
            select: {
                ID_ST: true,
                ST_NAME: true,
                ID_CTRY: true,
            },
            // where: {
            //     ID_CTRY: 1,
            // }
        }).then( states => {
            return states.map( state => {
                return {
                    idSt: state.ID_ST,
                    stateName: state.ST_NAME  || '',
                    country: state.ID_CTRY || -1,
                }
            });
        }) || [];
        
        qData.countries_list = await prisma.cOUNTRIES_CTRY.findMany({
            select: {
                ID_CTRY: true,
                CTRY_NAME: true,
                CTRY_LADA: true,
                CTRY_ABBREV: true,
            },
            // where: {
            //     ID_CTRY: 1,
            // }
        }).then( countries => {
            return countries.map( country => {
                return {
                    idCtry: country.ID_CTRY,
                    ctryName: country.CTRY_NAME || '',
                    ctryLada: country.CTRY_LADA || '',
                    ctryAbbrev: country.CTRY_ABBREV || '',
                }
            });
        }) || [];

        qData.countries_list.forEach((item) => {
            qData.phone_code_list.push({ ladaOption: '+'+item.ctryLada, ctryLada: '+'+item.ctryLada+' '+item.ctryAbbrev })
        });

        const cdata = await prisma.cUSTOMERS_CU.findFirst({
            select: {
                CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON: {
                    select: {
                        ID_CON: true,
                        ID_ADD: true,

                        CON_NAME: true,
                        CON_LASTNAME: true,
                        CON_EMAIL: true,
                        CON_PHONE: true,
                        USERS_USR: {
                            
                            select: {
                                ID_USR: true,

                                USR_LOGIN_NAME: true,
                                USR_PASSWORD: true,
                                USR_STATUS: true,
                                USR_has_SYSR: {
                                    select: {
                                        ID_SYSR: true,
                                    }
                                }
                            }
                        },
                        ADDRESSES_ADD: {
                            select: {
                                ADD_STREET: true,
                                ADD_STREET2: true,
                                ADD_EXT_NUMBER: true,
                                ADD_INT_NUMBER: true,
                                ADD_DISTRICT: true,
                                ADD_ZIP: true,
                                ADD_CITY: true,
                                STATES_ST: {
                                    select: {
                                        ID_ST: true,
                                        ST_NAME: true,
                                    }
                                },
                                COUNTRIES_CTRY: {
                                    select: {
                                        ID_CTRY: true,
                                        CTRY_NAME: true,
                                    }
                                },
                                ADD_REFERENCES: true,

                            }
                        }
                    }
                },
                ORGANIZATION_ORG: {
                    select: {
                        ID_ORG: true,
                        ID_ADD: true,
                        ORG_NAME: true,
                        ORG_BRAND: true,
                        ORG_EMAIL: true,
                        ORG_PHONE: true,
                        ORG_RFC: true,

                        ADDRESSES_ADD: {
                            select: {
                                ADD_STREET: true,
                                ADD_STREET2: true,
                                ADD_EXT_NUMBER: true,
                                ADD_INT_NUMBER: true,
                                ADD_DISTRICT: true,
                                ADD_ZIP: true,
                                ADD_CITY: true,
                                STATES_ST: {
                                    select: {
                                        ID_ST: true,
                                        ST_NAME: true,
                                    }
                                },
                                COUNTRIES_CTRY: {
                                    select: {
                                        ID_CTRY: true,
                                        CTRY_NAME: true,
                                    }
                                },
                                ADD_REFERENCES: true,

                            }
                        }
                    }
                },
                CU_HAS_SHADD: {
                    select: {
                        ID_CUSHADD: true,

                        CUSHADD_CONTACT: true,
                        CUSHADD_PHONE: true,
                        PARCEL_SUPPLIERS_PARS: {
                            select: {
                                ID_PARS: true,
                                PARS_NAME: true,
                            }
                        }
                    }
                }
            },
            where: {
                ID_CU: idcustomer.ID_CU
            }
        });

        // console.log(cdata);
        
        if(cdata) {
            if(
                cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR.length > 1
                || cdata?.CU_HAS_SHADD.length > 1
            ){
                qData.err.errCode = 'customer';
                throw new Error(lan.Verify_Account_Page.SYSTEM_ERROR_ACCOUNT_DETAILS || devLocale.Verify_Account_Page.SYSTEM_ERROR_ACCOUNT_DETAILS);
            }
                
            const userAcc = cdata?.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR[0];
            // console.log({userAcc});
            if(userAcc && userAcc.USR_PASSWORD)
                qData.hasAccount = true;

            if(userAcc && userAcc.USR_STATUS === 'INACTIVE'){
                qData.err.errCode = 'customer';
                throw new Error(lan.Verify_Account_Page.SYSTEM_ERROR_ACCOUNT_ACTIVE || devLocale.Verify_Account_Page.SYSTEM_ERROR_ACCOUNT_ACTIVE);
            }
            
            qData.confirmed = idcustomer.CONFIRMED || 0;
            if(idcustomer.CONFIRMED) qData.err.errMsg = lan.Verify_Account_Page.MSG_ACCOUNT_VERIFIED || devLocale.Verify_Account_Page.MSG_ACCOUNT_VERIFIED;

            qData.idCu = idcustomer.ID_CU;
            qData.idCon = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ID_CON || -1;
            qData.idAdd = cdata.ORGANIZATION_ORG.ID_ADD
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ID_ADD 
                        || -1;
            qData.idUsr = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR[0]?.ID_USR || -1;
            qData.idUsrSys = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR[0]?.USR_has_SYSR[0]?.ID_SYSR || -1;
            qData.idOrg = cdata.ORGANIZATION_ORG.ID_ORG || -1;
            qData.idCushadd = cdata.CU_HAS_SHADD[0]?.ID_CUSHADD || -1;

            qData.user = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.USERS_USR[0]?.USR_LOGIN_NAME || '';
            qData.email = cdata.ORGANIZATION_ORG.ORG_EMAIL
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.CON_EMAIL 
                        || '';
            
            qData.contact_name = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.CON_NAME || '';
            qData.contact_last_name = cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.CON_LASTNAME || '';
            qData.company = cdata.ORGANIZATION_ORG.ORG_BRAND || '';
            qData.orgname = cdata.ORGANIZATION_ORG.ORG_NAME || '';
            
            qData.phone = cdata.ORGANIZATION_ORG.ORG_PHONE 
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.CON_PHONE 
                        || '';

            let phoneTrim = '';
            qData.phone.split('-').forEach((val, index) => { index > 0 ? phoneTrim += '-' + val : qData.phoneCtryCode = val });
            phoneTrim = phoneTrim.substring(1);
            qData.phone = phoneTrim || qData.phone;

            qData.phoneCtryCode = qData.phoneCtryCode.charAt(0) === '+' ? qData.phoneCtryCode : '';
            
            qData.tax_id = cdata.ORGANIZATION_ORG.ORG_RFC || '';
            qData.idParcel = cdata?.CU_HAS_SHADD[0]?.PARCEL_SUPPLIERS_PARS?.ID_PARS || -1;
            qData.parcel_supplier = cdata?.CU_HAS_SHADD[0]?.PARCEL_SUPPLIERS_PARS?.PARS_NAME || '';
            
            qData.address = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_STREET
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_STREET 
                        || '';
            qData.second_address = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_STREET2
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_STREET2 
                        || '';
            qData.ext_number = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_EXT_NUMBER
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_EXT_NUMBER
                        || '';
            qData.int_number = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_INT_NUMBER
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_INT_NUMBER
                        || '';
            qData.district = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_DISTRICT 
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_DISTRICT 
                        || '';
            qData.postal_code = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_ZIP 
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_ZIP 
                        || '';
            qData.city = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_CITY 
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_CITY 
                        || '';
            qData.idState = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.STATES_ST?.ID_ST
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.STATES_ST?.ID_ST 
                        || -1;
            qData.state = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.STATES_ST?.ST_NAME
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.STATES_ST?.ST_NAME 
                        || '';
            qData.idCountry = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.COUNTRIES_CTRY?.ID_CTRY
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.COUNTRIES_CTRY?.ID_CTRY 
                        || -1;
            qData.country = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.COUNTRIES_CTRY?.CTRY_NAME
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.COUNTRIES_CTRY?.CTRY_NAME 
                        || '';
            qData.reference = cdata.ORGANIZATION_ORG.ADDRESSES_ADD?.ADD_REFERENCES 
                        || cdata.CONTACTS_CON_CUSTOMERS_CU_ID_CON_PURCHASINGToCONTACTS_CON.ADDRESSES_ADD?.ADD_REFERENCES 
                        || '';
        }

        // console.log('Data final');
        // console.log({qData});


    } catch (error: any) {
        // TODO: LOGS ARCHIVOS
        console.log(error);
        console.log('ErrCode: ', qData.err.errCode);
        if(qData.err.errCode === 'none'){ 
            qData.err.errCode = 'server';
            qData.err.errMsg = lan.SYSTEM_ERROR || devLocale.SYSTEM_ERROR;
        } else {
            qData.err.errMsg = error.message;
        }
    }

    const host = process.env.HOSTURL;

    return {
        props: {
            qData,
            host,
            lan,
            locale
        }
    }
}

export default VerifyAccount;