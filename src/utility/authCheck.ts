import jwt, {
    JsonWebTokenError,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import { Request } from 'express';
import HttpError from '../classes/httpError';

const authCheck = (req: Request) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = req.cookies.token as string;

    //check if user is logged in use jwt
    if (!token) {
        const error = new HttpError('Unauthorized', 401);

        return error;
    } else {
        try {
            jwt.verify(token, process.env.TOKEN_KEY as string);
        } catch (err) {
            if (
                err instanceof JsonWebTokenError ||
                err instanceof TokenExpiredError ||
                err instanceof NotBeforeError
            ) {
                const error = new HttpError(err.message, 401);

                return error;
            } else {
                const error = new HttpError('Authorize Error', 406);

                return error;
            }
        }
    }
};

export default authCheck;
