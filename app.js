require('dotenv').config();
require('./config/database').connect();
const routers = require('./routers');
const express = require('express');
const error = require('./middlewares/error');
const app = express();

app.use(express.json());

// user routers
app.use('/api/user', routers.user);

// qrcode routers
app.use('/api/qr', routers.qrcode);

// Error handler middleware
// This must be placed after routes
app.use(error);
module.exports = app;
