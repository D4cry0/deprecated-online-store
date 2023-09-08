import { FC, ReactNode, useReducer } from 'react';
import { AdminPanelContext, adminpanelReducer } from './';

export interface AdminPanelState {
}

const AdminPanel_INITIAL_STATE: AdminPanelState = {
}

interface Props {
    children: ReactNode;
}

export const AdminPanelProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( adminpanelReducer, AdminPanel_INITIAL_STATE );


    // Methods with dispatch


    return (
        <AdminPanelContext.Provider value={{
            // ...state

            // Methods with dispatch reference
        }}>
            { children }
        </AdminPanelContext.Provider>
    )
};