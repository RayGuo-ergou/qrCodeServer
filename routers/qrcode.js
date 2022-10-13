const express = require('express');
const router = express.Router();

const {
    generate,
    verify,
    getQRcodeById,
    getQR,
    changeQR,
} = require('../controllers/qrcode');

router.get('/', getQR);

router.post('/generate', generate);

router.post('/scan', verify);

router.get('/:id', getQRcodeById);
router.patch('/:id', changeQR);

module.exports = router;
