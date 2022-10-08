const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const adminKey = process.env.ADMIN_KEY;
const register = async (req, res, next) => {
    // not allow to register for everyone to register
    let key = req.body.key;
    if (key !== adminKey || !key) {
        return res.status(400).send('Invalid key');
    }

    // error message
    let error = new Error();
    error.status = 400;

    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            error.message = 'All input is required';
            return next(error);
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            error.status = 409;
            error.message = 'User Already Exist. Please Login';
            return next(error);
        }

        // Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h',
            }
        );

        // return new user
        res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
};

// export default login;
module.exports = register;
