// export all the controllers in this folder
// module.exports = {
//     generate: require('./generate'),
//     verify: require('./verify'),
//     getQRcodeById: require('./getQRcodeById'),
//     getQR: require('./getQR'),
//     changeQR: require('./changeQR'),
// };

import generate from './generate';
import verify from './verify';
import getQRcodeById from './getQRcodeById';
import getQR from './getQR';
import changeQR from './changeQR';

export default {
    generate,
    verify,
    getQRcodeById,
    getQR,
    changeQR,
};
