import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProduct', required: true },
  productName: String,
  sku: String,
  
  // Movement details
  type: { 
    type: String, 
    required: true,
    enum: ['purchase', 'sale', 'return', 'adjustment', 'damage', 'transfer', 'restock']
  },
  
  // Quantity changes
  quantityBefore: { type: Number, required: true },
  quantityChange: { type: Number, required: true },
  quantityAfter: { type: Number, required: true },
  
  // Reference details
  referenceType: { 
    type: String, 
    enum: ['order', 'service_visit', 'purchase_order', 'return', 'manual', 'stock_adjustment']
  },
  referenceId: mongoose.Schema.Types.ObjectId,
  referenceNumber: String,
  
  // Transaction details
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationCustomer' },
  customerName: String,
  
  // Financial
  unitPrice: Number,
  totalAmount: Number,
  
  // User tracking
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performedByName: String,
  performedByRole: String,
  
  // Additional info
  notes: String,
  invoiceNumber: String,
  invoiceDate: Date,
  
  transactionDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Indexes
stockMovementSchema.index({ productId: 1, transactionDate: -1 });
stockMovementSchema.index({ type: 1, transactionDate: -1 });
stockMovementSchema.index({ referenceId: 1, referenceType: 1 });
stockMovementSchema.index({ transactionDate: -1 });

export const StockMovement = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);
