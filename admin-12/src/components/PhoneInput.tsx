import React, { FC } from 'react';
import { Button, Input, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import { UseFormRegister } from 'react-hook-form';

interface Props {
    lada: string;
    phone_code_list: {
        ladaOption: string;
        ctryLada: string;
    }[];
    placeholder: string;
    msg_required_value: string;
    msg_not_valid: string;
    setLada: React.Dispatch<React.SetStateAction<string>>;
    register: UseFormRegister<any>;
    phone: string;
}

export const PhoneInput: FC<Props> = ({ lada, phone_code_list, placeholder, msg_not_valid, msg_required_value, setLada, register, phone }) => {

    return (
        <div className='flex flex-row w-full'>
            <Menu placement='bottom-start'>
                <MenuHandler>
                    <Button
                        ripple={false}
                        variant="text"
                        color="blue-gray"
                        className="flex h-10 text-xs justify-center items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3 w-[20%]"
                    >
                        {lada || '+52 MEX'}
                    </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                    {phone_code_list.map(
                        ( val ) => {
                            return (
                                <MenuItem
                                    key={val.ladaOption}
                                    value={val.ladaOption}
                                    className="flex items-center gap-2"
                                    onClick={() => setLada(val.ladaOption)}
                                    >
                                    {val.ctryLada}
                                </MenuItem>
                            );
                        }
                    )}
                </MenuList>
            </Menu>

            <Input
                className='rounded-l-none w-full'
                id='inPhone'
                type='tel'
                maxLength={11}
                labelProps={{
                    className: "before:content-none after:content[' '] rounded-l-none pl-1",
                }}
                containerProps={{
                    className: "min-w-0",
                }}
                label={placeholder}
                {...register('phone', 
                    { 
                        value: phone,
                        required: msg_required_value,
                        maxLength: {
                            value: 45,
                            message: msg_not_valid
                        },
                        validate: async(val: string) => {

                            if( !val.match(/^[0-9]{2}-[0-9]{8}$/) )
                                return msg_not_valid;
                        }
                    }
                )}
            />
        </div>
    )
}
