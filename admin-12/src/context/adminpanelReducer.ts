import { AdminPanelSet } from '../interfaces';
import { AdminPanelState } from './';

type AdminPanelActionType =
| { type: '[SET]', payload: AdminPanelSet }

export const adminpanelReducer = ( state: AdminPanelState, action: AdminPanelActionType ): AdminPanelState => {

    switch ( action.type ) {
        case '[SET]':
            return {
                ...state,
                [action.payload.field]: action.payload.data,
            }

        default:
            return state;
    }

}