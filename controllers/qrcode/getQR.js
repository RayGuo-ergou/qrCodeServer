const User = require('../../model/user');
const QRCode = require('../../model/qrCode');

const getQrCode = async (req, res, next) => {
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

    res.json(qrCode);
};

module.exports = getQrCode;
