import crypto from 'crypto';

/**
 * Returns decrypted text
 *
 * @param {*} data The data include nonce and text
 * @param {*} key The key is 256 bits (32 bytes)
 * @returns {string} return the decrypted string
 */
const decrypt = (data: { token: string; nonce: string }, key: string) => {
    const decipher = crypto.createDecipheriv(
        'chacha20-poly1305',
        key,
        data.nonce,
        {
            authTagLength: 16,
        }
    );
    const decrypted = decipher.update(data.token, 'hex', 'utf8');
    return decrypted;
};

export default decrypt;
