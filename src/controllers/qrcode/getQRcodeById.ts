import User from '../../model/user';
import QRCode from '../../model/qrCode';
import utility from '../../utility';
import HttpError from '../../classes/httpError';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
const authCheck = utility.authCheck;

const getQrcodeById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const authError = authCheck(req);
    if (authError) {
        return next(authError);
    }

    const number = req.params.id;
    const email = req.query.email;

    if (!number || !email) {
        const error = new HttpError('Number and email are required', 400);
        return next(error);
    }

    // find user via email
    const user = await User.findOne({ email: email });

    // Validate is user exist
    if (!user) {
        const error = new HttpError('User does not exist', 404);
        return next(error);
    }

    // find qr code via number and user id
    const qrCode = await QRCode.findOne({
        number: number,
        userId: user._id as Types.ObjectId,
    });

    // Validate is qr code exist
    if (!qrCode) {
        const error = new HttpError('QR code does not exist', 404);
        return next(error);
    }

    res.json({
        qrCode,
        username: user.first_name + ' ' + user.last_name,
    });
};

export default getQrcodeById;
