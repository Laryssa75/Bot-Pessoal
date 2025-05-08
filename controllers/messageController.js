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
  
    const numerosArray = numeros.split(',').map(n => n.trim());
  
    const envioMensagem = numerosArray.map(async (numero) => {
      const numeroLimpo = numero.replace(/\D/g, '');
      const numeroComSufixo = numero.includes('@')
        ? numero
        : (numeroLimpo.startsWith('55') ? `${numeroLimpo}@c.us` : `55${numeroLimpo}@c.us`);
  
      try {
        // Envia arquivos, se houver
        if (arquivos?.length) {
          for (const arquivo of arquivos) {
            const media = MessageMedia.fromFilePath(arquivo.path);
            await client.sendMessage(numeroComSufixo, media);
          }
        }
  
        // Envia mensagem de texto
        if (mensagem) {
          await client.sendMessage(numeroComSufixo, mensagem);
        }
  
        return { numero: numeroComSufixo, status: 'sucesso' };
  
      } catch (error) {
        return {
          numero: numeroComSufixo,
          status: 'erro',
          erro: error.message || 'Erro desconhecido'
        };
      }
    });
  
    const resultadosBrutos = await Promise.allSettled(envioMensagem);
  
    const resultados = resultadosBrutos.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : {
            numero: numerosArray[i],
            status: 'erro',
            erro: r.reason?.message || 'Erro inesperado'
          }
    );
  
    const houveErros = resultados.some(r => r.status === 'erro');
  
    res.status(houveErros ? 207 : 200).json({
      mensagem: houveErros
        ? 'Algumas mensagens não foram enviadas.'
        : 'Todas as mensagens foram enviadas com sucesso!',
      resultados
    });
  };
  


module.exports = { sendMessageHandler, getGrupoHandle };
