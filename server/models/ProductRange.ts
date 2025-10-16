import mongoose from 'mongoose';

const productRangeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ProductRange = mongoose.models.ProductRange || mongoose.model('ProductRange', productRangeSchema);
