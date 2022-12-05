import { compare } from 'bcryptjs';
import User from '../../model/user';

const authenticate = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (user && user.role === 0 && (await compare(password, user.password))) {
        return Promise.resolve(user);
    }
    return null;
};

export default authenticate;
