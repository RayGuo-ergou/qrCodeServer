import { Request, Response, NextFunction } from 'express';
import HttpError from '../classes/httpError';
import chalk from 'chalk';

// define chalk colors
const chalkTheme = {
    error: chalk.underline.red.bold,
    errorTitle: chalk.black.bgRedBright,
};

// keep the next parameter
// it works differently without it
// ignore eslint error
const errorMiddleware = (
    error: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    console.log(chalkTheme.error('Error Handling Middleware called'));
    console.log(chalkTheme.errorTitle('Path: '), chalkTheme.error(req.path));
    console.log(
        chalkTheme.errorTitle('Error: '),
        chalkTheme.error(error.message)
    );
    console.log(error.stack);

    res.status(error.status || 500).json({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
};

export default errorMiddleware;
