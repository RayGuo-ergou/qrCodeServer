const ConnectedDevice = require('../../model/connectedDevice');
const QRCode = require('../../model/qrCode');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');

const verify = async (req, res, next) => {
    try {
        const { token, deviceInformation } = req.body;

        // error message
        let error = new Error();
        error.status = 400;

        if (!token && !deviceInformation) {
            error.message = 'Token and device information is required';
            return next(error);
        }

        try {
            var decoded = jwt.verify(token, process.env.TOKEN_KEY);
        } catch (err) {
            return next(err);
        }

        const qrCode = await QRCode.findOne({
            userId: decoded.userId,
            disabled: false,
        });

        if (!qrCode) {
            error.message = 'QR code does not exist';
            return next(error);
        }

        const connectedDeviceData = {
            userId: decoded.userId,
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
        const user = await User.findById(decoded.userId);

        // Create token
        const authToken = jwt.sign(
            { user_id: user._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h',
            }
        );

        // Return token
        return res.status(200).json({ token: authToken });
    } catch (err) {
        return next(err);
    }
};

module.exports = verify;
