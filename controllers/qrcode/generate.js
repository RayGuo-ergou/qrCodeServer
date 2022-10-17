const User = require('../../model/user');
const QR = require('qrcode');
const QRCode = require('../../model/qrCode');
const utility = require('../../utility');
const encrypt = utility.cipher.encrypt;
const getRandom = utility.random;
const authCheck = utility.authCheck;

const generate = async (req, res, next) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
    }

    try {
        const { email, type } = req.body;

        // Validate user input
        // if email or type is null or undefined
        if (email == null || type == null) {
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

        // init index to 1
        let index = 1;

        // find the largest number of qrcode database
        await QRCode.findOne({ userId: user._id })
            .sort({
                number: -1,
            })
            .exec(async (err, doc) => {
                if (err) {
                    return next(err);
                }
                if (doc) {
                    index = doc.number + 1;
                }
                let nonce = getRandom(6);
                // Generate encrypted data
                const encryptedData = await encrypt(
                    {
                        nonce: nonce,
                        text: JSON.stringify({
                            userId: user._id,
                            number: index,
                        }),
                    },
                    process.env.CIPHER_KEY
                );

                const dataImage = await QR.toDataURL(encryptedData);

                // create data to save to database
                const qrData = {
                    userId: user._id,
                    number: index,
                    type: type,
                    nonce: nonce,
                    token: encryptedData,
                    image: dataImage,
                };

                // save to database
                await QRCode.create(qrData);

                // Return qr code
                return res.status(200).json({
                    dataImage,
                    type,
                    number: index,
                    username: user.first_name + ' ' + user.last_name,
                });
            });
    } catch (err) {
        return next(err);
    }
};

module.exports = generate;
