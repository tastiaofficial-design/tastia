interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  menuItemNameEn?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
  tableNumber?: string;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  tips?: number;
  discountAmount?: number;
  customerInfo: CustomerInfo;
  notes?: string;
}

export function generateWhatsAppMessage(orderData: OrderData): string {
  const formatPrice = (price: number) => `${price.toFixed(2)} ر.س`;
  
  // Format items list
  const itemsText = orderData.items.map(item => {
    let itemText = `• ${item.menuItemName}`;
    if (item.menuItemNameEn) {
      itemText += ` (${item.menuItemNameEn})`;
    }
    itemText += ` × ${item.quantity} = ${formatPrice(item.totalPrice)}`;
    return itemText;
  }).join('\n');

  // Format customer info
  const customerInfoText = [
    orderData.customerInfo.name && `الاسم: ${orderData.customerInfo.name}`,
    orderData.customerInfo.phone && `الهاتف: ${orderData.customerInfo.phone}`,
    orderData.customerInfo.tableNumber && `رقم الطاولة: ${orderData.customerInfo.tableNumber}`,
    orderData.customerInfo.address && `العنوان: ${orderData.customerInfo.address}`
  ].filter(Boolean).join('\n');

  // Format notes
  const notesText = orderData.notes ? `\nملاحظات: ${orderData.notes}` : '';

  // Format discount
  const discountText = orderData.discountAmount && orderData.discountAmount > 0 
    ? `\nالخصم: -${formatPrice(orderData.discountAmount)}`
    : '';

  // Format tips
  const tipsText = orderData.tips && orderData.tips > 0 
    ? `\nالبقشيش: ${formatPrice(orderData.tips)}`
    : '';

  // Calculate final total
  const subtotal = orderData.totalAmount;
  const discount = orderData.discountAmount || 0;
  const tips = orderData.tips || 0;
  const finalTotal = subtotal - discount + tips;

  const message = `🍽️ طلب جديد من موقع تاستيا

رقم الطلب: ${orderData.orderNumber}
التاريخ: ${new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())}

الطلبات:
${itemsText}

المجموع: ${formatPrice(subtotal)}${discountText}${tipsText}
المجموع النهائي: ${formatPrice(finalTotal)}

تفاصيل العميل:
${customerInfoText}${notesText}

---
تم إنشاء هذا الطلب من موقع تاستيا
شكراً لاختيارك مطعم تاستيا! 🎉`;

  return message;
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present (assuming Saudi Arabia +966)
  const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : `966${cleanPhone}`;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}


