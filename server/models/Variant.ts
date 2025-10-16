import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleModel', required: true },
  modelName: { type: String, required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  brandName: { type: String, required: true },
  name: { type: String, required: true, enum: ['Base', 'Mid', 'Top', 'Custom', 'Standard'] },
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

variantSchema.index({ modelId: 1, name: 1 }, { unique: true });

export const Variant = mongoose.models.Variant || mongoose.model('Variant', variantSchema);
