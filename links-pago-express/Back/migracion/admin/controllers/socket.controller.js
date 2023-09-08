const socketController = (socket) => {
    console.log('CLiente conectado', socket.id);

    socket.on('disconnect', () => {
        console.log('CLiente desconectado', socket.id);
    });

    // se crean los listener
    // La función del callback se transforma en un controlador como en la REST API

    socket.on('enviar-mensaje', (payload, callback) => {

        const id = 12345;
        callback(id);

        // Se envia el mismo payload o otro lo que gustes
        // socket.emit es para el mismo
        // socket.broadcast.emit es para enviar a todos los clientes
        // menos el que lo envía
        socket.broadcast.emit('enviar-mensaje', payload);
    });

}

export {
    socketController
}