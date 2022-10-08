const mongoose = require("mongoose");
const { Schema } = mongoose;

const qrCodeSchema = new mongoose.Schema({
    infoId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "infos",
    },
    lastUsedDate: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("qrCode", qrCodeSchema);
