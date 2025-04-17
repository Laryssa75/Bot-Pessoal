const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadConfig');
const { sendMessageHandler } = require('../controllers/messageController');

router.post('/', upload.single('imagem'), sendMessageHandler);

module.exports = router;