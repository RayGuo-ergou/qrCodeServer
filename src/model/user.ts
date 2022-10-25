import mongoose, { Document } from 'mongoose';
import HttpError from '../classes/httpError';

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: number;
}
const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    // 0 = admin, 1 = user
    role: { type: Number, default: 1 },
});

// pre check role in range 0 to 1
userSchema.pre('save', function (next) {
    if (this.role < 0 || this.role > 1) {
        // set to 1
        this.role = 1;
    }

    // validate email
    // disable eslint for this line
    const emailregex =
        // eslint-disable-next-line no-useless-escape
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!emailregex.test(this.email || '')) {
        const error = new HttpError('Invalid email', 400);
        return next(error);
    }
    next();
});

export default mongoose.model<IUser>('user', userSchema);
