const crypto = require('crypto');
const getRandom = (len) => {
    return crypto.randomBytes(len).toString('hex');
};

module.exports = getRandom;
