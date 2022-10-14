const User = require('../../model/user');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');

const getQrcodeById = async (req, res, next) => {
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
    const number = req.params.id;
    const email = req.query.email;

    if (!number || !email) {
        let error = new Error('All input is required');
        error.status = 400;
        return next(error);
    }

    // find user via email
    const user = await User.findOne({ email: email });

    // Validate is user exist
    if (!user) {
        let error = new Error('User does not exist');
        error.status = 404;
        return next(error);
    }

    // find qr code via number and user id
    const qrCode = await QRCode.findOne({ number: number, userId: user._id });

    // Validate is qr code exist
    if (!qrCode) {
        let error = new Error('QR code does not exist');
        error.status = 404;
        return next(error);
    }

    res.json({
        qrCode,
        username: user.first_name + ' ' + user.last_name,
    });
};

module.exports = getQrcodeById;
