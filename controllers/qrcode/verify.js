const ConnectedDevice = require("../../model/connectedDevice");
const QRCode = require("../../model/qrCode");
const jwt = require("jsonwebtoken");
const User = require("../../model/user");

const verify = async (req, res) => {
    try {
        const { token, deviceInformation } = req.body;

        if (!token && !deviceInformation) {
            res.status(400).send("Token and deviceInformation is required");
        }

        try {
            var decoded = jwt.verify(token, process.env.TOKEN_KEY);
        } catch (err) {
            return res.status(400).send(err);
        }

        const qrCode = await QRCode.findOne({
            userId: decoded.userId,
            disabled: false,
        });

        if (!qrCode) {
            res.status(400).send("QR Code not found");
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
                expiresIn: "2h",
            }
        );

        // Return token
        return res.status(200).json({ token: authToken });
    } catch (err) {
        console.log(err);
    }
};

module.exports = verify;
