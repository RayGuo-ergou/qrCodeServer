const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const { adminAuth } = require('../utility');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const AdminJSMongoose = require('@adminjs/mongoose');
const QRCode = require('../model/qrCode');
const User = require('../model/user');
const setQRCustom = require('../utility/adminPortal/qrCustom');
const setUserCustom = require('../utility/adminPortal/userCustom');
const QRCodeFilterItems = [
    'userId',
    'number',
    'type',
    'lastUsedDate',
    'createdDate',
    'isActive',
];
const userFilterItems = ['first_name', 'last_name', 'email', 'role'];
AdminJS.registerAdapter(AdminJSMongoose);
const admin = new AdminJS({
    resources: [
        {
            resource: User,
            options: {
                id: 'users',
                listProperties: userFilterItems,
                filterProperties: userFilterItems,
                editProperties: userFilterItems,
                showProperties: userFilterItems,
                actions: {
                    // only can show list of users
                    // not allow to create, edit, delete
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: false },

                    list: {
                        after: setUserCustom,
                    },
                },
            },
        },
        {
            resource: QRCode,
            options: {
                listProperties: QRCodeFilterItems,
                filterProperties: QRCodeFilterItems,
                editProperties: ['number', 'type', 'isActive'],
                showProperties: [...QRCodeFilterItems, 'image'],

                actions: {
                    new: { isAccessible: false },
                    list: { after: setQRCustom },
                },
            },
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
