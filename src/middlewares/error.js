const chalk = require('chalk');

// define chalk colors
const chalkTheme = {
    error: chalk.underline.red.bold,
    errorTitle: chalk.black.bgRedBright,
};

// keep the next parameter
// it works differently without it
// ignore eslint error
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, next) => {
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

module.exports = errorMiddleware;
