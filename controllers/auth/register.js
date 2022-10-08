const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminKey = process.env.ADMIN_KEY;
const register = async (req, res) => {
    // not allow to register for everyone to register
    let key = req.body.key;
    if (key !== adminKey || !key) {
        return res.status(400).send("Invalid key");
    }
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

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
                expiresIn: "2h",
            }
        );

        // return new user
        res.status(201).json({ token });
    } catch (err) {
        console.log(err);
    }
};

// export default login;
module.exports = register;
