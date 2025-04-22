const { client } = require('../services/whatsappClient');
const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

const sendMessageHandler = async (req, res) => {
    const { numeros, mensagem } = req.body;
    const caminhoImagem = req.file?.path;

    // Cria um array com os números, removendo espaços extras
    const numerosArray = numeros.split(',').map(n => n.trim());

    // Cria um array de promessas
    const promises = numerosArray.map(async (numero) => {
        // Limpeza do número (remover tudo o que não for número, incluindo espaços)
        const numeroLimpo = numero.replace(/\D/g, '');

        // Verifica se o número começa com o código do país e aplica o sufixo @c.us
        const numeroComSufixo = numeroLimpo.startsWith('55') ? `${numeroLimpo}@c.us` : numeroLimpo;

        try {
            if (caminhoImagem) {
                // Envia a imagem se o caminho da imagem for fornecido
                const media = MessageMedia.fromFilePath(caminhoImagem);
                await client.sendMessage(numeroComSufixo, media, { caption: mensagem });
            } else {
                // Envia apenas a mensagem de texto
                await client.sendMessage(numeroComSufixo, mensagem);
            }
            console.log(`Mensagem enviada para ${numeroComSufixo}`);
        } catch (error) {
            console.error(`Erro ao enviar para ${numeroComSufixo}:`, error);
        }
    });

    try {
        // Espera todas as promessas de envio de mensagem se resolverem
        await Promise.all(promises);
        res.status(200).send('Mensagens enviadas com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao enviar mensagens');
    }
};

module.exports = { sendMessageHandler };
