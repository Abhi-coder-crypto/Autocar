import mongoose from 'mongoose';

const inventoryProductSchema = new mongoose.Schema({
  // Hierarchical structure references
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  brandName: { type: String, required: true },
  
  modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleModel', required: true },
  modelName: { type: String, required: true },
  
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  variantName: String,
  
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  categoryName: { type: String, required: true },
  
  rangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductRange' },
  rangeName: String,
  
  // Product details
  productName: { type: String, required: true },
  color: String,
  finish: String,
  sku: { type: String, unique: true },
  barcode: String,
  
  // Stock management
  stockQty: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true, default: 5 },
  minStockLevel: { type: Number, default: 5 },
  maxStockLevel: Number,
  unit: { type: String, default: 'piece' },
  
  // Pricing
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  mrp: Number,
  gstRate: { type: Number, default: 18 },
  
  // Vendor details
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  vendorPartNumber: String,
  
  // Status and tracking
  status: { 
    type: String, 
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock'
  },
  
  lastRestockDate: Date,
  lastSaleDate: Date,
  
  // Storage details
  warehouseLocation: String,
  rackNumber: String,
  binNumber: String,
  
  // Additional info
  description: String,
  specifications: String,
  warranty: String,
  images: [String],
  notes: String,
  
  // Alert flags
  lowStockAlertSent: { type: Boolean, default: false },
  lastAlertDate: Date,
  
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-update status based on stock level
inventoryProductSchema.pre('save', function(next) {
  if (this.stockQty === 0) {
    this.status = 'out_of_stock';
  } else if (this.stockQty <= this.reorderLevel) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

// Indexes for efficient querying
inventoryProductSchema.index({ brandId: 1, modelId: 1, variantId: 1, categoryId: 1 });
inventoryProductSchema.index({ status: 1 });
inventoryProductSchema.index({ stockQty: 1 });
inventoryProductSchema.index({ vendorId: 1 });
inventoryProductSchema.index({ sku: 1 });

export const InventoryProduct = mongoose.models.InventoryProduct || mongoose.model('InventoryProduct', inventoryProductSchema);
