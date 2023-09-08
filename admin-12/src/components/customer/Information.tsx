import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Card, Checkbox, Input } from '@material-tailwind/react';

import { Login_Page, System_Error, Verify_Account_Page, CustomerInformation, System_General, Account_Page } from '@/interfaces';
import { PhoneInput } from '../PhoneInput';
import { SubActionBar } from '../SubActionBar';

interface VerifyProps {
    Login_Page: Login_Page;
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
    Account_Page: Account_Page;
    System_General: System_General;
}

interface Props {
    qDataInformation: CustomerInformation;
    lan: VerifyProps;
    cuCode: string;
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
    setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}

export const Information: FC<Props> = ({ qDataInformation, lan, cuCode, setShowAlert, setErrMsg }) => {

    const router = useRouter();
    const [ lada, setLada ] = useState(qDataInformation.phone_ctry_code || '+52');
    
    const [ isCurrentPass, setIsCurrentPass ] = useState(false);
    const [ contactPromotions, setContactPromotions ] = useState(qDataInformation.contact_promotions.toUpperCase());
    const [ contactNotifications, setContactNotifications ] = useState(qDataInformation.contact_notifications.toUpperCase());
    const [ isConPromoNone, setIsConPromoNone] = useState(false);
    const [ isConNotifNone, setIsConNotifNone] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset } = useForm<CustomerInformation>();

    const setContactPreference = (
        e: React.ChangeEvent<HTMLInputElement>, setPreference: React.Dispatch<React.SetStateAction<string>>, 
        setNonePreference: React.Dispatch<React.SetStateAction<boolean>>, value: string, preference: string
    ) => {
        const last = !(preference.length > 1);

        if(e.target.checked) {
            setNonePreference( value === 'X' );

            setPreference( (preference === 'X' || value === 'X' ? '' : preference) + value );
        } else {
            setPreference( preference.replace(value, '') );
            if( last ) {
                setPreference('X');
                setNonePreference(true);
            }
        }
    }

    const getContactPreference = (value: string, preferences: string) => {
        return preferences.includes(value);
    }

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

    const onSubmit: SubmitHandler<CustomerInformation> = async(data) => {

        qDataInformation.errMsg = '';
        

        // if(!await validateUsersDataAviable(data.user, qData.idUsr)) {
        //     qData.err.errMsg = lan.Login_Page.TextField_User.MSG_DUPLICATE_USER;
        //     qData.err.errCode = 'server';
        // }
        if(!await validateUsersDataAviable(data.email, qDataInformation.idUsr)) {
            qDataInformation.errMsg = lan.Login_Page.TextField_Email.MSG_DUPLICATE_EMAIL;
            setErrMsg(qDataInformation.errMsg);
            setShowAlert(true);
        }
        if(!await validateUsersDataAviable(data.phone, qDataInformation.idUsr)) {
            qDataInformation.errMsg = lan.Verify_Account_Page.TextField_Phone.MSG_DUPLICATE_PHONE;
            setErrMsg(qDataInformation.errMsg);
            setShowAlert(true);
        }

        if(!qDataInformation.errMsg) {

            // let newPass = false;
            // if(data.cpass.length > 0 && data.pass.length > 0 && data.apass.length > 0 
            //     && data.cpass === data.pass) {
            //         data.pass = bcryptjs.hashSync(data.pass, bcryptjs.genSaltSync());
            //         newPass = true;
            // }
            // data.cpass = '';

            try {
                const r = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/customers/admin/information/${cuCode}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify({
                        ...data,
                        contact_promotions: contactPromotions,
                        contact_notifications: contactNotifications,
                        // ...( newPass && {pass: data.pass}),
                        phone: lada + '-' + data.phone
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if( r.ok && r.status == 200 ){
                    setErrMsg(lan.Verify_Account_Page.Msg_Saved.TEXT);
                    router.reload();
                } else {
                    const msg = await r.json();

                    if( msg.errCode == 'server' ) {
                        setErrMsg(lan.System_Error.Server_1000.TEXT);
                    }

                    if( msg.errCode == 'pass') {
                        setErrMsg(lan.Account_Page.System_Error_Account_Password.TEXT);
                    }

                }
            } catch (error) {
                setErrMsg(lan.System_Error.Server_1000.TEXT);
            }

            // reset({
            //     pass: '',
            //     cpass: '',
            //     apass: '',
            // })
            setShowAlert(true);
        }
    }

    return (

        
            <form  onSubmit={handleSubmit(onSubmit)} >
                <div className='grid grid-cols-1 md:grid-cols-4 mdl:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8  w-full'>
            
                    <SubActionBar className='col-span-6' title='Editar cliente' cancelPath={`/customers`} lan={lan} />
                    
                    <Card className={`col-span-1 md:col-span-3
                                        
                                        p-5 m-5 border`}>
                            <h2>{lan.Account_Page.Card_Information_Title.TEXT}</h2>
                            <div className='my-3'>
                                <Input
                                    label={lan.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER}
                                    id='inName'
                                    type='text'
                                    {...register('contact_name',
                                    {
                                            value: qDataInformation.contact_name,
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
                                    label={lan.Verify_Account_Page.TextField_Last_Name.PLACEHOLDER}
                                    id='inLastName'
                                    type='text'
                                    {...register('contact_last_name',
                                    {
                                            value: qDataInformation.contact_last_name,
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
                                    label={lan.Login_Page.TextField_Email.PLACEHOLDER}
                                    id='inEmail'
                                    type='text'
                                    {...register('email',
                                    {
                                            value: qDataInformation.email,
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
                                    phone={qDataInformation.phone}
                                    phone_code_list={qDataInformation.phone_code_list}
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
                                            value: qDataInformation.company,
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
                                            value: qDataInformation.orgname,
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
                                            value: qDataInformation.tax_id,
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
            
                    </Card>
                    <div className={`grid
                                        grid-rows-1 md:grid-rows-2
                                        grid-cols-1
                                        col-span-1 md:col-span-3`}>
                        <Card className='col-span-1 p-5 m-5 border flex flex-col'>
                            <h2>{lan.Account_Page.Card_Preferences_Title.TEXT}</h2>
                            <div className='grid grid-cols-2'>
                                <div className='flex flex-col scale-90'>
                                    <span>{lan.Account_Page.Preferences_Promotions.TITLE}</span>
                                    <Checkbox id='prom-whatsapp' label={lan.Account_Page.Preferences_Promotions.CHECKBOX_1} checked={getContactPreference('W',contactPromotions)} onChange={(event) => setContactPreference(event, setContactPromotions, setIsConPromoNone, 'W', contactPromotions)}/>
                                    <Checkbox id='prom-email' label={lan.Account_Page.Preferences_Promotions.CHECKBOX_2} checked={getContactPreference('E',contactPromotions)} onChange={(event) => setContactPreference(event, setContactPromotions, setIsConPromoNone, 'E', contactPromotions)}/>
                                    <Checkbox id='prom-sms' label={lan.Account_Page.Preferences_Promotions.CHECKBOX_3} checked={getContactPreference('S',contactPromotions)} onChange={(event) => setContactPreference(event, setContactPromotions, setIsConPromoNone, 'S', contactPromotions)}/>
                                    <Checkbox id='prom-phone' label={lan.Account_Page.Preferences_Promotions.CHECKBOX_4} checked={getContactPreference('P',contactPromotions)} onChange={(event) => setContactPreference(event, setContactPromotions, setIsConPromoNone, 'P', contactPromotions)}/>
                                    <Checkbox id='prom-none' label={lan.Account_Page.Preferences_Promotions.CHECKBOX_5} checked={getContactPreference('X',contactPromotions) || isConPromoNone} onChange={(event) => setContactPreference(event, setContactPromotions, setIsConPromoNone, 'X', contactPromotions)}/>
                                </div>
                                <div className='flex flex-col scale-90'>
                                    <span>{lan.Account_Page.Preferences_Notifications.TITLE}</span>
                                    <Checkbox id='cont-whatsapp' label={lan.Account_Page.Preferences_Notifications.CHECKBOX_1} checked={getContactPreference('W',contactNotifications)} onChange={(event) => setContactPreference(event, setContactNotifications, setIsConNotifNone, 'W', contactNotifications)}/>
                                    <Checkbox id='cont-email' label={lan.Account_Page.Preferences_Notifications.CHECKBOX_2} checked={getContactPreference('E',contactNotifications)} onChange={(event) => setContactPreference(event, setContactNotifications, setIsConNotifNone, 'E', contactNotifications)}/>
                                    <Checkbox id='cont-sms' label={lan.Account_Page.Preferences_Notifications.CHECKBOX_3} checked={getContactPreference('S',contactNotifications)} onChange={(event) => setContactPreference(event, setContactNotifications, setIsConNotifNone, 'S', contactNotifications)}/>
                                    <Checkbox id='cont-phone' label={lan.Account_Page.Preferences_Notifications.CHECKBOX_4} checked={getContactPreference('P',contactNotifications)} onChange={(event) => setContactPreference(event, setContactNotifications, setIsConNotifNone, 'P', contactNotifications)}/>
                                    <Checkbox id='cont-none' label={lan.Account_Page.Preferences_Notifications.CHECKBOX_5} checked={getContactPreference('X',contactNotifications) || isConNotifNone} onChange={(event) => setContactPreference(event, setContactNotifications, setIsConNotifNone, 'X', contactNotifications)}/>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>

    )
}
