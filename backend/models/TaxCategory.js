const mongoose = require('mongoose');

const TaxCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Fines and Penalties"
  articleReference: { type: String, required: true }, // e.g., "Article 25"
  isDeductible: { type: Boolean, required: true, default: false },
  adjustmentType: { type: String, required: true, enum: ['ADD_BACK', 'DEDUCTION', 'NONE'] }
}, { timestamps: true });

module.exports = mongoose.model('TaxCategory', TaxCategorySchema);
