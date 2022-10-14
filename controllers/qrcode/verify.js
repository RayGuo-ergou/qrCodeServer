const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const utility = require('../../utility');
const decrypt = utility.cipher.decrypt;

const verify = async (req, res, next) => {
    //check if user is logged in use jwt
    if (!req.headers.authorization) {
        let error = new Error('You are not authorized to access this resource');
        error.status = 401;
        return next(error);
    }

    // decode the jwt and see if it valid
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            jwt.verify(token, process.env.TOKEN_KEY);
        } catch (err) {
            err.status = 400;
            return next(err);
        }
    }

    try {
        const { token } = req.body;

        if (!token) {
            let error = new Error('Token is required');
            error.status = 400;
            return next(error);
        }

        const qrData = await QRCode.findOne({ token: token });

        if (!qrData) {
            let error = new Error('Token is invalid');
            error.status = 400;
            return next(error);
        }

        try {
            var decryptedData = decrypt(
                { text: token, nonce: qrData.nonce },
                process.env.CIPHER_KEY
            );
            console.log(decryptedData);
        } catch (err) {
            return next(err);
        }

        const decryptedJson = JSON.parse(decryptedData);

        const qrCode = await QRCode.findOne({
            userId: decryptedJson.userId,
            number: decryptedJson.number,
        });

        if (!qrCode) {
            let error = new Error('QR Code does not exist');
            error.status = 404;
            return next(error);
        }

        // Find user
        const user = await User.findById(decryptedJson.userId);

        // TODO: change in the future
        return res.status(200).json({
            message: 'QR code verified',
            user: user.email,
            number: qrCode.number,
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = verify;
