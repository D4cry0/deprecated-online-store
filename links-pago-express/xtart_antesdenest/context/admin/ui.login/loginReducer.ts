import { LoginSet, LoginState } from "@/interfaces";


type LoginActionType =
| { type: '[MOD-LOGIN]', payload: boolean }
| { type: '[SET]', payload: LoginSet}


export const loginReducer = ( state: LoginState, action: LoginActionType ): LoginState => {

    switch ( action.type ) {
        case '[MOD-LOGIN]':
            return {
                ...state,
                modeLogin: action.payload,
            }
        case '[SET]':
            return {
                ...state,
                [action.payload.field]: action.payload.data,
            }
        default:
            return state;
    }

}