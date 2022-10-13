const User = require('../../model/user');
const QRCode = require('../../model/qrCode');

const getQrcodeById = async (req, res, next) => {
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

    res.json(qrCode);
};

module.exports = getQrcodeById;
