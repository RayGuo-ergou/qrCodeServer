import User from '../../model/user';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../../classes/httpError';
import { RegisterBody } from '../../types/registerBody';

const adminKey = process.env.ADMIN_KEY;
const register = async (req: Request, res: Response, next: NextFunction) => {
    // not allow to register for everyone to register
    const { key } = req.body as RegisterBody;

    if (key !== adminKey || !key) {
        const error = new HttpError(
            'You are not authorized to access this resource',
            401
        );

        return next(error);
    }

    try {
        // Get user input
        const { first_name, last_name, email, password } =
            req.body as RegisterBody;

        let { role } = req.body as RegisterBody;

        // if req.body.role exist role = req.body.role else role = 1
        role = typeof role !== 'undefined' ? role : 1;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            const error = new HttpError('All input is required', 400);
            return next(error);
        }

        // check email format
        //email regex
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            const error = new HttpError('Invalid email format', 400);
            return next(error);
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            const error = new HttpError(
                'User Already Exist. Please Login',
                409
            );
            return next(error);
        }

        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            role,
        });

        // return new user
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
        });
    } catch (err) {
        return next(err);
    }
};

export default register;
