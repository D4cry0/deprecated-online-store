import CryptoJS from "crypto-js";

const encryptBase64URL = (data) => {
    let simb = ['+,-', '/,_', '=,~'];
    let buff = new Buffer.from(data.toString()).toString('base64');

    simb.forEach(item => {
        const splitcars = item.split(',');
        buff = buff.replace(RegExp(`[${splitcars[0]}]`, 'g'), splitcars[1]);
    });

    return buff;
}

const decryptBase64URL = (hash) => {
    let simb = ['-,+', '_,/', '~,='];
    let buff = new Buffer.from(hash, 'base64').toString();

    simb.forEach(item => {
        const splitcars = item.split(',');
        buff = buff.replace(RegExp(`[${splitcars[0]}]`, 'g'), splitcars[1]);
    });

    return buff;
}

const encryptAESURL = (data) => encryptBase64URL(CryptoJS.AES.encrypt(data.toString(), process.env.PPHRASE).toString());

const decryptAESURL = (hash) => CryptoJS.AES.decrypt(decryptBase64URL(hash), process.env.PPHRASE).toString(CryptoJS.enc.Utf8);

export {
    encryptBase64URL,
    decryptBase64URL,
    encryptAESURL,
    decryptAESURL
}