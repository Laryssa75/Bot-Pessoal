const { client } = require('../services/whatsappClient');
const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

const sendMessageHandler = async (req, res) => {
    const { numeros, mensagem } =req.body;
    const caminhoImagem = req.file?.path;

    const numerosArray = numeros.split(',').map(n => n.trim());

    for(const numero of numerosArray) {
        const numeroComSufixo = numero.includes('@c.us') ? numero: `${numero}@c.us`;
    
        try {
            if(caminhoImagem) {
                const media = MessageMedia.fromFilePath(caminhoImagem);
                await client.sendMessage(numeroComSufixo, media, { caption: mensagem });
            }else {
                await client.sendMessage(numeroComSufixo, mensagem);
            }
            console.log(`Mensagmem enviada para ${numero}`);
        } catch (error) {
            console.error(`Erro ao enviar para ${numero}:`, error);
        }
    }

    res.send('Mensagens enviadas!');
};

module.exports = { sendMessageHandler };