import QRCode from '../../model/qrCode';
import User from '../../model/user';
import utility from '../../utility';
import { Request, Response, NextFunction } from 'express';
import VerifyQRBody from '../../types/verifyQRBody';
import HttpError from '../../classes/httpError';

import decrypt from '../../utility/cipher/decrypt';
const authCheck = utility.authCheck;

const verify = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const authError = authCheck(req);
    if (authError) {
        return next(authError);
    }

    try {
        const { token } = req.body as VerifyQRBody;

        if (!token) {
            const error = new HttpError('Token is required', 400);
            return next(error);
        }

        const qrData = await QRCode.findOne({ token: token });

        if (!qrData) {
            const error = new HttpError('QR Code not found', 404);
            return next(error);
        }

        // TODO: probably can make decrypt return a promise and use then
        try {
            const decryptedData: string = decrypt(
                { token: token, nonce: qrData.nonce },
                process.env.CIPHER_KEY as string
            );
            const decryptedJson: { userId: string; number: number } =
                JSON.parse(decryptedData) as { userId: string; number: number };

            const qrCode = await QRCode.findOne({
                userId: decryptedJson.userId,
                number: decryptedJson.number,
            });

            if (!qrCode) {
                const error = new HttpError('QR Code not found', 404);
                return next(error);
            }

            // Find user
            const user = await User.findById(decryptedJson.userId);

            if (!user) {
                const error = new HttpError('User not found', 404);
                return next(error);
            }

            return res.status(200).json({
                message: 'QR code verified',
                user: user.email,
                username: user.first_name + ' ' + user.last_name,
                number: qrCode.number,
                type: qrCode.type,
                isActive: qrCode.isActive,
                email: user.email,
            });
        } catch (err) {
            return next(err);
        }
    } catch (err) {
        return next(err);
    }
};

export default verify;
