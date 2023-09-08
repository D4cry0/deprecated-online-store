import React, { FC, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

interface Props {
    createLink: () => Promise<string>;
    getCustomer: () => Promise<{
        ok: boolean;
        msg: string;
        data: any;
    }>;
    codeCustomer: string;
    setCodeCustomer: (value: React.SetStateAction<string>) => void;
}

export const VerifyAccountAdmin: FC<Props> = ({ createLink, getCustomer, codeCustomer, setCodeCustomer }) => {

    const [url, setUrl] = useState('');
    const [customerData, setCustomerData] = useState({ok: false, msg: '', data: null});

    const onCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodeCustomer(e.target.value);
    }

    const genLink = async() => {
        // const resp = await createLink();
        setCustomerData({ok: false, msg: '', data: null});
        setUrl( await createLink() );
    }

    const fetchCustomer = async() => {
        setUrl('');
        setCustomerData( await getCustomer() );
    }


    return (

        <div className='grid'>
            <div className='row'>
                <div className='col md:col-10'>         
                    <div className='flex flex-col gap-3 p-4'>
                        <h2>Generar enlace para verificar datos del cliente</h2>

                        <div className='flex flex-col flex-grow'>
                            <label htmlFor='inCustomer' className="form-label">Código de Customer o Cliente</label>
                            <InputText 
                                id='inCustomer' 
                                type="text" 
                                placeholder='Código de Customer o Cliente' 
                                value={codeCustomer} 
                                onChange={onCustomerChange}/>
                        </div>

                        <div className='flex flex-grow py-1'>
                            {
                                url.length != 0 && 
                                <InputTextarea autoResize rows={5} cols={30} className='w-full' value={url} onChange={() => {}} />
                            }
                            {
                                customerData?.data && 
                                <>
                                    <pre className='w-full'>
                                        {JSON.stringify(customerData.data, null, 2)}
                                    </pre>
                                </>
                            }
                        </div>
                        <div className='flex flex-row gap-4 '>
                            <Button raised className='w-full' onClick={fetchCustomer}>Consultar</Button>
                            <Button raised className='w-full' onClick={genLink}>Generar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}


