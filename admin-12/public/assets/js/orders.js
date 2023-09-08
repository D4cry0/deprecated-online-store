(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    const urlAPI = 'https://server/xstar/api/genpaymentlink/order';
    const btnsClipBoard = document.querySelectorAll("[id^='btncpy-']");
    const btnsExe = document.querySelectorAll("[id^='btnexe-']");
    const selectExe = [...document.querySelectorAll("[id^='selectexe-']")];

    console.log(selectExe);

    const actionOrder = async (so, method, action, payload) => {
        const resp = await fetch(`${urlAPI}${so}/${action}`, {
            method,
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(resp);
        return resp;
    }

    btnsClipBoard.forEach((node) => {
        node.addEventListener('click', () => {
            navigator.clipboard.writeText("https://server.com/xstar/checkout/" + node.id.split('btncpy-')[1]);
        });
    });

    // Buscamos el nodo que tenga el ID_SO y con Regex y Find logramos el cometido
    // Se llaman las funciones de acuerdo a la accion a ejecutar
    btnsExe.forEach((node) => {
        const so = node.id.split('btnexe-')[1];
        node.addEventListener('click', async () => {
            const item = selectExe.find((value) => {
                return !!value.id.match(RegExp(`[${so}]`, 'g'));
            });

            let resp = null;
            switch (item.value.split('-')[1]) {
                case "CANCELAR":
                    // TODO: Ejecutar acciones
                    console.log('Cancelar', so);
                    resp = await actionOrder(so, 'PATCH', 'cancel', {});
                    break;
                case "MODIFICAR":
                    // TODO: Ejecutar acciones
                    console.log('Modificar', so);
                    resp = await actionOrder(so, 'PATCH', 'update', {});
                    break;
            }

            console.log('Respuesta:', resp);

        });
    });
})();