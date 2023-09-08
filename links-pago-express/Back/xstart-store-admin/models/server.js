import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import hbs from 'hbs';
import * as https from 'https';
import * as io from 'socket.io';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';

import { apiRouter, htmlRouter, pagosRouter } from '../routes/index.js';

import { QuerySQL } from '../models/mysqldb.js';
import { socketController } from '../controllers/socket.controller.js';
import {
    dateMostUpdated,
    switchPayment,
    switchShipping,
    switchOrder,
    swithSysRole,
    moneyFormat,
    intFormat,
    ifselect,
    hswitch,
    hcase,
    hdefault,
    hif,
    stringformat,
    hashPermLink
} from '../helpers/hbs-h.js';

export class Server {

    constructor( nextHandler ) {
        this.app = express();
        this.port = process.env.PORT;
        this.apiPath = '/api/genpaymentlink';
        this.htmlPath = '/ordenes';
        this.pagosPath = '/checkout';
        this.hbs = hbs;
        this.server = https.createServer({
            pfx: fs.readFileSync('./ssl/p.pfx'),
            passphrase: process.env.PPHRASE
        }, this.app);

        this.io = new io.Server(this.server);
        this.qSql = new QuerySQL();

        // Middlewares (subfunciones para el web server)
        this.middlewares();

        // Rutas de la app
        this.routes( nextHandler );

        // Sockets
        this.sockets();
    }

    middlewares() {

        // HELMET
        this.app.use(helmet());
        this.app.disable('x-powered-by');

        //  CORS
        this.app.use(cors());

        // Parsing y Lectura Body
        this.app.use(express.json());
        this.app.use(cookieParser());

        // Handlebars
        this.app.set('view engine', 'hbs');
        this.hbs.registerPartials(path.resolve() + '/views/partials', (err) => { });
        this.hbs.registerHelper('dateMostUpdated', dateMostUpdated);
        this.hbs.registerHelper('switchPayment', switchPayment);
        this.hbs.registerHelper('switchShipping', switchShipping);
        this.hbs.registerHelper('switchOrder', switchOrder);
        this.hbs.registerHelper('swithSysRole', swithSysRole);
        this.hbs.registerHelper('moneyFormat', moneyFormat);
        this.hbs.registerHelper('intFormat', intFormat);
        this.hbs.registerHelper('ifselect', ifselect);
        this.hbs.registerHelper('switch', hswitch);
        this.hbs.registerHelper('case', hcase);
        this.hbs.registerHelper('default', hdefault);
        this.hbs.registerHelper('ifop', hif);
        this.hbs.registerHelper('eachstringf', stringformat);
        this.hbs.registerHelper('hashPermLink', hashPermLink);

        this.app.set('socketio', this.io);

        // DIrectorio Public
        this.app.use('/css', express.static(path.resolve() + '/node_modules/bootstrap/dist/css'))
        this.app.use('/js', express.static(path.resolve() + '/node_modules/bootstrap/dist/js'));
        this.app.use(express.static('public'));

    }

    routes( nextHandler ) {
        this.app.use(this.apiPath, apiRouter);
        // this.app.use(this.htmlPath, htmlRouter);
        this.app.use(this.pagosPath, pagosRouter);
        this.app.get(this.htmlPath, (req, res) => {
            return nextHandler(req, res);
        })
    }

    sockets() {
        this.io.on("connection", socketController);
    }


    async listen() {
        // Conetar a MySQL
        try {

            await this.qSql.testConnection();
            this.server.listen(this.port, () => {
                console.log('Server ON - port: ', this.port);
            });

        } catch (error) {
            // TODO: LOGS ARCHIVOS
            console.log('DB connection not stablished, server OFF');
            console.log(error);
        }

    }
}