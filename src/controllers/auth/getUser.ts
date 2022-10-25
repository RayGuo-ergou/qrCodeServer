import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../../model/user';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../../classes/httpError';

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time

    // the cookie is defined as any in dependency so ignore the error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token: string = req.cookies.token;

    //check if user is logged in use jwt
    if (!token) {
        const error = new HttpError(
            'You are not authorized to access this resource',
            401
        );
        return next(error);
    } else {
        try {
            const user = jwt.verify(
                token,
                process.env.TOKEN_KEY || 'secret'
            ) as JwtPayload;

            try {
                // find user use user._id
                const userFound = await User.findById(user.user_id);
                // if user is not found

                return res
                    .status(202)
                    .json({ message: 'User found', role: userFound?.role });
            } catch (error) {
                const httpError = error as HttpError;
                httpError.status = 404;
                return next(error);
            }
        } catch (err) {
            const httpError = err as HttpError;
            httpError.status = 406;
            return next(err);
        }
    }
};

export default getUser;
