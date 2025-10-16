import { InventoryProduct } from '../models/InventoryProduct';
import { StockMovement } from '../models/StockMovement';
import { User } from '../models/User';
import { sendLowStockAlert } from './notificationService';

interface StockDeductionInput {
  productId: string;
  quantity: number;
  referenceType: 'order' | 'service_visit';
  referenceId: string;
  referenceNumber: string;
  customerId?: string;
  customerName?: string;
  unitPrice: number;
  performedBy: string;
  notes?: string;
}

interface StockAdditionInput {
  productId: string;
  quantity: number;
  type: 'purchase' | 'return' | 'adjustment' | 'restock';
  vendorId?: string;
  vendorName?: string;
  unitPrice: number;
  performedBy: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  notes?: string;
}

export class StockService {
  // Deduct stock when product is used in sales/service
  static async deductStock(input: StockDeductionInput): Promise<{ success: boolean; message: string; product?: any }> {
    try {
      const product = await InventoryProduct.findById(input.productId);
      
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
      
      if (product.stockQty < input.quantity) {
        return { 
          success: false, 
          message: `Insufficient stock. Available: ${product.stockQty}, Required: ${input.quantity}` 
        };
      }
      
      const user = await User.findById(input.performedBy);
      const quantityBefore = product.stockQty;
      const quantityAfter = quantityBefore - input.quantity;
      
      // Update product stock
      product.stockQty = quantityAfter;
      product.lastSaleDate = new Date();
      await product.save();
      
      // Record stock movement
      await StockMovement.create({
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        type: 'sale',
        quantityBefore,
        quantityChange: -input.quantity,
        quantityAfter,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        referenceNumber: input.referenceNumber,
        customerId: input.customerId,
        customerName: input.customerName,
        unitPrice: input.unitPrice,
        totalAmount: input.unitPrice * input.quantity,
        performedBy: input.performedBy,
        performedByName: user?.name,
        performedByRole: user?.role,
        notes: input.notes,
        transactionDate: new Date(),
      });
      
      // Check if stock is at or below reorder level
      if (quantityAfter <= product.reorderLevel && !product.lowStockAlertSent) {
        await this.triggerLowStockAlert(product);
      }
      
      return { 
        success: true, 
        message: 'Stock deducted successfully', 
        product: {
          ...product.toObject(),
          stockBefore: quantityBefore,
          stockAfter: quantityAfter,
        }
      };
    } catch (error) {
      console.error('Stock deduction error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Stock deduction failed' 
      };
    }
  }
  
  // Add stock (purchase, return, restock)
  static async addStock(input: StockAdditionInput): Promise<{ success: boolean; message: string; product?: any }> {
    try {
      const product = await InventoryProduct.findById(input.productId);
      
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
      
      const user = await User.findById(input.performedBy);
      const quantityBefore = product.stockQty;
      const quantityAfter = quantityBefore + input.quantity;
      
      // Update product stock
      product.stockQty = quantityAfter;
      product.lastRestockDate = new Date();
      
      // Reset low stock alert flag if stock is back above reorder level
      if (quantityAfter > product.reorderLevel) {
        product.lowStockAlertSent = false;
      }
      
      await product.save();
      
      // Record stock movement
      await StockMovement.create({
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        type: input.type,
        quantityBefore,
        quantityChange: input.quantity,
        quantityAfter,
        referenceType: 'purchase_order',
        vendorId: input.vendorId,
        vendorName: input.vendorName,
        unitPrice: input.unitPrice,
        totalAmount: input.unitPrice * input.quantity,
        performedBy: input.performedBy,
        performedByName: user?.name,
        performedByRole: user?.role,
        invoiceNumber: input.invoiceNumber,
        invoiceDate: input.invoiceDate,
        notes: input.notes,
        transactionDate: new Date(),
      });
      
      return { 
        success: true, 
        message: 'Stock added successfully', 
        product: {
          ...product.toObject(),
          stockBefore: quantityBefore,
          stockAfter: quantityAfter,
        }
      };
    } catch (error) {
      console.error('Stock addition error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Stock addition failed' 
      };
    }
  }
  
  // Trigger low stock alert
  static async triggerLowStockAlert(product: any): Promise<void> {
    try {
      // Get admin and inventory manager contacts
      const admins = await User.find({ 
        role: { $in: ['Admin', 'Inventory Manager'] },
        isActive: true,
        mobileNumber: { $exists: true, $ne: null }
      }).select('name mobileNumber email');
      
      const contacts = admins.map(admin => ({
        name: admin.name,
        mobile: admin.mobileNumber || '',
      })).filter(c => c.mobile);
      
      if (contacts.length > 0) {
        await sendLowStockAlert(
          product.productName,
          product.sku || 'N/A',
          product.stockQty,
          product.reorderLevel,
          contacts
        );
        
        // Mark alert as sent
        product.lowStockAlertSent = true;
        product.lastAlertDate = new Date();
        await product.save();
      }
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
    }
  }
  
  // Get stock movement summary for a date range
  static async getStockMovementSummary(startDate: Date, endDate: Date): Promise<any> {
    try {
      const movements = await StockMovement.aggregate([
        {
          $match: {
            transactionDate: {
              $gte: startDate,
              $lte: endDate,
            }
          }
        },
        {
          $group: {
            _id: {
              productId: '$productId',
              productName: '$productName',
              type: '$type',
            },
            totalQuantity: { $sum: '$quantityChange' },
            totalAmount: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          }
        },
        {
          $sort: { '_id.productName': 1, '_id.type': 1 }
        }
      ]);
      
      return movements;
    } catch (error) {
      console.error('Failed to get stock movement summary:', error);
      return [];
    }
  }
  
  // Get daily product movement summary
  static async getDailyMovementSummary(date: Date = new Date()): Promise<any> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.getStockMovementSummary(startOfDay, endOfDay);
  }
  
  // Get low stock products
  static async getLowStockProducts(): Promise<any[]> {
    try {
      const lowStockProducts = await InventoryProduct.find({
        $expr: { $lte: ['$stockQty', '$reorderLevel'] },
        isActive: true,
      })
      .populate('brandId', 'name')
      .populate('modelId', 'name')
      .populate('variantId', 'name')
      .populate('categoryId', 'name')
      .populate('vendorId', 'name mobileNumber')
      .sort({ stockQty: 1 });
      
      return lowStockProducts;
    } catch (error) {
      console.error('Failed to get low stock products:', error);
      return [];
    }
  }
}
