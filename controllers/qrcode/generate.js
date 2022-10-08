const User = require("../../model/user");
const QR = require("qrcode");
const QRCode = require("../../model/qrCode");
const jwt = require("jsonwebtoken");
const generate = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate user input
        if (!userId) {
            res.status(400).send("User Id is required");
        }

        const user = await User.findById(userId);

        // Validate is user exist
        if (!user) {
            res.status(400).send("User not found");
        }

        const qrExist = await QRCode.findOne({ userId });

        // If qr exist, update disable to true and then create a new qr record
        if (!qrExist) {
            await QRCode.create({ userId });
        } else {
            // await QRCode.findOneAndUpdate(
            //     { userId },
            //     { $set: { disabled: true } }
            // );
            // await QRCode.create({ userId });

            // find all and update
            await QRCode.updateMany({ userId }, { $set: { disabled: true } });

            await QRCode.create({ userId });
        }

        // Generate encrypted data
        const encryptedData = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1d",
            }
        );

        // Generate qr code
        const dataImage = await QR.toDataURL(encryptedData);

        // Return qr code
        return res.status(200).json({ dataImage });
    } catch (err) {
        console.log(err);
    }
};

module.exports = generate;
