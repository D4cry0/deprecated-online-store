(function () {
    const lblMsg = document.querySelector('#lblMsg');
    const btnLogin = document.querySelector('#login');
    const user = document.querySelector('#user');
    const userp = document.querySelector('#userp');

    const log = async () => {

        lblMsg.textContent = '';
        let msg;

        if (user.value && userp.value) {
            try {
                const resp = await fetch('https://server.com/xstar/ordenes/login', {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        user: user.value,
                        wrd: userp.value,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                msg = await resp.json();
                msg = msg['msg'];
            } catch (error) {
                console.log(error);
            }
        } else {
            msg = 'Usuario y/o contraseña incorrectos';
        }

        if (msg === 'OK') {
            window.location.replace('https://server.com/xstar/ordenes/');
        }

        user.value = '';
        userp.value = '';

        lblMsg.textContent = msg;
    }

    const keyp = (event) => {
        if (event.keyCode === 13) {
            log();
        }
    }

    btnLogin.addEventListener('click', log);

    window.addEventListener('keypress', keyp);
})();
