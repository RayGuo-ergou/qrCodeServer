const mongoose = require('mongoose');
const { Schema } = mongoose;

const qrCodeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    connectedDeviceId: {
        type: Schema.Types.ObjectId,
        ref: 'connectedDevices',
    },
    lastUsedDate: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    nonce: { type: String, default: null },
    token: { type: String, default: null },
});

module.exports = mongoose.model('qrCode', qrCodeSchema);
