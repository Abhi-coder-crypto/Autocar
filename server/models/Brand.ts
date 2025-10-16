import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logo: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
