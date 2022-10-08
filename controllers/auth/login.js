const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.query;

        // error message
        let error = new Error();
        error.status = 400;

        // Validate user input
        if (!(email && password)) {
            error.message = 'All input is required';
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
                    expiresIn: '2h',
                }
            );

            // user
            return res.status(200).json({ token });
        }
        error.message = 'Invalid credentials';
        return next(error);
    } catch (err) {
        return next(err);
    }
    // Our login logic ends here
};

// export default login;
module.exports = login;
