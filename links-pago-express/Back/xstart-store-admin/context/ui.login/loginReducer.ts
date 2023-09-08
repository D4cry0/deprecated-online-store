import { LoginSet, LoginState } from "@/interfaces";


type LoginActionType =
| { type: 'Login', payload: LoginState }
| { type: '[SET]', payload: LoginSet}


export const loginReducer = ( state: LoginState, action: LoginActionType ): LoginState => {

    switch ( action.type ) {
        case 'Login':
            return {
                ...action.payload,
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