require('dotenv').config();
require('./config/database');
const routers = require('./routers');
const express = require('express');
const error = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const app = express();
const { admin, router } = routers.admin;
const helmet = require('helmet');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
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

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// for history mode
app.use('/login', express.static(__dirname + '/public/index.html'));
app.use('/generate', express.static(__dirname + '/public/index.html'));
app.use('/scan', express.static(__dirname + '/public/index.html'));

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
