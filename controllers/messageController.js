const { client } = require('../services/whatsappClient');
const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');


const getGrupoHandle = async(req, res) => {
    try {
        const chats = await client.getChats();
        const grupos = chats.filter(chat => chat.isGroup);

        const grupoInfo = grupos.map(group => ({
            nome: group.name,
            id:  group.id._serialized
        }));

        res.status(200).json(grupoInfo);
    }catch(error) {
        console.error('Erro ao listar grupos:', error);
        res.status(500).send('Erro ao listar grupos');
    }

    //para listar o id dos grupos bastar colocar a url http://localhost:3000/api/listar-grupos
};


const sendMessageHandler = async (req, res) => {
    const { numeros, mensagem } = req.body;
    const arquivos = req.files;

    // Cria um array com os números, removendo espaços extras
    const numerosArray = numeros.split(',').map(n => n.trim());

    // Cria um array de promessas
    const promises = numerosArray.map(async (numero) => {
        // Limpeza do número (remover tudo o que não for número, incluindo espaços)
        const numeroLimpo = numero.replace(/\D/g, '');

        // Verifica se o número começa com o código do país e aplica o sufixo @c.us
        const numeroComSufixo = numero.includes('@')
            ? numero
            //use g.us para grupos
            : (numeroLimpo.startWith('55') ? `${numeroLimpo}@c.us` : `55${numeroLimpo}@c.us`);

        try {
            if(mensagem) {
                await client.sendMessage(numeroComSufixo, mensagem);
            }

            //envia os arquivos individualmente
            if (arquivos && arquivos.length > 0 ) {
                for (const arquivo of arquivos){
                    const media = MessageMedia.fromFilePath(arquivo.path);
                    await client.sendMessage(numeroComSufixo, media);
                }
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



module.exports = { sendMessageHandler, getGrupoHandle };
