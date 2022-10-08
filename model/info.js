const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    Number: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('info', infoSchema);
