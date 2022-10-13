const express = require('express');
const router = express.Router();

const {
    generate,
    verify,
    getQRcodeById,
    getQR,
} = require('../controllers/qrcode');

router.get('/', getQR);
router.post('/generate', generate);
router.post('/scan', verify);
router.get('/:id', getQRcodeById);

module.exports = router;
