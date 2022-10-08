const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');

router.post('/', register);

router.get('/', login);

module.exports = router;
