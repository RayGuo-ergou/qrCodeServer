import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import session from 'express-session';
import connectMongo, { MongoDBSessionOptions } from 'connect-mongodb-session';
import AdminJSMongoose from '@adminjs/mongoose';
import QRCode from '../model/qrCode';
import User from '../model/user';
import Utilities from '../utility';

const MongoDBStore = connectMongo(session);
const adminUtilities = Utilities.adminPortal;
const setQRListCustom = adminUtilities.qrListCustom;
const setUserListCustom = adminUtilities.userListCustom;
const setQRShowCustom = adminUtilities.qrShowCustom;
const qrEditValidation = adminUtilities.qrEditValidation;
const adminAuth = adminUtilities.adminAuth;
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
        language: 'en',
        translations: {
            resources: {
                qrcodes: {
                    properties: {
                        // this will override the name only for Comment resource.
                        //type: 'QR Code Type: 0 = free, 1 = cut-in, 2 = free and cut-in, 3 = free and cut-in(no limit)',
                        type: 'QR Code Type: 0 = free, 1 = cut-in, 2 = free and cut-in, 3 = free and cut-in (no limit)',
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
} as MongoDBSessionOptions);

const router = () => {
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: adminAuth,
            cookieName: 'adminjs',
            cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'sessionSecret',
        },
        null,
        {
            store: store,
            resave: true,
            saveUninitialized: true,
            secret: process.env.ADMIN_SESSION_COOKIE_SECRET || 'sessionSecret',
            cookie: {
                // httpOnly: process.env.NODE_ENV === 'production',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            },
            name: 'adminjs',
        }
    );
    return adminRouter;
};

export default { router, admin };
