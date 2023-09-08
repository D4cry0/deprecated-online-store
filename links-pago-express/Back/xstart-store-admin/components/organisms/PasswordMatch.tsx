import React, { FC, useState } from 'react';

import { InformativeInput } from '../molecules';

interface Props {
    pass: string;
    onChangePass: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    validateErrorMsg: string;
    requiredMsg?: string;
    className?: string;
}

export const PasswordMatch: FC<Props> = ({
    pass,
    onChangePass,
    placeholder,
    requiredMsg,
    validateErrorMsg,
    className
}: Props) => {

    const [passConfirm, setPassConfirm] = useState('');   

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassConfirm(e.currentTarget.value);
    }

    return (
        <>
            <InformativeInput
                id='pass'
                type='password'
                inputValue={pass}
                onInputChange={onChangePass}
                msgValue={requiredMsg}
                placeholder={placeholder}
                className={`form-control ${className}`}
            />
            <InformativeInput
                id='compare-pass'
                type='password'
                inputValue={passConfirm}
                onInputChange={onChangeInput}
                msgValue={requiredMsg}
                placeholder={placeholder}
                className={`form-control ${className}`}
            />
            {
                validateErrorMsg.length > 1 && passConfirm !== pass && <small className='form-text'>{ validateErrorMsg }</small>
            }
        </>
    )
}
