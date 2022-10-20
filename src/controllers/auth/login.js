const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.query;

        // Validate user input
        if (!(email && password)) {
            let error = new Error('All input is required');
            error.status = 400;
            return next(error);
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
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
        let error = new Error('Invalid credentials');
        error.status = 400;
        return next(error);
    } catch (err) {
        return next(err);
    }
    // Our login logic ends here
};

// export default login;
module.exports = login;
