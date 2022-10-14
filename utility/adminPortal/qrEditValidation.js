const { ValidationError } = require('adminjs');
const qrcode = require('../../model/qrCode');

const qrEditValidation = async (request, response) => {
    // get the request body
    const { payload } = request;

    // find qrcode by user id and number
    const currentQrCode = await qrcode.findOne({
        userId: payload.userId,
        number: payload.number,
    });

    // get current number and convert to number
    const currentNumber = Number(response.record.params.number);
    const newNumber = Number(payload.number);

    // if current qrcode does exist
    // return error
    if (currentQrCode && currentNumber !== newNumber) {
        throw new ValidationError(
            {
                number: {
                    message: 'This QR code already exist.',
                },
            },
            {
                message: 'This QR code already exist.',
            }
        );
    }

    // if payload.type less than 0 or greater than 2
    // throw error
    if (payload.type < 0 || payload.type > 2) {
        throw new ValidationError(
            {
                type: {
                    message: 'QR Code Type must be 0, 1, or 2',
                },
            },
            {
                message: 'QR Code Type must be 0, 1, or 2',
            }
        );
    }

    // only the isActive changed, update the lastUsedDate
    if (payload.isActive !== response.record.params.isActive) {
        payload.lastUsedDate = new Date();
    }

    return request;
};

module.exports = qrEditValidation;
