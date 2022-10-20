const crypto = require('crypto');

/**
 * Returns decrypted text
 *
 * @param {*} data The data include nonce and text
 * @param {*} key The key is 256 bits (32 bytes)
 * @returns {string} return the decrypted string
 */
const decrypt = (data, key) => {
    let decipher = crypto.createDecipheriv(
        'chacha20-poly1305',
        key,
        data.nonce,
        {
            authTagLength: 16,
        }
    );
    let decrypted = decipher.update(data.text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = decrypt;
