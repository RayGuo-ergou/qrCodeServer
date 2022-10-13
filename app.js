require('dotenv').config();
require('./config/database');
const routers = require('./routers');
const express = require('express');
const error = require('./middlewares/error');
const app = express();
const { admin, router } = routers.admin;

app.use(express.json());

// user routers
app.use('/api/user', routers.user);

// qrcode routers
app.use('/api/qr', routers.qrcode);

// admin routers
app.use(admin.options.rootPath, router());

// Error handler middleware
// This must be placed after routes
app.use(error);
module.exports = app;
