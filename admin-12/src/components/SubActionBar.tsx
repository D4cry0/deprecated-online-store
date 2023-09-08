import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Button, Card } from '@material-tailwind/react';
import { System_General } from '@/interfaces';

interface VerifyProps {
    System_General: System_General;
}

interface Props {
    title: string;
    cancelPath: string;
    lan: VerifyProps;
    className?: string;
    showSave?: boolean;
}

export const SubActionBar: FC<Props> = ({ className, title, cancelPath, lan, showSave = true }) => {

    const router = useRouter();

    return (
        <Card className={`px-5 mx-5 h-10 flex flex-row justify-between items-center ${className}`}>
            <div className='flex flex-row justify-start'>
                <h1 className='text-2xl font-bold'>{title}</h1>
            </div>
            <div className='flex flex-row justify-end items-center'>
                <Button variant='text' size='sm' onClick={() => router.push(cancelPath)} className='flex items-center text-red-700 text-sm'>
                    <small>{lan.System_General.Button_Cancel.TEXT}</small>
                    <i className='material-icons'>cancel</i>
                </Button>
                {
                    showSave && 
                    <Button type='submit' variant='text' size='sm' className='flex items-center text-sky-700 text-sm'>
                        <small>{lan.System_General.Button_Save.TEXT}</small>
                        <i className='material-icons'>save</i>
                    </Button>
                }
            </div>
        </Card>
    )
}
