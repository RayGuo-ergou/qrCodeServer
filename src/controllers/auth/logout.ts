import { Request, Response } from 'express';

const logout = (req: Request, res: Response) => {
    res.status(200)
        .clearCookie('token', {
            sameSite: 'none',
            secure: true,
        })
        .json({ message: 'Logout successful' });
};

export default logout;
