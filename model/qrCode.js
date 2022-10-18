const mongoose = require('mongoose');
const { Schema } = mongoose;

const qrCodeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },

    // image: qrcode image in base64
    image: { type: String, required: true },

    number: { type: Number, default: 0 },

    // 0 = free, 1 = cut-in, 2 = free&cut-in
    type: { type: Number, default: 0 },

    // when this qr code is used
    lastUsedDate: { type: Date, default: null },

    // is this qr code active
    isActive: { type: Boolean, default: true },

    nonce: { type: String, default: null },
    token: { type: String, default: null },

    // when is this qr code created
    createdDate: { type: Date, default: Date.now },
});

// pre check type in range 0 to 2
qrCodeSchema.pre('save', function (next) {
    if (this.type < 0 || this.type > 3) {
        // set to 0
        this.type = 0;
    }
    next();
});

module.exports = mongoose.model('qrCode', qrCodeSchema);
