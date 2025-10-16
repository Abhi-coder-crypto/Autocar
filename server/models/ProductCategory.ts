import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ProductCategory = mongoose.models.ProductCategory || mongoose.model('ProductCategory', productCategorySchema);
