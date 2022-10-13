const User = require('../../model/user');
const QR = require('qrcode');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');
const utility = require('../../utility');
const encrypt = utility.cipher.encrypt;
const getRandom = utility.random;

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
        const { email, type } = req.body;

        // Validate user input
        if (!email || !type) {
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
                return res.status(200).json({ dataImage });
            });
    } catch (err) {
        return next(err);
    }
};

module.exports = generate;
