const crypto = require('crypto');

/**
 * Returns encrypted text
 *
 * @param {*} data The data include nonce and text
 * @param {*} key The key is 256 bits (32 bytes)
 * @returns {string} return the encrypted string
 */
const encrypt = (data, key) => {
    let encrypt = crypto.createCipheriv('chacha20-poly1305', key, data.nonce, {
        authTagLength: 16,
    });
    let encrypted = encrypt.update(data.text, 'utf8', 'hex');
    encrypted += encrypt.final('hex');

    return encrypted;
};

module.exports = encrypt;
