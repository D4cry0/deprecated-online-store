import React, { FC, HTMLInputTypeAttribute, useState } from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/types';

interface Props {
    toolTipPlacement?: Placement;
    id: string;
    type: HTMLInputTypeAttribute;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    msgValue?: string;
    placeholder?: string;
    autoFocus?: boolean;
    // Other props
    [name: string]: any;
}

export const InformativeInput: FC<Props> = ({ 
        id,
        type,
        placeholder = '',
        autoFocus = false,
        inputValue,
        onInputChange,
        msgValue = '',
        toolTipPlacement,
        ...props }: Props) => {

            const [isFocusOut, setIsFocusOut] = useState(false);

            const onLooseFocus = () => {
                setIsFocusOut(true);
            }

            return (
                <>
                    <OverlayTrigger
                        placement={ toolTipPlacement }
                        overlay={<Tooltip>'TEXTO'</Tooltip>}
                        show={ toolTipPlacement !== undefined && true }
                    > 
                        <input className='form-control'
                            type={type}
                            id={id}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            value={inputValue}
                            onChange={onInputChange}
                            onBlur={ onLooseFocus }
                            {...props}
                        />
                    </OverlayTrigger>
                    {
                        isFocusOut && msgValue.length > 1 && inputValue.length < 1 && <small className='form-text'>{ msgValue }</small>
                    }
                </>
            )
}
