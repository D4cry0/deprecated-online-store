import * as bcryptjs from 'bcryptjs';


export const verifyLogin = async (cookie:string , host: string, secretLogin: string, roles: string[], rejectRoles: boolean) => {

    try {
        const r = await fetch( `${host}/api/v1/auth/login/validate`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
        });

        const msg = await r.json();

        if(msg?.cause === 'Unauthorized' || msg?.message === 'Unauthorized') {
            return null;
        }

        if(msg?.cause === 'User disabled' || msg?.message === 'User disabled'){
            console.log(`Unauthorized user disabled`);
            return 'Unauthorized roles';
        }
        
        if(bcryptjs.compareSync(secretLogin || '', msg?.token) == false) {
            console.warn(`Unauthorized session: ${msg.user}, token is not valid, check the secret key and verify security`);
            return null;
        }

        let valid = roles.some( role => msg?.roles.includes( role ) );

        if(valid && rejectRoles || !valid && !rejectRoles) {
            console.log(`Unauthorized roles: ${msg.user} - ${msg?.roles}`);
            return 'Unauthorized roles';
        }

        return msg.user;

    } catch (error) {
        console.log('Server error in login verification');
        console.log(error);
        return null;
    }
}

export const loginStatus = async (host: string) => {
    try {
        const r = await fetch( `${host}/api/v1/auth/login/status`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await r.json();

        return data.status;

    } catch (error) {
        console.log('Server error in login verification');
        console.log(error);
        return false;
    }
}