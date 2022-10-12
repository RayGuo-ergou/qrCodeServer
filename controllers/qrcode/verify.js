const ConnectedDevice = require('../../model/connectedDevice');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const utility = require('../../utility');
const decrypt = utility.cipher.decrypt;

const verify = async (req, res, next) => {
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
        const { token, deviceInformation } = req.body;

        // error message
        let error = new Error();
        error.status = 400;

        if (!token && !deviceInformation) {
            error.message = 'Token and device information is required';
            return next(error);
        }

        const qrData = await QRCode.findOne({ token: token });

        try {
            var decryptedData = decrypt(
                { text: token, nonce: qrData.nonce },
                process.env.CIPHER_KEY
            );
            console.log(decryptedData);
        } catch (err) {
            return next(err);
        }

        const qrCode = await QRCode.findOne({
            userId: decryptedData,
            disabled: false,
        });

        if (!qrCode) {
            error.message = 'QR code does not exist';
            return next(error);
        }

        const connectedDeviceData = {
            userId: decryptedData,
            qrCodeId: qrCode._id,
            deviceName: deviceInformation.deviceName,
            deviceModel: deviceInformation.deviceModel,
            deviceOS: deviceInformation.deviceOS,
            deviceVersion: deviceInformation.deviceVersion,
        };

        const connectedDevice = await ConnectedDevice.create(
            connectedDeviceData
        );

        // Update qr code
        await QRCode.findOneAndUpdate(
            { _id: qrCode._id },
            {
                isActive: true,
                connectedDeviceId: connectedDevice._id,
                lastUsedDate: new Date(),
            }
        );

        // Find user
        const user = await User.findById(decryptedData);

        // // Create token
        // const authToken = jwt.sign(
        //     { user_id: user._id },
        //     process.env.TOKEN_KEY,
        //     {
        //         expiresIn: '2h',
        //     }
        // );

        // Return user for now
        // TODO: change in the future
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};

module.exports = verify;
