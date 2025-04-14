const express = require('express');
const { Client, localAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();//inicializa o express

//Servindo arquivos estáticos da pastas "public"
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app); //cria o servidor http
const io = socketIO(server); //inicializa o socket.io no servidor

//rota para a raiz do servidor ("/")
app.get('/', (req, res) => {
    res.send('Servidor Express funcionando!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT,  () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});