import User from '../../model/user';
import QRCode from '../../model/qrCode';
import utility from '../../utility';
import HttpError from '../../classes/httpError';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
const authCheck = utility.authCheck;

const getQrCode = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const authError = authCheck(req);
    if (authError) {
        return next(authError);
    }

    const input = req.query;

    const { email } = input;

    // if no email
    if (!email) {
        const error = new HttpError('Email is required', 400);
        return next(error);
    }

    // find user via email
    const user = await User.findOne({ email: email });

    // if no user, return error
    if (!user) {
        const error = new HttpError('User does not exist', 404);
        return next(error);
    }

    // remove email from input
    delete input.email;

    // find all qr code via input and user id
    const qrCode = await QRCode.find({
        ...input,
        userId: user._id as Types.ObjectId,
    });

    res.json({
        qrCode,
        username: user.first_name + ' ' + user.last_name,
    });
};

export default getQrCode;
