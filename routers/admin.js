const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const { adminAuth } = require('../utility');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const AdminJSMongoose = require('@adminjs/mongoose');
const QRCode = require('../model/qrCode');
const User = require('../model/user');

AdminJS.registerAdapter(AdminJSMongoose);
const admin = new AdminJS({
    resources: [
        {
            resource: User,
            options: {
                id: 'users',
            },
        },
        {
            resource: QRCode,
        },
    ],
});

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
});

const router = () => {
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: adminAuth,
            cookieName: 'adminjs',
            cookiePassword: 'sessionsecret',
        },
        null,
        {
            store: store,
            resave: true,
            saveUninitialized: true,
            secret: 'sessionsecret',
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            },
            name: 'adminjs',
        }
    );
    return adminRouter;
};

module.exports = {
    admin,
    router,
};
