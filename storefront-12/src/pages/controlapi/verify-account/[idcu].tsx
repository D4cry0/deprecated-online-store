import React, { useState } from 'react';

import { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import * as bcryptjs from 'bcryptjs';
import { useForm, SubmitHandler } from "react-hook-form";

import { Button, Checkbox, Input, Textarea, Card } from "@material-tailwind/react";

import { Login_Page, System_Error, VerifyAccState, Verify_Account_Page } from '@/interfaces';
import { PhoneInput } from '@/components';

interface VerifyProps {
    Login_Page: Login_Page;
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
}

interface Props {
    qData: VerifyAccState;
    lan: VerifyProps;
}

const VerifyAccount: NextPage<Props> = ({ qData, lan }) => {

    const [ newAccount, setNewAccount ] = useState(false);
    const [ hasExtNum, setHasExtNum ] = useState(!!qData.ext_number);
    const [ hasIntNum, setHasIntNum ] = useState(!!qData.int_number);
    const [ lada, setLada ] = useState(qData.phoneCtryCode || '+52');
    const [ country, setCountry ] = useState(qData.idCountry);

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm<VerifyAccState>();

    const validateUsersDataAviable = async(data: string, idUser: number) => {
    
        try {
            const res = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/auth/available/${data}`, {
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

        console.log({data});

        qData.err.errMsg = '';
        qData.err.errCode = 'none';

        if(!await validateUsersDataAviable(data.user, qData.idUsr)) {
            qData.err.errMsg = lan.Login_Page.TextField_User.MSG_DUPLICATE_USER;
            qData.err.errCode = 'server';
        }
        if(!await validateUsersDataAviable(data.email, qData.idUsr)) {
            qData.err.errMsg = lan.Login_Page.TextField_Email.MSG_DUPLICATE_EMAIL;
            qData.err.errCode = 'server';
        }
        if(!await validateUsersDataAviable(data.phone, qData.idUsr)) {
            qData.err.errMsg = lan.Verify_Account_Page.TextField_Phone.MSG_DUPLICATE_PHONE;
            qData.err.errCode = 'server';
        }

        data.cpass = '';

        if(!qData.err.errMsg) {
            try {
                const r = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/fastverify/${qData.idCu}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify({
                        ...data,
                        ...( data.pass && data.pass.length > 0 && {pass: bcryptjs.hashSync(data.pass, bcryptjs.genSaltSync())}),
                        user: qData.hasAccount ? qData.user : data.user,
                        idCon: qData.idCon,
                        idAdd: qData.idAdd,
                        idUsr: qData.idUsr,
                        idUsrSys: qData.idUsrSys,
                        idOrg: qData.idOrg,
                        idCushadd: qData.idCushadd,
                        email: data.email.toLowerCase(),
                        phone: lada + '-' + data.phone
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(await r.json());

                if( r.ok && r.status == 200 ){
                    qData.err.errCode = 'link';
                    qData.err.errMsg = lan.Verify_Account_Page.Msg_Saved.TEXT;
                } else {
                    qData.err.errCode = 'server';
                    qData.err.errMsg = lan.System_Error.Server_1000.TEXT;
                }
            } catch (error) {
                console.log({error});
                qData.err.errCode = 'server';
                qData.err.errMsg = lan.System_Error.Server_1000.TEXT;
            }
        }
    }

    const onCreateNewAccount = () => {
        setNewAccount( !newAccount );
    }

    // TODO: Refactorizar para que se generen los campos de manera recursiva FormControl.tsx
    return (
        
        <>
            <Head>
                <title>{ lan.Verify_Account_Page.Title.TEXT }</title>
            </Head>    
            <div className='flex flex-row justify-center w-full min-h-screen bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-gray-100 to-teal-100'>
                <Card className='p-5 m-5 border xs:w-full sm:w-full md:w-3/4 mdl:w-3/6 lg:w-2/4 xl:w-2/6 2xl:w-1/4 mt-28'>
                    <div className='flex justify-content-center mb-5'>
                        <Link className='no-underline' href={'/'}>
                            <Image src='/assets/img/logo.png' alt='Logo' width={0} height={70} sizes='100vw' priority />
                        </Link>
                    </div>
                    <h2 className='uppercase text-center xs:text-xl sm:text-xl md:text-2xl mb-4'>{ lan.Verify_Account_Page.Title.TEXT }</h2>
                    
                    {
                        (qData.err.errCode === 'none' || qData.err.errCode === 'verified' || qData.err.errCode === 'server') &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <small>Campos obligatorios  <span className='text-red-500 text-sm'>*</span> </small>
                            </div>
                            {
                                !qData.hasAccount &&
                                <div className='flex flex-row'>
                                    <Checkbox label={ lan.Verify_Account_Page.Create_Account.TEXT } onChange={onCreateNewAccount} />
                                </div>
                            }
                            {
                                newAccount &&
                                <>
                                    <div className='my-3'>
                                        <Input
                                            label={lan.Login_Page.TextField_User.PLACEHOLDER + ' *'}
                                            id='inUser'
                                            type='text'
                                            autoFocus={true}
                                            {...register('user', 
                                            { 
                                                    value:qData.user,
                                                    required: lan.Login_Page.TextField_User.MSG_REQUIRED_VALUE,
                                                    maxLength: {
                                                        value: 45,
                                                        message: lan.Login_Page.TextField_User.MSG_NOT_VALID,
                                                    },
                                                    validate: async(val: string) => {

                                                        if( !val.match(/^[a-zA-Z0-9_]{3,45}$/) )
                                                            return lan.Login_Page.TextField_User.MSG_NOT_VALID;
                                                    },
                                                }
                                            )} 
                                        />
                                        <small className='text-red-500'>{errors.user?.message || ''}</small>
                                    </div>
                                    <div className='my-3'>
                                        <Input
                                            label={lan.Login_Page.TextField_Password.PLACEHOLDER + ' *'}
                                            id='inPass'
                                            type='password'
                                            {...register('pass', 
                                                { 
                                                    required: lan.Login_Page.TextField_Password.MSG_REQUIRED_VALUE,
                                                    minLength: {
                                                        value: 8,
                                                        message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                                    },
                                                }
                                            )}
                                        />
                                        <small className='text-red-500'>{errors.pass?.message || ''}</small>
                                    </div>
                                    <div className='my-3'>
                                        <Input
                                            label={lan.Login_Page.TextField_Password.PLACEHOLDER + ' *'}
                                            id='incPass'
                                            type='password'
                                            {...register('cpass', 
                                                { 
                                                    required: lan.Login_Page.TextField_Password.MSG_REQUIRED_VALUE,
                                                    minLength: {
                                                        value: 8,
                                                        message: lan.Login_Page.TextField_Password.MSG_NOT_VALID || ''
                                                    },
                                                    validate: (val: string) => {
                                                        if (watch('pass') !== val) {
                                                            return lan.Login_Page.TextField_Password.MSG_NOT_EQUAL;
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
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER + ' *'}
                                    id='inName'
                                    type='text'
                                    autoFocus={true}
                                    {...register('contact_name', 
                                    { 
                                            value: qData.contact_name,
                                            required: lan.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID || ''
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.contact_name?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER + ' *'}
                                    id='inLastName'
                                    type='text'
                                    autoFocus={true}
                                    {...register('contact_last_name', 
                                    { 
                                            value: qData.contact_last_name,
                                            required: lan.Verify_Account_Page.TextField_Last_Name.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Last_Name.MSG_NOT_VALID
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.contact_last_name?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Login_Page.TextField_Email.PLACEHOLDER + ' *'}
                                    id='inEmail'
                                    type='text'
                                    {...register('email', 
                                    { 
                                            value: qData.email,
                                            required: lan.Login_Page.TextField_Email.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Login_Page.TextField_Email.MSG_NOT_VALID
                                            },
                                            validate: async(val: string) => {

                                                if( !val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) )
                                                    return lan.Login_Page.TextField_Email.MSG_NOT_VALID;
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.email?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <PhoneInput 
                                    lada={lada} 
                                    placeholder={lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER}
                                    msg_not_valid={lan.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID}
                                    msg_required_value={lan.Verify_Account_Page.TextField_Phone.MSG_REQUIRED_VALUE}
                                    phone={qData.phone}
                                    phone_code_list={qData.phone_code_list}
                                    register={register}
                                    setLada={setLada}
                                />
                                <small className='text-red-500'>{ errors.phone?.message || '' }</small>
                                <small className='text-slate-800 font-bold text-[10px] ml-2'>{  !errors.phone && lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT }</small>
                            </div>

                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Company.PLACEHOLDER}
                                    id='inCompany'
                                    type='text'
                                    {...register('company', 
                                    { 
                                            value: qData.company,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Company.MSG_NOT_VALID
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.company?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Org_Name.PLACEHOLDER}
                                    id='inOrgName'
                                    type='text'
                                    {...register('orgname', 
                                    { 
                                            value: qData.orgname,
                                            maxLength: {
                                                value: 45,
                                                message: lan.Verify_Account_Page.TextField_Org_Name.MSG_NOT_VALID
                                            }
                                        }
                                    )} 
                                />
                                <small className='text-red-500'>{errors.company?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Tax_Id.PLACEHOLDER}
                                    id='inTaxId'
                                    type='text'
                                    maxLength={13}
                                    {...register('tax_id', 
                                    { 
                                            value: qData.tax_id,
                                            required: false,
                                            maxLength: {
                                                value: 15,
                                                message: lan.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID
                                            },
                                            validate: async(val: string) => {
                                                if( !val.match(/^([A-Z&Ññ]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([A\d])$|^$/) )
                                                    return lan.Verify_Account_Page.TextField_Tax_Id.MSG_NOT_VALID;
                                            }
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.tax_id?.message || ''}</small>
                            </div>
                            
                            <div className='relative my-3'>
                                <select 
                                    id='inParcelSupplier' 
                                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                                    {...register('parcel_supplier', 
                                        {
                                            value: qData.idParcel > -1 ? qData.idParcel.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Parcel_Supplier.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.Select_Dropdown_Placeholder.TEXT}</option>
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

                                </select>
                                <label htmlFor='inParcelSupplier' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    {lan.Verify_Account_Page.Select_Parcel_Supplier.PLACEHOLDER + ' *'}
                                </label>  
                                <small className='text-red-500'>{errors.parcel_supplier?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Address.PLACEHOLDER + ' *'}
                                    id='inAddress'
                                    type='text'
                                    {...register('address', 
                                    { 
                                            value: qData.address,
                                            required: lan.Verify_Account_Page.TextField_Address.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 100,
                                                message: lan.Verify_Account_Page.TextField_Address.MSG_NOT_VALID
                                            },

                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.address?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    id='inSecondAddress'
                                    type='text'
                                    label={lan.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER}
                                    {...register('second_address', 
                                        { 
                                            value: qData.second_address,
                                            maxLength: {
                                                value: 100,
                                                message: lan.Verify_Account_Page.TextField_Second_Address.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.second_address?.message || ''}</small>
                            </div>

                            <div className='my-3'>
                                <span className='my-2 xs:text-sm sm:text-sm md:text-base'>
                                    {lan.Verify_Account_Page.Label_Ext_Int_Number.TEXT}
                                </span>
                                <div className='flex flex-row items-center justify-between gap-2 mt-2'>
                                        <Checkbox 
                                            checked={hasExtNum} 
                                            onChange={() => {
                                                setValue('ext_number', !hasExtNum ? qData.ext_number : '-' );
                                                setHasExtNum( !hasExtNum );
                                            }}
                                        />
                                        <div className='relative'>
                                            <input
                                                disabled={ !hasExtNum }
                                                id='inExtNumber'
                                                type='text'
                                                className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                {...register('ext_number',
                                                    {
                                                        value: qData.ext_number || '-',
                                                        required: lan.Verify_Account_Page.TextField_Ext_Number.MSG_REQUIRED_VALUE,
                                                        maxLength: {
                                                            value: 5,
                                                            message: lan.Verify_Account_Page.TextField_Ext_Number.MSG_NOT_VALID
                                                        },
                                                    }
                                                )}
                                            />
                                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                {`${lan.Verify_Account_Page.TextField_Ext_Number.PLACEHOLDER}${hasExtNum ? ' *' : ''}`}
                                            </label>
                                        </div>
                                        <Checkbox 
                                            checked={hasIntNum} 
                                            onChange={() => {
                                                setValue('int_number', !hasIntNum ? qData.int_number : '-' );
                                                setHasIntNum( !hasIntNum );
                                            }} 
                                        />
                                        <div className='relative'>
                                            <input
                                                disabled={ !hasIntNum }
                                                id='inIntNumber'
                                                type='text'
                                                className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                {...register('int_number',
                                                    {
                                                        value: qData.int_number || '-',
                                                        required: lan.Verify_Account_Page.TextField_Int_Number.MSG_REQUIRED_VALUE,
                                                        maxLength: {
                                                            value: 5,
                                                            message: lan.Verify_Account_Page.TextField_Int_Number.MSG_NOT_VALID
                                                        },
                                                    }
                                                )}
                                            />
                                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                {`${lan.Verify_Account_Page.TextField_Int_Number.PLACEHOLDER}${hasIntNum ? ' *' : ''}`}
                                            </label>
                                        </div>
                                        
                                </div>
                                <small className='text-red-500'>{errors.int_number?.message || errors.ext_number?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_District.PLACEHOLDER + ' *'}
                                    id='inDistrict'
                                    type='text'
                                    {...register('district', 
                                    { 
                                            value: qData.district,
                                            required: lan.Verify_Account_Page.TextField_District.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 120,
                                                message: lan.Verify_Account_Page.TextField_District.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.district?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER + ' *'}
                                    id='inPostalCode'
                                    type='text'
                                    {...register('postal_code', 
                                        { 
                                            value: qData.postal_code,
                                            required: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 10,
                                                message: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.postal_code?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_City.PLACEHOLDER + ' *'}
                                    className='p-inputtext-sm'
                                    id='inCity'
                                    type='text'
                                    {...register('city', 
                                    { 
                                            value: qData.city,
                                            required: lan.Verify_Account_Page.TextField_City.MSG_REQUIRED_VALUE,
                                            maxLength: {
                                                value: 30,
                                                message: lan.Verify_Account_Page.TextField_City.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                />
                                <small className='text-red-500'>{errors.city?.message || ''}</small>
                            </div>

                            <div className='relative my-3'>
                                <select 
                                    id='inState' 
                                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    {...register('state', 
                                        {
                                            value: qData.idState > -1 ? qData.idState.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE
                                                }
                                            }
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.Select_Dropdown_Placeholder.TEXT}</option>
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

                                </select>
                                <label htmlFor='inState' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    {lan.Verify_Account_Page.Select_State.PLACEHOLDER + ' *'}
                                </label>

                                <small className='text-red-500'>{errors.state?.message || ''}</small>
                            </div>

                            <div className='relative my-3'>
            
                                <select
                                    id='inCountry' 
                                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    {...register('country', 
                                        {
                                            onChange: (event) => {setCountry(parseInt(event.target.value))},
                                            value: qData.idCountry > -1 ? qData.idCountry.toString() : '0',
                                            required: lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE,
                                            validate: (val: string) => {
                                                if( val === '0'  ) {
                                                    return lan.Verify_Account_Page.Select_Country.MSG_REQUIRED_VALUE
                                                }
                                            }
                                            
                                        }
                                    )}
                                >
                                    <option key={0} value={0}>{lan.Verify_Account_Page.Select_Dropdown_Placeholder.TEXT}</option>
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

                                </select>
                                <label htmlFor='inCountry' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    {lan.Verify_Account_Page.Select_Country.PLACEHOLDER + ' *'}
                                </label> 
                                <small className='text-red-500'>{errors.country?.message || ''}</small>
                            </div>
                            
                            <div className='my-3'>
                                        
                                <Textarea 
                                    label={lan.Verify_Account_Page.TextArea_Reference.PLACEHOLDER}
                                    resize
                                    rows={8} cols={30}
                                    id='inReference'
                                    {...register('reference', 
                                    { 
                                            value: qData.reference,
                                            required: false,
                                            maxLength: {
                                                value: 200,
                                                message: lan.Verify_Account_Page.TextArea_Reference.MSG_NOT_VALID
                                            },
                                        }
                                    )}
                                ></Textarea>
                                <small className='text-red-500'>{errors.reference?.message || ''}</small>
                            </div>
                            {
                                (qData.err.errCode === 'server' || qData.err.errCode === 'none' ) && qData.confirmed < 1 &&
                                <div className='my-5 gap-4 flex flex-row'>
                                    <Button
                                        type='submit'
                                        className='w-full my-3'
                                        color='indigo'
                                    >   
                                        {lan.Verify_Account_Page.Button_Verify.TEXT}
                                    </Button>
                                </div>
                            }
                        </form>
                    }
                    <div className='my-3 text-center'>
                        <h3 className='text-orange-700'>{qData.err.errMsg}</h3>
                    </div>
                </Card>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    
    const { idcu } = params as { idcu: string };
    let qData;

    let lan: VerifyProps;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sections: [
                    'Login_Page',
                    'Verify_Account_Page',
                    'System_Error'
                ]
            })
        });
        lan = await data.json();
    } catch (error) {
        console.log(error);

        return {
            redirect: {
                permanent: false,
                destination: `/500`
            }
        }
    }

    try {
        const query = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/fastverify/${idcu}`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await query.json();
        qData = data.qData;

        if( qData.err.errCode === 'server' )
            qData.err.errMsg = lan.System_Error.Server_1000.TEXT;

        if( qData.err.errCode === 'link' )
            qData.err.errMsg = lan.Verify_Account_Page.System_Error_Link_Expire.TEXT;

        if( qData.err.errCode === 'customer-active' )
            qData.err.errMsg = lan.Verify_Account_Page.System_Error_Account_Active.TEXT;

        if( qData.err.errCode === 'customer-details' )
            qData.err.errMsg = lan.Verify_Account_Page.System_Error_Account_Details.TEXT;

        if( qData.err.errCode === 'verified' )
            qData.err.errMsg = lan.Verify_Account_Page.Msg_Account_Verified.TEXT;

    } catch (error) { console.log(error) }

    return {
        props: {
            qData,
            lan,
            locale,
        }
    }
}

export default VerifyAccount;