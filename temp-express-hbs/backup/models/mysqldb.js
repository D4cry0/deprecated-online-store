import mysql2 from 'mysql2/promise';

import { SQLStatements } from '../data/sql-statements.js';

export class QuerySQL {

    constructor() {
        this.q = new SQLStatements();
    }

    async sqlQuery(sql = '', data = []) {
        let res = true; // Para la funcion TEST es necesario return true

        const dbcon = await mysql2.createConnection({
            host: process.env.HOSTNAMEDB,
            user: process.env.USERDB,
            password: process.env.PSSDB,
            database: process.env.MYSQLDB,
            multipleStatements: false
        }).catch(val => {
            res = `ERROR in BD ${process.env.MYSQLDB}: ${val.stack}`;
        });

        if (typeof (res) !== 'boolean' && res.split(' ', 1)[0] === 'ERROR')
            throw new Error(res);

        await dbcon.connect()
            .catch(val => {
                res = `ERROR in BD ${process.env.MYSQLDB}: ${val.stack}`;
            });

        if (typeof (res) !== 'boolean' && res.split(' ', 1)[0] === 'ERROR')
            throw new Error(res);

        if (sql !== 'TEST')
            res = await dbcon.query(sql, data)
                .catch(err => {
                    res = `ERROR in BD ${process.env.MYSQLDB}: SQL ${sql.split(' ', 1)[0]}: ${err.stack}`;
                });

        dbcon.end();

        if (!res && typeof (res) !== 'boolean' && Array.isArray(res) == false && res.split(' ', 1)[0] === 'ERROR')
            throw new Error(res);

        return res;
    }

    async isFieldExist(field, value) {
        // TODO: ADAPTAR A DB
        throw new Error('En construcción 504');
        const sql = 'SELECT EXISTS(SELECT 1 FROM permlinks WHERE ??=?)';
        const res = await this.sqlQuery(sql, [field, value]);

        // Accedemos de esta manera porque el nombre del campo del objeto es la misma consulta.
        return !!Object.values(res[0][0])[0];
    }

    async insertNewData(order, customer, conekta, conektaId, mercado_pago, ID_USR) {
        // TODO: ADAPTAR A DB
        throw new Error('En construcción 504');
        const sql = 'INSERT INTO `permlinks` ('
            + '`order`,'
            + '`customer`,'
            + '`conekta`,'
            + '`conektaId`,'
            + '`mercado_pago`,'
            + '`status`,'
            + '`paid`,'
            + '`ID_USR`) VALUES (?, ?, ?, ?, ?, true, false, ?)';
        const res = await this.sqlQuery(sql, [order, customer, conekta, conektaId, mercado_pago, ID_USR]);

        return res;
    }

    // Solo aceptara actualizar los booleans
    // sub_ids format [true, 'ID_NAME', id_name_value ]
    async updateStatus(id_so, table, field, value, ...sub_ids) {
        const res = !sub_ids[0]
            ? await this.sqlQuery(this.q.sqlUpdateStatus, [table, field, value, id_so])
            : await this.sqlQuery(
                this.q.sqlUpdateStatus + ' AND ??=?',
                [table, field, value, id_so, sub_ids[1], sub_ids[2]])

        return res;
    }

    // Para el Home con limit
    async getPermLinks(so_type, offset, row_count) {
        const res = await this.sqlQuery(this.q.sqlPermLinks, [so_type, offset, row_count]);

        return res[0];
    }

    async getLinksByPermlink(so_type, offset, row_count) {
        const res = await this.sqlQuery(this.q.sqlLinksByPermlink, [so_type, offset, row_count]);

        return res[0];
    }

    // Este es para cuando acceden al permalink
    async getPaymentInfo(id_so) {
        const res = await this.sqlQuery(this.q.sqlPaymentInfo, [id_so]);

        return res[0];
    }

    async getShippingInfo(id_so) {
        const res = await this.sqlQuery(this.q.sqlShippingInfo, [id_so]);

        return res[0][0];
    }

    // Solo un contador
    async getTotalLinks(so_type) {
        const res = await this.sqlQuery(this.q.sqlTotalLinks, [so_type]);

        return Object.values(res[0][0])[0];
    }

    async getAllParcelSuppliers() {
        const res = await this.sqlQuery(this.q.sqlAllParcelSuppliers, []);

        return res[0];
    }

    async getLogin(userName, userPssw) {
        const res = await this.sqlQuery(this.q.sqlLogin, [userName, userPssw]);

        return res[0][0];
    }

    async getUAuth(uid) {
        const res = await this.sqlQuery(this.q.sqlUAuth, [uid]);

        return res[0][0];
    }

    // Verificamos que tengamos conexión de lo contrario abortar
    async testConnection() {

        return await this.sqlQuery('TEST', []);
    }
}