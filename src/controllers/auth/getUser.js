const jwt = require('jsonwebtoken');
const User = require('../../model/user');

const getUser = async (req, res, next) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const token = req.cookies.token;

    //check if user is logged in use jwt
    if (!token) {
        let error = new Error('You are not authorized to access this resource');
        error.status = 401;
        return next(error);
    } else {
        try {
            const user = await jwt.verify(token, process.env.TOKEN_KEY);

            try {
                // find user use user._id
                const userFound = await User.findById(user.user_id);
                // if user is not found

                return res
                    .status(202)
                    .json({ message: 'User found', role: userFound.role });
            } catch (error) {
                error.status = 404;
                return next(error);
            }
        } catch (err) {
            err.status = 406;
            return next(err);
        }
    }
};

module.exports = getUser;
