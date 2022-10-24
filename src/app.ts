import dotenv from 'dotenv';
dotenv.config();

import './config/database';
import routers from './routers';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import error from './middleware/error';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app: Express = express();
const { admin, router } = routers.admin;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
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
                imgSrc: ["'self'", 'data:', 'blob:'],
            },
        },
    })
);
app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'));

app.get('/', (req: Request, res: Response) => {
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

export default app;
