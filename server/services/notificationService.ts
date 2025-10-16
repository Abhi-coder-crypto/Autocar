import { Notification } from '../models/Notification';

// SMS notification abstraction - can be wired to Twilio when credentials are available
interface SMSConfig {
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
}

interface NotificationChannel {
  sendSMS(to: string, message: string): Promise<boolean>;
  sendEmail(to: string, subject: string, message: string): Promise<boolean>;
}

class NotificationService implements NotificationChannel {
  private smsConfig: SMSConfig;
  
  constructor() {
    this.smsConfig = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
    };
  }
  
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Check if Twilio credentials are available
      if (this.smsConfig.accountSid && this.smsConfig.authToken && this.smsConfig.fromNumber) {
        try {
          // Actual Twilio implementation
          const twilio = require('twilio');
          const client = twilio(this.smsConfig.accountSid, this.smsConfig.authToken);
          
          const twilioMessage = await client.messages.create({
            body: message,
            from: this.smsConfig.fromNumber,
            to: to,
          });
          
          console.log(`✅ SMS sent successfully to ${to}. SID: ${twilioMessage.sid}`);
          
          // Store successful send in notification log
          await Notification.create({
            type: 'sms',
            recipient: to,
            message,
            status: 'sent',
            sentAt: new Date(),
          });
          
          return true;
        } catch (twilioError: any) {
          console.error('Twilio SMS send failed:', twilioError.message);
          
          // Store Twilio-specific failure
          await Notification.create({
            type: 'sms',
            recipient: to,
            message,
            status: 'failed',
            error: `Twilio error: ${twilioError.message}`,
            sentAt: new Date(),
          });
          
          return false;
        }
      } else {
        console.log(`📱 SMS notification (credentials not configured): ${to} - ${message}`);
        console.log('⚠️  Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER environment variables to enable SMS');
        
        // Store in notification log even without sending
        await Notification.create({
          type: 'sms',
          recipient: to,
          message,
          status: 'failed',
          error: 'Twilio credentials not configured',
          sentAt: new Date(),
        });
        
        return false;
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      
      await Notification.create({
        type: 'sms',
        recipient: to,
        message,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date(),
      });
      
      return false;
    }
  }
  
  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      console.log(`📧 Email would be sent to ${to}: ${subject} - ${message}`);
      
      await Notification.create({
        type: 'email',
        recipient: to,
        subject,
        message,
        status: 'pending',
        sentAt: new Date(),
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
  
  // In-app notification
  async sendInAppNotification(userId: string, title: string, message: string, type: string = 'info'): Promise<boolean> {
    try {
      await Notification.create({
        type: 'in_app',
        userId,
        title,
        message,
        notificationType: type,
        status: 'delivered',
        sentAt: new Date(),
      });
      
      return true;
    } catch (error) {
      console.error('Failed to create in-app notification:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();

// Low stock alert function
export async function sendLowStockAlert(
  productName: string,
  sku: string,
  currentStock: number,
  reorderLevel: number,
  adminContacts: { name: string; mobile: string }[]
): Promise<void> {
  const message = `⚠️ LOW STOCK ALERT: ${productName} (SKU: ${sku}) is running low. Current stock: ${currentStock}, Reorder level: ${reorderLevel}. Please restock immediately.`;
  
  console.log('🔔 LOW STOCK ALERT:', message);
  
  // Send SMS to all admin and inventory manager contacts
  for (const contact of adminContacts) {
    await notificationService.sendSMS(contact.mobile, message);
  }
  
  // Also create in-app notifications
  // This would need to fetch admin/inventory manager user IDs
  // await notificationService.sendInAppNotification(userId, 'Low Stock Alert', message, 'warning');
}
