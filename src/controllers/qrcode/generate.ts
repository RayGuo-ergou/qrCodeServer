import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import HttpError from '../../classes/httpError';
import User from '../../model/user';
import QRCode from '../../model/qrCode';
import utility from '../../utility';
import GenerateQRBody from '../../types/generateQRBody';

const { random, authCheck, qrCode } = utility;

import encrypt from '../../utility/cipher/encrypt';
const { qrCodeWithIcon } = qrCode;
import icon from '../../model/img/plusIcon.js';

const generate = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
    }

    try {
        const { email, type } = req.body as GenerateQRBody;

        // Validate user input
        // if email or type is null or undefined
        if (email == null || type == null) {
            const error = new HttpError('All input is required', 400);
            return next(error);
        }

        // find user via email
        const user = await User.findOne({ email: email });

        // Validate is user exist
        if (!user) {
            const error = new HttpError('User does not exist', 404);
            return next(error);
        }

        const largestQRCode = await QRCode.findOne({
            userId: user._id as Types.ObjectId,
        })
            .sort({ number: -1 })
            .limit(1);

        // set number to 1 if no qr code found
        const index = largestQRCode ? largestQRCode.number + 1 : 1;

        const nonce = random(6);

        const id = user._id as Types.ObjectId;
        // Generate encrypted data
        const encryptedData = encrypt(
            {
                nonce: nonce,
                text: JSON.stringify({
                    userId: id.toString(),
                    number: index,
                }),
            },
            process.env.CIPHER_KEY as string
        );

        const dataImage = await qrCodeWithIcon(encryptedData, icon, 220, 40);

        // create data to save to database
        const qrData = {
            userId: user._id as Types.ObjectId,
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

        // find the largest number of qrcode database
        // await QRCode.findOne({ userId: user._id as Types.ObjectId })
        //     .sort({
        //         number: -1,
        //     })
        //     .exec(async (err, doc) => {
        //         if (err) {
        //             return next(err);
        //         }
        //         if (doc) {
        //             index = doc.number + 1;
        //         }
        //         const nonce = random(6);
        //         // Generate encrypted data
        //         const encryptedData = await encrypt(
        //             {
        //                 nonce: nonce,
        //                 text: JSON.stringify({
        //                     userId: user._id,
        //                     number: index,
        //                 }),
        //             },
        //             process.env.CIPHER_KEY
        //         );

        //         const dataImage = await qrCodeWithIcon(
        //             encryptedData,
        //             icon,
        //             220,
        //             40
        //         );

        //         // create data to save to database
        //         const qrData = {
        //             userId: user._id,
        //             number: index,
        //             type: type,
        //             nonce: nonce,
        //             token: encryptedData,
        //             image: dataImage,
        //         };

        //         // save to database
        //         await QRCode.create(qrData);

        //         // Return qr code
        //         return res.status(200).json({
        //             dataImage,
        //             type,
        //             number: index,
        //             username: user.first_name + ' ' + user.last_name,
        //         });
        //     });
    } catch (err) {
        return next(err);
    }
};

export default generate;
