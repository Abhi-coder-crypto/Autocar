import mongoose from 'mongoose';

const vehicleModelSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  brandName: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

vehicleModelSchema.index({ brandId: 1, name: 1 }, { unique: true });

export const VehicleModel = mongoose.models.VehicleModel || mongoose.model('VehicleModel', vehicleModelSchema);
