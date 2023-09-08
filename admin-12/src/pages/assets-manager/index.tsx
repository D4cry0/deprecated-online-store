import React from 'react';

import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { AssetInformation, AssetsInformation, System_Error, System_General } from '@/interfaces';
import { Card, Input, Select, Textarea, Option, Button, Typography } from '@material-tailwind/react';
import { SubActionBar } from '@/components';
import { verifyLogin } from '@/services/verifyLogin';

interface VerifyProps {
    System_Error: System_Error;
    System_General: System_General;
}

interface Props {
    lan: VerifyProps;
}

const AssetsManager: NextPage<Props> = ({ lan }) => {

    const tableHeader = ['Nombre del Archivo', 'Remover' ];
    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset } = useForm<AssetInformation>();

    const onAddElement: SubmitHandler<AssetInformation> = async(data) => {
        console.log({data});
    }

    const onSubmint: SubmitHandler<AssetsInformation> = async(data) => {
    }

    return (
        <>
            <Head>
                <title>Administrador de archivos multimedia</title>
            </Head>
        
            <div className='col-span-10 min-h-screen p-4 border-s-2 border-gray-200'>

                    <div className='grid grid-cols-8'>
                        <SubActionBar className='col-span-6' title='Administrador de archivos multimedia' cancelPath={`/`} lan={lan} showSave={false} />
                        <Card className='col-span-3 p-5 m-5 border' >    
                            <form  onSubmit={handleSubmit(onAddElement)} className='flex flex-col gap-4' >                    
                                <Input 
                                    label='Title'
                                    type='text'
                                    {...register('title',
                                    {
                                            // value: '',
                                            required: 'lan.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE',
                                            maxLength: {
                                                value: 20,
                                                message: 'lan.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID' || ''
                                            }
                                        }
                                    )}
                                />

                                <Input 
                                    label='Términos de busqueda'
                                    type='text'
                                    {...register('searchTerms',
                                    {
                                            // value: '',
                                            required: 'lan.Verify_Account_Page.TextField_Contact_Name.MSG_REQUIRED_VALUE',
                                            maxLength: {
                                                value: 100,
                                                message: 'lan.Verify_Account_Page.TextField_Contact_Name.MSG_NOT_VALID' || ''
                                            }
                                        }
                                    )}
                                />

                                <Textarea 
                                    label='Caption'
                                    resize
                                    rows={5} cols={30}
                                    id='inReference'
                                    {...register('caption', 
                                    { 
                                            // value: 'qData.addresses.reference',
                                            required: false,
                                            maxLength: {
                                                value: 60,
                                                message: 'lan.Verify_Account_Page.TextArea_Reference.MSG_NOT_VALID'
                                            },
                                        }
                                    )}
                                >
                                </Textarea>

                                <div className='relative w-full'>
                                    <select
                                        id='inMediaType'
                                        className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        {...register('mediaType',
                                            {
                                                value: 'Selecciona',
                                                required: 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE',
                                                // validate: (val: string) => {
                                                //     if( val === '0'  ) {
                                                //         return 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE'
                                                //     }
                                                // }
                                            }
                                        )}
                                    >
                                        <option key={0} value={'Selecciona'}>Selecciona</option>
                                        {/* {
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
                                        } */}
                                    </select>
                                    <label htmlFor='inMediaType' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        {'Tipo de archivo' + ' *'}
                                    </label>
                                </div>

                                <div className='relative w-full'>
                                    <select
                                        id='inMediaRelationType'
                                        className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        {...register('mediaType',
                                            {
                                                value: 'Selecciona',
                                                required: 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE',
                                                // validate: (val: string) => {
                                                //     if( val === '0'  ) {
                                                //         return 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE'
                                                //     }
                                                // }
                                            }
                                        )}
                                    >
                                        <option key={0} value={'Selecciona'}>Selecciona</option>
                                        {/* {
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
                                        } */}
                                    </select>
                                    <label htmlFor='inMediaRelationType' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        {'Media relation type' + ' *'}
                                    </label>
                                </div>

                                <div className='relative w-full'>
                                    <select
                                        id='inUsage'
                                        className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        {...register('usage',
                                            {
                                                value: 'Selecciona',
                                                required: 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE',
                                                // validate: (val: string) => {
                                                //     if( val === '0'  ) {
                                                //         return 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE'
                                                //     }
                                                // }
                                            }
                                        )}
                                    >
                                        <option key={0} value={'Selecciona'}>Selecciona</option>
                                        {/* {
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
                                        } */}
                                    </select>
                                    <label htmlFor='inUsage' className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        {'Usage' + ' *'}
                                    </label>
                                </div>


                                <input
                                    type='file'
                                    id='avatar'
                                    accept='image/*,.pdf'

                                    {...register('file',
                                        {
                                            required: 'lan.Verify_Account_Page.Select_State.MSG_REQUIRED_VALUE',
                                        }
                                    )}

                                    className={`
                                        file:middle
                                        file:none
                                        file:center
                                        file:mr-3
                                        file:rounded-lg
                                        file:bg-blue-500
                                        file:py-3
                                        file:px-6
                                        file:font-sans
                                        file:text-xs
                                        file:font-bold
                                        file:uppercase
                                        file:text-white
                                        transition-all
                                        hover:file:opacity-[0.85]
                                        focus:opacity-[0.85]
                                        focus:shadow-none
                                        active:opacity-[0.85]
                                        active:shadow-none
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                        disabled:shadow-none
                                    `}
                                />

                                <Button type='submit' className='flex justify-center items-center gap-2'>
                                    <i className='material-icons'>library_add</i>
                                    Agregar
                                </Button>
                            </form>
                        </Card>
                        <Card className='col-span-3 m-5 border overflow-scroll'>
                            <table className='w-full min-w-max table-auto text-left'>
                                <thead>
                                <tr>
                                    {tableHeader.map((header) => (
                                        <th key={header} className='border-b border-blue-gray-100 bg-blue-gray-50 p-2'>
                                            <Typography
                                                variant='small'
                                                color='blue-gray'
                                                className='font-normal leading-none opacity-70'
                                            >
                                                {header}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        // customersUpdated[0].usrProps === 'ERROR: en la consulta de actualizaciones' 
                                        // ?
                                        //     <tr className='even:bg-blue-gray-50/50'>
                                        //         <td className='p-2'>
                                        //             <Typography variant='small' color='blue-gray' className='font-normal'>
                                        //                 {customersUpdated[0].usrProps || ''}
                                        //             </Typography>
                                        //         </td>
                                        //         <td>

                                        //         </td>
                                        //     </tr>
                                        // : 
                                        //     customersUpdated.map(( customer, index) => (
                                        //         <tr key={index} index-data={index} className='even:bg-blue-gray-50/50'>
                                        //             <td className='p-2'>
                                        //                 <Typography variant='small' color='blue-gray' className='text-xs'>
                                        //                     {customer.usrProps || ''}
                                        //                 </Typography>
                                        //             </td>
                                        //             <td className='p-2'>
                                        //                 <Typography variant='small' color='blue-gray' className='text-xs'>
                                        //                     { customer.date !== '' ? new Date(customer.date).toLocaleString('es-MX', {timeZone: 'America/Mexico_City'}) : ''}
                                        //                 </Typography>
                                        //             </td>
                                        //         </tr>
                                        //     ))
                                    }
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    



            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale, req }) => {
    let lan: VerifyProps;
    const session = await verifyLogin(req.headers.cookie || '', process.env.NEXT_PUBLIC_HOSTURLAPI || '', process.env.SECRETLOGIN || '', ['CUSTOMER'], true);

    if(!session || session === 'Unauthorized roles') {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}/login${ session === 'Unauthorized roles' ? '?e=roles' : ''}`,
            }
        }
    }

    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/locales/${locale}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            },
            body: JSON.stringify({
                sections: [
                    'Login_Page',
                    'Verify_Account_Page',
                    'System_Error',
                    'Account_Page',
                    'System_General'
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

    return {
        props: {
            lan,
        }
    }
}


export default AssetsManager;