import React, { FC, HTMLInputTypeAttribute } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

interface Props {
    control: FormControlType;
    type?: HTMLInputTypeAttribute;
    small: boolean;
    id: string;
    placeholder: string;
    formField: string;
    // msgRequired?: string;
    registerOptions: RegisterOptions;
}

export type FormControlType = 'Input' | 'Select' | 'Textarea';

export const FormControl: FC<Props> = ({ 
    control, 
    type, 
    small, 
    id,
    placeholder,
    formField,
    registerOptions,
}) => {

    const { register, handleSubmit, watch, formState: { errors }, reset } = useFormContext();

    return (
        <div className='my-3'>
            {
                control === 'Input' &&
                <>
                    {/* <label htmlFor={`inc${id}`} className="form-label">{placeholder}</label>
                    <input
                        className={ `form-control ${ small ? 'form-control-sm' : ''}`}
                        id={`inc${id}`}
                        type={ type || '' }
                        placeholder={placeholder}
                        {...register(formField, 
                            registerOptions
                        )}
                    />
                    <small className='text-danger'>{errors.cpass?.message || ''}</small> */}
                </>
            
            }

            {
                control === 'Select' &&
                <>                
                    {/* <label htmlFor='inParcelSupplier' className="form-label">{view.parcel_supplier.placeholder}</label>                      
                    <select 
                        id='inParcelSupplier' 
                        className="form-select form-select-sm" 
                        {...register('parcel_supplier', {required: true})}
                    >
                        <option selected>Selecciona</option>
                        {
                            parcelSupplierList.map(( val: VerifyAccParcelSupp ) => (
                                <option key={val.id} value={val.id}>{val.name}</option>
                            ))
                        }

                    </select>
                    {errors.parcel_supplier && <small className='text-danger'>{view.parcel_supplier.msgRequiredValue}</small>} */}
                </>
            }

            {
                control === 'Textarea' &&
                <>
                    {/* <label htmlFor='inReference' className="form-label">{view.reference.placeholder}</label>
                    <textarea 
                        className='form-control'
                        id='inReference'
                        {...register('reference', 
                            { 
                                required: false,
                                maxLength: {
                                    value: 200,
                                    message: view.reference.msgNotValid
                                },
                            }
                        )}
                    ></textarea> */}
                </>
            }

        </div>
    )
}
