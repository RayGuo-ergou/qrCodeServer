const utility = require('../../utility');
const authCheck = utility.authCheck;

const getUser = async (req, res, next) => {
    // TODO: this can be done as a middleware
    // e.g. app.post('/protectedroute', checkToken, routename.functionname)
    // check in future if have time
    const auth = authCheck(req);
    if (auth) {
        return next(auth);
    }
    return res.status(302).json({ message: 'User found' });
};

module.exports = getUser;
