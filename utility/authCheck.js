const jwt = require('jsonwebtoken');

const authCheck = (req) => {
    const token = req.cookies.token;

    //check if user is logged in use jwt
    if (!token) {
        let error = new Error('You are not authorized to access this resource');
        error.status = 401;
        return error;
    } else {
        try {
            jwt.verify(token, process.env.TOKEN_KEY);
        } catch (err) {
            err.status = 400;
            return err;
        }
    }
};

module.exports = authCheck;
