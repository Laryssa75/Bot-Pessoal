const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const messageRoutes = require('./routes/messageRoutes');
const initSocket = require('./socket');

const app = express();//inicializa o express
const server = http.createServer(app); //cria o servidor http
const io = socketIO(server); //inicializa o socket.io no servidor

//Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); //para lidar com json no corpo das requisições
app.use(express.urlencoded({ extended: true })); // lida com dados de formulários

//Rotas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', messageRoutes);

//WebSocket
initSocket(io);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        caminho: req.originalUrl,
        metodo: req.method
    });
});

//Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT,  () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});


//rodar na web para testar: http://localhost:3000