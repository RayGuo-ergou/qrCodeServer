const QRCode = require('../../model/qrCode');
const User = require('../../model/user');
const utility = require('../../utility');
const decrypt = utility.cipher.decrypt;
const authCheck = utility.authCheck;

const verify = async (req, res, next) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
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
            username: user.first_name + ' ' + user.last_name,
            number: qrCode.number,
            type: qrCode.type,
            isActive: qrCode.isActive,
            email: user.email,
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = verify;
