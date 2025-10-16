import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: String,
  mobileNumber: { type: String, required: true },
  alternativeNumber: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  gstNumber: String,
  panNumber: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  paymentTerms: String,
  creditLimit: Number,
  outstandingBalance: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 5 },
  notes: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
