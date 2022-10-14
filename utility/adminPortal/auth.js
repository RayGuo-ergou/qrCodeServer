const bcrypt = require('bcryptjs');
const User = require('../../model/user');

const authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (
        user &&
        user.role === 0 &&
        (await bcrypt.compare(password, user.password))
    ) {
        return Promise.resolve(user);
    }
    return null;
};

module.exports = authenticate;
