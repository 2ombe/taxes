const mongoose = require('mongoose');

const TaxDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountingProfit: { type: Number, required: true },
    trialBalance: [{
        id: String,
        accountName: String,
        amount: Number,
        category: String
    }],
    assets: [{
        id: String,
        name: String,
        categoryId: String,
        cost: Number,
        accountingDepreciation: Number
    }],
    historicalLosses: [{
        id: String,
        year: Number,
        amount: Number,
        remainingAmount: Number
    }],
    updatedAt: { type: Date, default: Date.now }
}, { bufferCommands: false });

module.exports = mongoose.model('TaxData', TaxDataSchema);
