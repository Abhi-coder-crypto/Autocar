import mongoose from 'mongoose';
import { getNextSequence } from './Counter.js';

const registrationVehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, unique: true, sparse: true },
  customerId: { type: String, required: true, index: true },
  vehicleNumber: { type: String, required: false },
  vehicleBrand: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  variant: { 
    type: String, 
    enum: ['Top', 'Base', 'Mid', 'Custom', 'Standard'], 
    default: 'Standard' 
  },
  color: { type: String, default: null },
  customModel: { type: String, default: null },
  yearOfPurchase: { type: Number, default: null },
  vehiclePhoto: { type: String, required: true },
  isNewVehicle: { type: Boolean, default: false },
  chassisNumber: { type: String, default: null },
  vinNumber: { type: String, default: null },
  selectedParts: { type: [String], default: [] },
  lastServiceDate: { type: Date, default: null },
  serviceHistory: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceVisit' },
    serviceDate: { type: Date },
    description: { type: String }
  }],
  warrantyRecords: [{
    productName: { type: String },
    warrantyStartDate: { type: Date },
    warrantyEndDate: { type: Date },
    warrantyStatus: { type: String, enum: ['Active', 'Expired', 'Claimed'], default: 'Active' }
  }],
}, { timestamps: true });

registrationVehicleSchema.pre('save', async function(next) {
  if (!this.vehicleId && this.isNew) {
    const sequence = await getNextSequence('vehicle');
    this.vehicleId = `VEH${String(sequence).padStart(3, '0')}`;
  }
  next();
});

export const RegistrationVehicle = mongoose.models.RegistrationVehicle || mongoose.model('RegistrationVehicle', registrationVehicleSchema);
