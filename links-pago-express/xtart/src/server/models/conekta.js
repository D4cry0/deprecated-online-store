
import axios from 'axios';



export class ConektaApi {


    constructor() {

    }

    async createLink(orderid = '00000', customer = 'Noname', email = 'Noemail',
        phone = '0000000000', amount = '0') {
        try {

            // k - es la llave de autorización en base64
            const k = 'Basic ' + process.env.COAPI;
            // Se calcula la fecha de inicio y limite en formato UNIX
            const dToday = new Date();
            const dLim = new Date();
            dLim.setDate(dToday.getDate() + 2);

            // El monto se va sin decimales por eso se multiplica por 100
            // Se hace un post payment link para generar el enlace en Conekta
            const resp = await axios.post('https://api.conekta.io/checkouts', {
                "name": orderid,
                "type": "PaymentLink",
                "recurrent": false,
                "expires_at": Math.floor(dLim.getTime() / 1000),
                "allowed_payment_methods": ["cash", "bank_transfer"],
                "needs_shipping_contact": false,
                "monthly_installments_enabled": false,
                "monthly_installments_options": [3],
                "order_template": {
                    "line_items": [{
                        "name": orderid,
                        "unit_price": amount * 100,
                        "quantity": 1
                    }],
                    "currency": "MXN",
                    "customer_info": {
                        "name": customer,
                        "email": email,
                        "phone": phone
                    }
                }
            }, {
                headers: {
                    'Accept': 'application/vnd.conekta-v2.0.0+json',
                    'Accept-Language': 'es',
                    'Content-Type': 'application/json',
                    'Authorization': k
                }
            });

            // Si la respuesta no dice checkout no se genero el enlace
            if (!resp.data.object === 'checkout') return null;

            // Se envia la url del enlace creado para enviar el correo.
            // console.log(resp.data);

            return {
                url: resp.data.url,
                id: resp.data.id
            }

        } catch (err) {
            return 'ERROR CONEKTA: ' + err;
        }
    }

    async cancelLink(linkId) {

        try {

            const k = 'Basic ' + process.env.COAPI;

            const resp = await axios.put(`https://api.conekta.io/checkouts/${linkId}/cancel`,
                {}, {
                headers: {
                    'Accept': 'application/vnd.conekta-v2.0.0+json',
                    'Accept-Language': 'es',
                    'Content-Type': 'application/json',
                    'Authorization': k
                }
            });

            // si la respuesta falla
            if (resp.status === 400) return null;

            // si la respuesta es
            return true;

        } catch (err) {
            return 'ERROR CONEKTA: ' + err;
        }

    }
}