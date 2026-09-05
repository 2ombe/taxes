const mongoose = require('mongoose');

const AssetCategorySchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true }, // e.g., "cat4"
  name: { type: String, required: true }, // e.g., "Computers & Software"
  taxDepreciationRate: { type: Number, required: true }, // e.g., 0.50
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AssetCategory', AssetCategorySchema);
