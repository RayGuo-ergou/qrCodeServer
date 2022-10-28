import User from '../../model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../../classes/httpError';
import { IUser } from '../../model/user';

const login = async (req: Request, res: Response, next: NextFunction) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.query;

        // Validate user input
        if (!(email && password)) {
            const error = new HttpError('All input is required', 400);
            return next(error);
        }

        // Validate if user exist in our database
        const user: IUser | null = await User.findOne({ email });

        if (user && (await bcrypt.compare(password as string, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id as string, email },
                process.env.TOKEN_KEY as jwt.Secret,
                {
                    expiresIn: '10h',
                }
            );

            return res
                .status(200)
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    // time 10h
                    maxAge: 10 * 60 * 60 * 1000,
                })
                .json({
                    username: user.first_name + ' ' + user.last_name,
                    email: user.email,
                });
        }
        const error = new HttpError('Invalid credentials', 400);

        return next(error);
    } catch (err) {
        return next(err);
    }
    // Our login logic ends here
};

export default login;
