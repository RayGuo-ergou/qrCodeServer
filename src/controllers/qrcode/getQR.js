const User = require('../../model/user');
const QRCode = require('../../model/qrCode');
const utility = require('../../utility');
const authCheck = utility.authCheck;

const getQrCode = async (req, res, next) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
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
