import { SysUser } from './GlobalAppContext';
import { GlobalAppState } from './GlobalAppProvider';

type GlobalAppActionType =
| { type: '[UPDATE]', payload: string }
| { type: '[SET-ROLE]' }
| { type: '[AUTH] - Login', payload: SysUser }
| { type: '[AUTH] - Logout'}


export const globalappReducer = ( state: GlobalAppState, action: GlobalAppActionType ): GlobalAppState => {

    switch ( action.type ) {
        case '[UPDATE]':
            return {
                ...state,
                // prop: [ ...state.prop, action.payload ],
            }
        case '[SET-ROLE]':
            return {
                ...state,
                //prop: value,
            }
        case '[AUTH] - Login':
            return {
                ...state,
                user: action.payload
            }
        case '[AUTH] - Logout':
            return {
                ...state,
                user: {
                    login_name: '',
                    status: '',
                    roles: [],
                }
            }
        default:
            return state;
    }

}