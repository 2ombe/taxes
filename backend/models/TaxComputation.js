const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  legalBasis: String
});

const TaxComputationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fiscalYear: { type: Number, required: true },
  accountingProfit: { type: Number, default: 0 },
  taxableIncome: { type: Number, default: 0 },
  citPayable: { type: Number, default: 0 },
  status: { type: String, enum: ['DRAFT', 'REVIEWED', 'FINAL'], default: 'DRAFT' },
  auditTrail: [AuditTrailSchema]
}, { timestamps: true });

module.exports = mongoose.model('TaxComputation', TaxComputationSchema);
