const mongoose = require('mongoose');

const TrialBalanceItemSchema = new mongoose.Schema({
  computationId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxComputation', required: true },
  accountName: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE', 'ASSET', 'LIABILITY', 'EQUITY'], required: true },
  
  // Tax Logic Application
  taxTreatment: { type: String, enum: ['DEDUCTIBLE', 'NON_DEDUCTIBLE', 'TAXABLE_INCOME', 'NON_TAXABLE_INCOME', 'N/A'], default: 'N/A' },
  articleReference: { type: String },
  hasSupportDocument: { type: Boolean, default: false },
  isBusinessRelated: { type: Boolean, default: false },
  
  // AI tracking
  aiSuggestedTreatment: { type: String },
  userVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TrialBalanceItem', TrialBalanceItemSchema);
