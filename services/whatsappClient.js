const { client, LocalAuth, AuthStrategy } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    AuthStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', qr => {
    qrcode.generate(qr,  { small:true });
});

client.on('ready', () => {
    console.log('Cliente conectado!');
});

client.on('disconnected', reason => {
    console.log('Cliente desconectado:', reason);
});

client.initialize();

module.exports = { client };