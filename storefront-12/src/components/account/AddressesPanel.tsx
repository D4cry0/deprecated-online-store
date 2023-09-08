import React, { FC, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler } from 'react-hook-form';
import { Alert, Card } from '@material-tailwind/react';

import { Login_Page, Verify_Account_Page, System_Error, CustomerAddresses, CustomerSingleAddress, Account_Page, System_General } from '@/interfaces';
import { Address } from './Address';

interface VerifyProps {
    Login_Page: Login_Page;
    Verify_Account_Page: Verify_Account_Page;
    System_Error: System_Error;
    Account_Page: Account_Page;
    System_General: System_General;
}

interface Props {
    qData: CustomerAddresses;
    lan: VerifyProps;
}

export const AddressesPanel: FC<Props> = ({ qData, lan }) => {

    const router = useRouter();
    const [selectedAddress, setSelectedAddress] = useState({} as CustomerSingleAddress);
    const [ lada, setLada ] = useState(selectedAddress.phone_ctry_code || '+52');
    const [ showAlert, setShowAlert ] = useState(false);

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const index = parseInt(event.currentTarget.getAttribute('index-data') || '-1');
        const add = qData.addresses.at(index);

        if(add != undefined) { 
            setSelectedAddress(add);
            setLada(add.phone_ctry_code);
        }
    }

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [showAlert]);


    const onSubmit: SubmitHandler<CustomerSingleAddress> = async(data) => {
    
        try {
            const r = await fetch( `${process.env.NEXT_PUBLIC_HOSTURLAPI}/api/v1/customers/addresses/${selectedAddress.idCushadd}`, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify({
                    contact: data.contact,
                    phone: lada + '-' + data.phone,
                    parcel_supplier: data.parcel_supplier,
                    address: data.addresses.address,
                    second_address: data.addresses.second_address,
                    ext_number: data.addresses.ext_number,
                    int_number: data.addresses.int_number,
                    district: data.addresses.district,
                    postal_code: data.addresses.postal_code,
                    city: data.addresses.city,
                    state: data.addresses.state,
                    country: data.addresses.country,
                    reference: data.addresses.reference,
                    primary: data.primary
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if( r.ok && r.status == 200 ){
                qData.errMsg = lan.Verify_Account_Page.Msg_Saved.TEXT;
                router.reload();
            } else {
                qData.errMsg = lan.System_Error.Server_1000.TEXT;
            }
        } catch (error) {
            qData.errMsg = lan.System_Error.Server_1000.TEXT;
        }

        setShowAlert(true);
    }

    return (
        <div className='w-full grid grid-cols-2'>
            
            {
                selectedAddress.idAdd == undefined || selectedAddress.idAdd < 0
                ? qData.addresses && qData.addresses.length > 0 && qData.addresses.map((address, index) => (
                    <Card key={address.idAdd} index-data={index} className='p-5 m-5 hover:border-2 col-span-2 md:col-span-1' onClick={handleCardClick}>
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center my-3'>
                                <span className='text-lg flex items-center'>
                                    <i className='material-icons-outlined'>location_on</i>
                                    <span className='text-lg'>{address.addresses.address}</span>
                                </span>
                                <span className='uppercase'>{address.primary ? 'Principal' : ''}</span>
                            </div>
                            <h2>{address.contact}</h2>
                        </div>
                    </Card>
                ))
                : <div className='col-span-2'>
                    <Address
                        qData={selectedAddress}
                        phone_code_list={qData.phone_code_list}
                        parcel_suppliers_list={qData.parcel_suppliers_list}
                        states_list={qData.states_list}
                        countries_list={qData.countries_list}
                        lan={lan} 
                        lada={lada}
                        setLada={setLada}
                        onSubmit={onSubmit}
                    />
                  </div>
            }
            {
                showAlert &&
                <div className='fixed bottom-4 w-full flex justify-center items-center'>
                    <Alert color='blue' variant='filled' className='w-full md:w-1/4'>
                        <h3 className='text-white-700'>{qData.errMsg}</h3>
                    </Alert>
                </div>
            }

        </div>
    )
}
