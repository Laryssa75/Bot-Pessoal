const { client } = require('./services/whatsappClient');

const initSocket = (io) => {
    client.on('qr', qr => {
        io.emit('qr', qr);
        io.emit('message', 'QR Code recebido, escaneie com o celular');
    });
    

    client.on('ready', () => {
        io.emit('ready', 'Cliente conectado!');
        io.emit('message', 'Whatsapp pronto!');
    });

    client.on('disconnected', reason => {
        io.emit('message', 'Cliente desconctado.');
    });

    io.on('connection', Socket => {
        Socket.emit('message', 'Conectado ao servidor');
    });

};

module.exports = initSocket;