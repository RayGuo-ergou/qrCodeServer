const User = require('../../model/user');
const QR = require('qrcode');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');
const generate = async (req, res, next) => {
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
        const { userId } = req.body;

        // error message
        let error = new Error();
        error.status = 400;

        // Validate user input
        if (!userId) {
            error.message = 'All input is required';
            return next(error);
        }

        const user = await User.findById(userId);

        // Validate is user exist
        if (!user) {
            error.message = 'User does not exist';
            error.status = 404;
            return next(error);
        }

        const qrExist = await QRCode.findOne({ userId });

        // If qr exist, update disable to true and then create a new qr record
        if (!qrExist) {
            await QRCode.create({ userId });
        } else {
            // find all and update
            await QRCode.updateMany({ userId }, { $set: { disabled: true } });

            await QRCode.create({ userId });
        }

        // Generate encrypted data
        const encryptedData = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: '1d',
            }
        );

        // Generate qr code
        const dataImage = await QR.toDataURL(encryptedData);

        // Return qr code
        return res.status(200).json({ dataImage });
    } catch (err) {
        return next(err);
    }
};

module.exports = generate;
