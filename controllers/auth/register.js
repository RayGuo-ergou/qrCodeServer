const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const adminKey = process.env.ADMIN_KEY;
const register = async (req, res, next) => {
    // not allow to register for everyone to register
    let key = req.body.key;
    if (key !== adminKey || !key) {
        let error = new Error('You are not authorized to access this resource');
        error.status = 401;
        return next(error);
    }

    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // if req.body.role exist role = req.body.role else role = 1
        let role = typeof req.body.role !== 'undefined' ? req.body.role : 1;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            let error = new Error('All input is required');
            error.status = 400;
            return next(error);
        }

        // check email format
        //email regex
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            let error = new Error('Invalid email format');
            error.status = 400;
            return next(error);
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            let error = new Error('User Already Exist. Please Login');
            error.status = 409;
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
            role,
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
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
        });
    } catch (err) {
        return next(err);
    }
};

// export default login;
module.exports = register;
