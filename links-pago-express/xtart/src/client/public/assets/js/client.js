(function () {
    const lblOnline = document.querySelector('#lblOnline');
    const lblOffline = document.querySelector('#lblOffline');

    const socket = io('http://server.com', { path: '/xstar/socket.io' });


    // Listenner para el evento conectado
    socket.on('connect', () => {
        console.log('Conectado');

        lblOffline.style.display = 'none';
        lblOnline.style.display = '';
    });

    // Listenner para el evento desconectado
    socket.on('disconnect', () => {
        console.log('Desconectado');

        lblOffline.style.display = '';
        lblOnline.style.display = 'none';
    });

    // Ojo: Aqui el server envia a todos los clientes conectados
    socket.on('new-record', (payload) => {
        console.log('Servidor:', payload);

        window.location.reload();
    })

    // on es para escuchar eventos
    // emit es para mandar eventos
    // btnEnviar.addEventListener('click' , () => {
    //     const mensaje = txtMensaje.value;

    //     const payload = {
    //         mensaje,
    //         id: '1234fasd',
    //         fecha: new Date().getTime()
    //     }

    //     // ENvia el payload y obtiene una retroalimentación con el callback
    //     // Se ejecuta el callback ya que todo le proceso de enviar el mensaje finaliza
    //     socket.emit( 'enviar-mensaje', payload, ( id ) => {
    //         console.log('Desde el server', id);

    //     });
    // });
})();

