const express = require('express');
const { Client, localAuth, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();//inicializa o express

//Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); //para lidar com json no corpo das requisições
app.use(express.urlencoded({ extended: true })); // lida com dados de formulários

//Rotas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const server = http.createServer(app); //cria o servidor http
const io = socketIO(server); //inicializa o socket.io no servidor

//rota para a raiz do servidor ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/uploads', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if(err){
            return res.status(500).send('Erro ao ler a pastas de uploads');
        }

        //cria o html com as imagens
        let html = '<h1>Imagens na pasta de uploads:</h1>';
        files.forEach(file => {
            html += `<div style ="margin-bottom:20px;">
            <p>${file}</p>
            <img src="/uploads/${file}" style="max-width: 300px"/>
            </div>`;
        });

        res.send(html)

    });
});

//configurando da pasta upload com o multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploads = multer({ storage });

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

//inicializa o cliente do whatsapp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

//Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT,  () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

//rodar na web para testar: http://localhost:3000/uploads