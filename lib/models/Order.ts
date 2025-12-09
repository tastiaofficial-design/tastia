import mongoose, { Schema, Model } from 'mongoose';

export interface IOrderItem {
  menuItemId: string;
  menuItemName: string;
  menuItemNameEn?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ICustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
  tableNumber?: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  tips?: number;
  discountAmount?: number;
  customerInfo: ICustomerInfo;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  source: 'website_whatsapp' | 'manual';
  notes?: string;
  whatsappMessageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: String,
    required: true,
  },
  menuItemName: {
    type: String,
    required: true,
  },
  menuItemNameEn: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const CustomerInfoSchema = new Schema<ICustomerInfo>({
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  tableNumber: {
    type: String,
    trim: true,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    tips: {
      type: Number,
      min: 0,
      default: 0,
    },
    discountAmount: {
      type: Number,
      min: 0,
    },
    customerInfo: {
      type: CustomerInfoSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderDate: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    source: {
      type: String,
      enum: ['website_whatsapp', 'manual'],
      default: 'website_whatsapp',
    },
    notes: {
      type: String,
      trim: true,
    },
    whatsappMessageId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ 'customerInfo.phone': 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

