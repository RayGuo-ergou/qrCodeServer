const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const { adminAuth } = require('../utility');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const AdminJSMongoose = require('@adminjs/mongoose');
const QRCode = require('../model/qrCode');
const User = require('../model/user');
const adminUtilities = require('../utility').adminPortal;
const setQRListCustom = adminUtilities.qrListCustom;
const setUserListCustom = adminUtilities.userListCustom;
const setQRShowCustom = adminUtilities.qrShowCustom;
const qrEditValidation = adminUtilities.qrEditValidation;
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
    locale: {
        translations: {
            resources: {
                qrcodes: {
                    properties: {
                        // this will override the name only for Comment resource.
                        //type: 'QR Code Type: 0 = free, 1 = cut-in, 2 = free and cut-in',
                        type: 'QR Code Type: 0 = free, 1 = cut-in, 2 = free and cut-in',
                    },
                },
            },
        },
    },
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

                    list: { after: setUserListCustom },
                },
            },
        },
        {
            resource: QRCode,
            options: {
                id: 'qrcodes',
                properties: {
                    username: {
                        type: 'string',
                    },
                },
                listProperties: QRCodeFilterItems,
                filterProperties: QRCodeFilterItems,
                editProperties: ['number', 'type', 'isActive'],
                showProperties: ['username', ...QRCodeFilterItems, 'image'],

                actions: {
                    new: { isAccessible: false },
                    list: { after: setQRListCustom },
                    show: { handler: setQRShowCustom },
                    edit: {
                        before: qrEditValidation,
                    },
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
