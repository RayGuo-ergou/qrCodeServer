import crypto from 'crypto';
/**
 * Returns encrypted text
 *
 * @param {*} data The data include nonce and text
 * @param {*} key The key is 256 bits (32 bytes)
 * @returns {string} return the encrypted string
 */
const encrypt = (data: { nonce: string; text: string }, key: string) => {
    const encrypt = crypto.createCipheriv(
        'chacha20-poly1305',
        key,
        data.nonce,
        {
            authTagLength: 16,
        }
    );
    const encrypted = encrypt.update(data.text, 'utf8', 'hex');

    return encrypted;
};

export default encrypt;
