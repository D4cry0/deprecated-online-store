import dotenv from 'dotenv';
import next from 'next';

import { Server } from './models/server.js';

dotenv.config();

const nextApp = next({ dev: true });
const nextHandle = nextApp.getRequestHandler();

nextApp.prepare()
    .then(() => {
        const server = new Server( nextHandle );
        server.listen();
    })
    .catch((error) => {
        // TODO: LOGS ARCHIVOS
        console.log('DB connection not stablished, server OFF');
        console.log(error);
    })





