// export every file in this directory
import decrypt from './cipher/decrypt';
import encrypt from './cipher/encrypt';
import random from './random';
import adminAuth from './adminPortal/auth';
import qrListCustom from './adminPortal/qrListCustom';
import qrShowCustom from './adminPortal/qrShowCustom';
import userListCustom from './adminPortal/userListCustom';
import qrEditValidation from './adminPortal/qrEditValidation';
import authCheck from './authCheck';
import qrCodeWithIcon from './qrcode/qrCodeWithIcon';

export default {
    cipher: {
        decrypt,
        encrypt,
    },
    random,
    adminPortal: {
        adminAuth,
        qrListCustom,
        qrShowCustom,
        userListCustom,
        qrEditValidation,
    },
    authCheck,
    qrCode: {
        qrCodeWithIcon,
    },
};
