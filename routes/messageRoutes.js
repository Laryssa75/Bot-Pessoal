const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendMessageHandler, getGrupoHandle } = require('../controllers/messageController');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
    const allowedTypes =['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }else{
        cb(new Error('Tipo de arquvivo não permitido.Use JPEG, JPG, PNG OU PDF apenas.'))
    }
};


const upload = multer({ storage, fileFilter });

// Aqui só redireciona pra função do controller
router.post('/send', upload.array('arquivos'), sendMessageHandler);
router.get('/listar-grupos', getGrupoHandle);

module.exports = router;
