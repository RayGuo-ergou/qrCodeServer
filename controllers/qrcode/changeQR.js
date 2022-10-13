const User = require('../../model/user');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');

const changeQR = async (req, res, next) => {
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
    const { email } = req.body;

    // check email and change are not empty
    if (!email || !number) {
        let error = new Error('Email or change is empty');
        error.status = 400;
        return next(error);
    }

    // we don't care what the change is, we just want to change isActive to false
    // find user via email
    const user = await User.findOne({ email: email });

    // if no user found, return error
    if (!user) {
        let error = new Error('User does not exist');
        error.status = 404;
        return next(error);
    }

    // find the qrcode with the user id and number
    const qrCode = await QRCode.findOne({ userId: user._id, number: number });

    // if no qrcode found, return error
    if (!qrCode) {
        let error = new Error('QR Code does not exist');
        error.status = 404;
        return next(error);
    }

    // if qrcode is already inactive, return error
    if (!qrCode.isActive) {
        let error = new Error('QR Code is already inactive');
        error.status = 400;
        return next(error);
    }

    // change isActive to false
    qrCode.isActive = false;

    // change lastUsedDate to now
    qrCode.lastUsedDate = Date.now();

    // save the qrcode
    await qrCode.save();

    // return success
    res.status(200).json({
        message: 'QR Code changed successfully',
        stateNow: qrCode.isActive,
        changeDate: qrCode.lastUsedDate,
    });
};

module.exports = changeQR;
