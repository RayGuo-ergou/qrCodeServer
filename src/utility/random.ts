import crypto from 'crypto';
const getRandom = (len: number) => {
    return crypto.randomBytes(len).toString('hex');
};

export default getRandom;
