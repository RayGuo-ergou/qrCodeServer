const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, require: true },
    password: { type: String },
    // 0 = admin, 1 = user
    role: { type: Number },
});

// pre check role in range 0 to 1
userSchema.pre('save', function (next) {
    if (this.role < 0 || this.role > 1) {
        // set to 1
        this.role = 1;
    }

    // validate email
    // disable eslint for this line
    let emailregex =
        // eslint-disable-next-line no-useless-escape
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!emailregex.test(this.email)) {
        let error = new Error('Invalid email');
        error.status = 400;
        return next(error);
    }
    next();
});

module.exports = mongoose.model('user', userSchema);
