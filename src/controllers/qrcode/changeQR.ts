import User from '../../model/user';
import QRCode from '../../model/qrCode';
import utility from '../../utility';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../../classes/httpError';
import PatchQRBody from '../../types/patchQRBody';
import { Types } from 'mongoose';

const { authCheck } = utility;

const changeQR = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
    }

    const number = req.params.id;
    const { email } = req.body as PatchQRBody;

    // check email and change are not empty
    if (!email || !number) {
        const error = new HttpError('All input is required', 400);
        return next(error);
    }

    // we don't care what the change is, we just want to change isActive to false
    // find user via email
    const user = await User.findOne({ email: email });

    // if no user found, return error
    if (!user) {
        const error = new HttpError('User not found', 404);
        return next(error);
    }

    // find the qrcode with the user id and number
    const qrCode = await QRCode.findOne({
        userId: user._id as Types.ObjectId,
        number: number,
    });

    // if no qrcode found, return error
    if (!qrCode) {
        const error = new HttpError('QR Code not found', 404);
        return next(error);
    }

    // if qrcode is already inactive, return error
    if (!qrCode.isActive) {
        const error = new HttpError('QR Code already inactive', 400);
        return next(error);
    }

    // change isActive to false
    qrCode.isActive = false;

    // change lastUsedDate to now
    qrCode.lastUsedDate = new Date(Date.now());

    // save the qrcode
    await qrCode.save();

    // return success
    res.status(200).json({
        message: 'QR Code changed successfully',
        stateNow: qrCode.isActive,
        changeDate: qrCode.lastUsedDate,
    });
};

export default changeQR;
