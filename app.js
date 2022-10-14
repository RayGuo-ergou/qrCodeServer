require('dotenv').config();
require('./config/database');
const routers = require('./routers');
const express = require('express');
const error = require('./middlewares/error');
const app = express();
const { admin, router } = routers.admin;
const helmet = require('helmet');
const cors = require('cors');

app.use(express.json());

var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// use helmet to secure the app by setting various HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
            },
        },
    })
);
app.use(cors(corsOptions));

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
