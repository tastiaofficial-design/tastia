import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TASTIA-${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const orderData = await request.json();

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    if (!orderData.customerInfo) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = new Order({
      orderNumber,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      tips: orderData.tips || 0,
      discountAmount: orderData.discountAmount || 0,
      customerInfo: orderData.customerInfo,
      status: 'pending',
      orderDate: new Date(),
      source: 'website_whatsapp',
      notes: orderData.notes || '',
    });

    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    const query: any = {};
    
    // Date filtering
    if (fromDate || toDate) {
      query.orderDate = {};
      if (fromDate) {
        query.orderDate.$gte = new Date(fromDate);
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include the entire end date
        query.orderDate.$lte = to;
      }
    }

    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 500;

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(limit)
      .lean();

    // Convert ObjectIds to strings
    const ordersWithStringIds = orders.map((order: any) => ({
      ...order,
      _id: String(order._id || ''),
    }));

    return NextResponse.json({
      success: true,
      data: ordersWithStringIds,
      count: ordersWithStringIds.length
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

