const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const messageRoutes = require('./routes/messageRoutes');
const initSocket = require('./socket');

const server = http.createServer(app); //cria o servidor http
const io = socketIO(server); //inicializa o socket.io no servidor
const app = express();//inicializa o express

//Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); //para lidar com json no corpo das requisições
app.use(express.urlencoded({ extended: true })); // lida com dados de formulários

//Rotas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//WebSocket
initSocket(io);


//Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT,  () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

//rodar na web para testar: http://localhost:3000/uploads