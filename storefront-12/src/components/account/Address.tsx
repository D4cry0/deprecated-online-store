import React, { FC, useState } from 'react';

import { useRouter } from 'next/router';
import { Button, Card, Checkbox, Input, Textarea } from '@material-tailwind/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Account_Page, CustomerSingleAddress, System_Error, System_General, Verify_Account_Page } from '@/interfaces';
import { PhoneInput } from '../PhoneInput';

interface VerifyProps {
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
    Account_Page: Account_Page;
    System_General: System_General;
}

interface Props {
    qData: CustomerSingleAddress;
    lan: VerifyProps;
    phone_code_list: {
        ladaOption: string;
        ctryLada: string;
    }[];
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
    onSubmit: SubmitHandler<CustomerSingleAddress>;
    lada: string;
    setLada: React.Dispatch<React.SetStateAction<string>>
}

export const Address: FC<Props> = ({ 
    qData, 
    phone_code_list, 
    parcel_suppliers_list, 
    states_list, 
    countries_list, 
    lan, 
    lada, 
    setLada, 
    onSubmit 
}) => {

    const router = useRouter();
    const [ hasExtNum, setHasExtNum ] = useState(!!qData.addresses.ext_number);
    const [ hasIntNum, setHasIntNum ] = useState(!!qData.addresses.int_number);
    const [ country, setCountry ] = useState(qData.addresses.country);
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm<CustomerSingleAddress>();

    return (
        <div className='flex flex-row justify-center items-center w-full min-h-screen'>
            <Card className='p-5 m-5 border xs:w-full sm:w-full md:w-3/4 mdl:w-3/6 lg:w-2/4 xl:w-2/6 2xl:w-1/4'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='my-3'>
                        <Checkbox 
                            disabled={true}
                            label={lan.Account_Page.CheckBox_Main_Address.PLACEHOLDER}
                            {...register('primary', 
                                { 
                                    value: qData.primary
                                }
                            )}
                        />
                    </div>
                    <div className='my-3'>
                        <Input
                            label={lan.Verify_Account_Page.TextField_Contact_Name.PLACEHOLDER + ' *'}
                            id='inName'
                            type='text'
                            autoFocus={true}
                            {...register('contact', 
                                { 
                                    value: qData.contact,
                                    required: lan.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE,
                                    maxLength: {
                                        value: 45,
                                        message: lan.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID || ''
                                    }
                                }
                            )} 
                        />
                        <small className='text-red-500'>{errors.contact?.message || ''}</small>
                    </div>

                    <div className='my-3'>
                        <PhoneInput 
                            lada={lada} 
                            placeholder={lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER}
                            msg_not_valid={lan.Verify_Account_Page.TextField_Phone.MSG_NOT_VALID}
                            msg_required_value={lan.Verify_Account_Page.TextField_Phone.MSG_REQUIRED_VALUE}
                            phone={qData.phone}
                            phone_code_list={phone_code_list}
                            register={register}
                            setLada={setLada}
                        />
                        <small className='text-red-500'>{ errors.phone?.message || '' }</small>
                        <small className='text-slate-800 font-bold text-[10px] ml-2'>{  !errors.phone && lan.Verify_Account_Page.TextField_Phone.PLACEHOLDER_FORMAT }</small>
                    </div>

                    <div className='relative my-3'>
                        <select 
                            id='inParcelSupplier' 
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                            {...register('parcel_supplier', 
                                {
                                    value: parseInt(qData.parcel_supplier) > -1 ? qData.parcel_supplier : '0',
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
                                parcel_suppliers_list.map(( val ) => (
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
                            {...register('addresses.address', 
                            { 
                                    value: qData.addresses.address,
                                    required: lan.Verify_Account_Page.TextField_Address.MSG_REQUIRED_VALUE,
                                    maxLength: {
                                        value: 100,
                                        message: lan.Verify_Account_Page.TextField_Address.MSG_NOT_VALID
                                    },

                                }
                            )}
                        />
                        <small className='text-red-500'>{errors.addresses?.address?.message || ''}</small>
                    </div>
                    
                    <div className='my-3'>
                        <Input
                            id='inSecondAddress'
                            type='text'
                            label={lan.Verify_Account_Page.TextField_Second_Address.PLACEHOLDER}
                            {...register('addresses.second_address', 
                                { 
                                    value: qData.addresses.second_address,
                                    maxLength: {
                                        value: 100,
                                        message: lan.Verify_Account_Page.TextField_Second_Address.MSG_NOT_VALID
                                    },
                                }
                            )}
                        />
                        <small className='text-red-500'>{errors.addresses?.second_address?.message || ''}</small>
                    </div>

                    <div className='my-3'>
                        <span className='my-2 xs:text-sm sm:text-sm md:text-base'>
                            {lan.Verify_Account_Page.Label_Ext_Int_Number.TEXT}
                        </span>
                        <div className='flex flex-row items-center justify-between gap-2 mt-2'>
                                <Checkbox 
                                    checked={hasExtNum} 
                                    onChange={() => {
                                        setValue('addresses.ext_number', !hasExtNum ? qData.addresses.ext_number : '-' );
                                        setHasExtNum( !hasExtNum );
                                    }}
                                />
                                <div className='relative'>
                                    <input
                                        disabled={ !hasExtNum }
                                        id='inExtNumber'
                                        type='text'
                                        className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                        {...register('addresses.ext_number',
                                            {
                                                value: qData.addresses.ext_number || '-',
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
                                        setValue('addresses.int_number', !hasIntNum ? qData.addresses.int_number : '-' );
                                        setHasIntNum( !hasIntNum );
                                    }} 
                                />
                                <div className='relative'>
                                    <input
                                        disabled={ !hasIntNum }
                                        id='inIntNumber'
                                        type='text'
                                        className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                        {...register('addresses.int_number',
                                            {
                                                value: qData.addresses.int_number || '-',
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
                        <small className='text-red-500'>{errors.addresses?.int_number?.message || errors.addresses?.ext_number?.message || ''}</small>
                    </div>
                    
                    <div className='my-3'>
                        <Input
                            label={lan.Verify_Account_Page.TextField_District.PLACEHOLDER + ' *'}
                            id='inDistrict'
                            type='text'
                            {...register('addresses.district', 
                            { 
                                    value: qData.addresses.district,
                                    required: lan.Verify_Account_Page.TextField_District.MSG_REQUIRED_VALUE,
                                    maxLength: {
                                        value: 120,
                                        message: lan.Verify_Account_Page.TextField_District.MSG_NOT_VALID
                                    },
                                }
                            )}
                        />
                        <small className='text-red-500'>{errors.addresses?.district?.message || ''}</small>
                    </div>
                    
                    <div className='my-3'>
                        <Input
                            label={lan.Verify_Account_Page.TextField_Postal_Code.PLACEHOLDER + ' *'}
                            id='inPostalCode'
                            type='text'
                            {...register('addresses.postal_code', 
                                { 
                                    value: qData.addresses.postal_code,
                                    required: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE,
                                    maxLength: {
                                        value: 10,
                                        message: lan.Verify_Account_Page.TextField_Postal_Code.MSG_REQUIRED_VALUE
                                    },
                                }
                            )}
                        />
                        <small className='text-red-500'>{errors.addresses?.postal_code?.message || ''}</small>
                    </div>
                    
                    <div className='my-3'>
                        <Input
                            label={lan.Verify_Account_Page.TextField_City.PLACEHOLDER + ' *'}
                            className='p-inputtext-sm'
                            id='inCity'
                            type='text'
                            {...register('addresses.city', 
                            { 
                                    value: qData.addresses.city,
                                    required: lan.Verify_Account_Page.TextField_City.MSG_REQUIRED_VALUE,
                                    maxLength: {
                                        value: 30,
                                        message: lan.Verify_Account_Page.TextField_City.MSG_NOT_VALID
                                    },
                                }
                            )}
                        />
                        <small className='text-red-500'>{errors.addresses?.city?.message || ''}</small>
                    </div>

                    <div className='relative my-3'>
                        <select 
                            id='inState' 
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            {...register('addresses.state', 
                                {
                                    value: parseInt(qData.addresses.state) > -1 ? qData.addresses.state : '0',
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
                                states_list.map(( val ) => {
                                        if(val.country === parseInt(country))
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

                        <small className='text-red-500'>{errors.addresses?.state?.message || ''}</small>
                    </div>

                    <div className='relative my-3'>

                        <select
                            id='inCountry' 
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            {...register('addresses.country', 
                                {
                                    onChange: (event) => {setCountry(event.target.value)},
                                    value: parseInt(qData.addresses.country) > -1 ? qData.addresses.country : '0',
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
                                countries_list.map(( val ) => (
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
                        <small className='text-red-500'>{errors.addresses?.country?.message || ''}</small>
                    </div>
                    
                    <div className='my-3'>
                                
                        <Textarea 
                            label={lan.Verify_Account_Page.TextArea_Reference.PLACEHOLDER}
                            resize
                            rows={8} cols={30}
                            id='inReference'
                            {...register('addresses.reference', 
                            { 
                                    value: qData.addresses.reference,
                                    required: false,
                                    maxLength: {
                                        value: 200,
                                        message: lan.Verify_Account_Page.TextArea_Reference.MSG_NOT_VALID
                                    },
                                }
                            )}
                        ></Textarea>
                        <small className='text-red-500'>{errors.addresses?.reference?.message || ''}</small>
                    </div>
                    <hr />

                    <div className='flex flex-row justify-end'>
                        <Button variant='text' size='sm' onClick={() => router.reload()} className='flex items-center text-red-700 text-sm'>
                            <small>{lan.System_General.Button_Cancel.TEXT}</small> 
                            <i className='material-icons'>cancel</i>
                        </Button>
                        <Button type='submit' variant='text' size='sm' className='flex items-center text-sky-700 text-sm'>
                            <small>{lan.System_General.Button_Save.TEXT}</small> 
                            <i className='material-icons'>save</i>
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
