import { encryptAESURL } from './utils.js'

const dateMostUpdated = (d1, d2, d3, d4, d5, d6, d7, options) => {
    const fDates = [d1, d2, d3, d4, d5, d6, d7]
        .map(v => v === null ? 0 : v)
        .sort()
        .reverse();

    const date = new Date(fDates[0] * 1000);
    return fDates[0] === 0 ? 'N/a' : date.toLocaleString().replace(/:[0-9][0-9] /, '').replace(/\/20/, '/');
}

const switchPayment = (val1 = '', val2 = '', options) => {
    if (val2 === 'MOD') return '<span class="badge text-bg-info">PENDIENTE</span>';

    if (val1.match(/^(.*A.*P.*)|(.*P.*A.*)$/g)) return '<span class="badge text-bg-warning">PAGO PARCIAL</span>';
    if (val1.match(/[P]/g)) return '<span class="badge text-bg-success">PAGADA</span>';
    if (val1.match(/[A]/g)) return '<span class="badge text-bg-secondary">PENDIENTE</span>';
    return val1.match(/[C]/g)
        ? '<span class="badge text-bg-danger">CANCELADA</span>'
        : '<span class="badge text-bg-info">ERROR</span>';
};

const switchShipping = (value, options) => {
    switch (value) {
        case 'P':
            return '<span class="badge text-bg-secondary">NO INICIADO</span>';
        case 'R':
            return '<span class="badge text-bg-warning">EN SURTIDO</span>';
        case 'V':
            return '<span class="badge text-bg-success">VALIDADO</span>';
        default:
            return '<span class="badge text-bg-info">ERROR</span>';
    }
}

// TODO: ACOMODAR LA PARTE SOPAYS PARA EL CAMPO PAYLINKS USAR REGEX
const switchOrder = (soStatus, sotrStatus, sopaysStatus, whmStatus, options) => {

    if (soStatus === 'CAN') return '<span class="badge text-bg-danger">CANCELADA</span>';
    if (soStatus === 'MOD') return '<span class="badge text-bg-secondary">EN MODIFICACION</span>';
    if (sotrStatus === 'E') return '<span class="badge text-bg-success">ENTREGADA</span>';
    if (sotrStatus === 'T') return '<span class="badge text-white bg-dark">ENVIADA</span>';
    if (sotrStatus === 'I') return '<span class="badge text-info bg-dark">EN ACLARACION</span>';
    if (sotrStatus === 'D') return '<span class="badge text-warning bg-dark">DEVOLUCION</span>';
    if (sopaysStatus.match(/^(.*A.*P.*)|(.*P.*A.*)$/g)) return '<span class="badge text-bg-warning">PAGO PARCIAL</span>';
    if (sopaysStatus.match(/[P]/g) && whmStatus === 'P') return '<span class="badge text-warning bg-primary">PAGADA EN ESPERA</span>';
    if (sopaysStatus.match(/[P]/g) && whmStatus !== 'P') return '<span class="badge text-bg-primary">PAGADA EN PROCESO</span>';
    return sopaysStatus.match(/[A]/g)
        ? '<span class="badge text-bg-warning">EN ESPERA DEL PAGO</span>'
        : '<span class="badge text-bg-info">ERROR</span>';
}

const swithSysRole = (value, option) => {
    switch (value) {
        case 1:
            return '{{> control-admin}}';
        case 5:
            return '{{> control-ventas}}';
        case 10:
            return '{{> control-ventas}}';
        case 9:
            return '{{> contol-wharehouse}}';
        case 11:
            return '{{> contol-wharehouse}}';
        default:
            return '<span>PANEL DE USUARIO</span>';
    }
}

const moneyFormat = (value, options) => {
    const nf = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
    });

    return nf.format(typeof value === 'string' ? parseFloat(value) : value);
}

const intFormat = (value, options) => {
    return typeof value === 'string' ? parseInt(value) : value.toFixed(0);
}

const ifselect = (val1, val2, res = '', rej = '', options) => {
    res = res.replace(/¿/g, val1).replace(/\?/g, val2);
    rej = rej.replace(/¿/g, val1).replace(/\?/g, val2);

    return val1 === val2 ? res : rej;
}

const stringformat = (value, options) => {
    let buff = '';

    value.split(',').forEach(elem => {
        buff += options.fn(elem);
    });

    return buff;
}

const hashPermLink = (value, options) => encryptAESURL(value);

// this only can be access with a function definition
// fat arrow function are not allowed to use this
function hswitch(value, options) {
    this.switch_value = value;
    this.switch_break = false;
    let html = options.fn(this);
    delete this.switch_value;
    return html;
}

function hcase(value, options) {
    if (value === this.switch_value) {
        this.switch_break = true;
        return options.fn(this);
    }
}

function hdefault(options) {
    if (this.switch_break === false) return options.fn(this);
}

function hif(val1, op, val2, options) {

    switch (op) {
        case '<': if (val1 < val2) return options.fn(this); break;
        case '>': if (val1 > val2) return options.fn(this); break;
        case '<=': if (val1 <= val2) return options.fn(this); break;
        case '>=': if (val1 >= val2) return options.fn(this); break;
        case '==': if (val1 == val2) return options.fn(this); break;
        case '!=': if (val1 != val2) return options.fn(this); break;
        case '===': if (val1 === val2) return options.fn(this); break;
        case '!==': if (val1 !== val2) return options.fn(this); break;
        case '&&': if (val1 && val2) return options.fn(this); break;
        case '||': if (val1 || val2) return options.fn(this); break;
    }
    return options.inverse(this);
}

export {
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
}