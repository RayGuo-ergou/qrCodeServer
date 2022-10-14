const User = require('../../model/user');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');

const getQrCode = async (req, res, next) => {
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
    const input = req.query;

    const { email } = input;

    // if no email
    if (!email) {
        let error = new Error('Please input email');
        error.status = 400;
        return next(error);
    }

    // find user via email
    const user = await User.findOne({ email: email });

    // remove email from input
    delete input.email;

    // find all qr code via input and user id
    const qrCode = await QRCode.find({ ...input, userId: user._id });

    res.json({
        qrCode,
        username: user.first_name + ' ' + user.last_name,
    });
};

module.exports = getQrCode;
