const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendMessageHandler, getGrupoHandle } = require('../controllers/messageController');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Aqui só redireciona pra função do controller
router.post('/send', upload.single('imagem'), sendMessageHandler);
router.get('/listar-grupos', getGrupoHandle);

module.exports = router;
