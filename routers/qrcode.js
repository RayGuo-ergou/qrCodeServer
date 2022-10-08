const express = require('express');
const router = express.Router();

const { generate, verify } = require('../controllers/qrcode');

router.post('/generate', generate);
router.post('/scan', verify);

module.exports = router;
