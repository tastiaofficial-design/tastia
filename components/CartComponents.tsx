"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp-utils";

export const CartIcon = () => {
    const { state, dispatch } = useCart();

    return (
        <button
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative bg-gradient-to-r from-tastia-primary to-tastia-secondary p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
            <ShoppingCart className="w-6 h-6 text-tastia-cream" />
            {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {state.totalItems}
                </span>
            )}
        </button>
    );
};

export const CartModal = () => {
    const { state, dispatch } = useCart();
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [tips, setTips] = useState(0);

    // Sync tips with state
    useEffect(() => {
        setTips(state.tips || 0);
    }, [state.tips]);

    // WhatsApp number - should be in environment variable
    // +966 56 336 9848
    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966563369848';

    const handleCheckout = () => {
        if (state.items.length === 0) return;
        setShowOrderForm(true);
    };

    const handleSubmitOrder = async () => {
        if (state.items.length === 0) return;
        if (!customerPhone.trim()) {
            alert('يرجى إدخال رقم الهاتف');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare order data
            const orderItems = state.items.map(item => ({
                menuItemId: item.id,
                menuItemName: item.name,
                menuItemNameEn: item.nameEn,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity,
            }));

            const orderData = {
                items: orderItems,
                totalAmount: state.totalPrice,
                tips: tips || 0,
                customerInfo: {
                    name: customerName.trim() || undefined,
                    phone: customerPhone.trim(),
                    address: customerAddress.trim() || undefined,
                    tableNumber: tableNumber.trim() || undefined,
                },
                notes: notes.trim() || undefined,
            };

            // Save order to database
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to save order');
            }

            // Generate WhatsApp message with order number
            const orderNumber = result.data.orderNumber;
            const message = generateWhatsAppMessage({
                ...orderData,
                orderNumber,
            });

            // Open WhatsApp
            const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, message);
            window.open(whatsappUrl, '_blank');

            // Clear cart and reset form
            dispatch({ type: 'CLEAR_CART' });
            dispatch({ type: 'SET_CART_OPEN', payload: false });
            setShowOrderForm(false);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setTableNumber('');
            setNotes('');
            setTips(0);

            // Show success message
            alert('تم إرسال الطلب بنجاح! سيتم فتح واتساب لإتمام الطلب.');

        } catch (error: any) {
            console.error('Error submitting order:', error);
            alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const finalTotal = state.totalPrice + (tips || 0);

    if (!state.isOpen) return null;

    return (
        <AnimatePresence>
            {state.isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 z-50 bg-tastia-dark flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-tastia-secondary/30 flex-shrink-0">
                            <h2 className="text-tastia-cream text-xl font-bold flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                سلة المشتريات
                            </h2>
                            <button
                                onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                                className="text-tastia-cream/60 hover:text-tastia-cream transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4" style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            {state.items.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">🛒</div>
                                    <p className="text-tastia-cream/60">السلة فارغة</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {state.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 bg-tastia-primary/30 rounded-2xl p-4 border border-tastia-secondary/20"
                                        >
                                            {/* Image */}
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-tastia-primary border border-tastia-secondary">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tastia-primary to-tastia-secondary">
                                                        <span className="text-tastia-cream text-lg font-bold">{item.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="text-tastia-cream font-bold">{item.name}</h3>
                                                <p className="text-tastia-secondary font-bold flex items-center gap-1">
                                                    {item.price}
                                                    <img 
                                                        src="/رمز العملة السعودية.svg" 
                                                        alt="ريال سعودي" 
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => dispatch({
                                                        type: 'UPDATE_QUANTITY',
                                                        payload: { id: item.id, quantity: item.quantity - 1 }
                                                    })}
                                                    className="w-8 h-8 rounded-full bg-tastia-dark flex items-center justify-center text-tastia-cream hover:bg-tastia-primary transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-tastia-cream font-bold w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch({
                                                        type: 'UPDATE_QUANTITY',
                                                        payload: { id: item.id, quantity: item.quantity + 1 }
                                                    })}
                                                    className="w-8 h-8 rounded-full bg-tastia-dark flex items-center justify-center text-tastia-cream hover:bg-tastia-primary transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors mr-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {state.items.length > 0 && !showOrderForm && (
                            <div className="p-4 border-t border-tastia-secondary/30 bg-tastia-dark flex-shrink-0">
                                {/* Tips Input */}
                                <div className="mb-4">
                                    <label className="block text-tastia-cream/70 text-sm mb-2">اكرامية لطاقم العمل (اختياري)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={tips}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setTips(value);
                                            dispatch({ type: 'SET_TIPS', payload: value });
                                        }}
                                        placeholder="0"
                                        className="w-full admin-input"
                                    />
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between">
                                    <span className="text-tastia-cream/70">المجموع</span>
                                        <span className="text-tastia-cream text-lg font-bold flex items-center gap-1">
                                            {state.totalPrice.toFixed(2)}
                                            <img 
                                                src="/رمز العملة السعودية.svg" 
                                                alt="ريال سعودي" 
                                                className="w-4 h-4 object-contain"
                                            />
                                        </span>
                                    </div>
                                    {tips > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-tastia-cream/70">اكرامية لطاقم العمل</span>
                                            <span className="text-tastia-cream text-lg font-bold flex items-center gap-1">
                                                {tips.toFixed(2)}
                                                <img 
                                                    src="/رمز العملة السعودية.svg" 
                                                    alt="ريال سعودي" 
                                                    className="w-4 h-4 object-contain"
                                                />
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-tastia-secondary/30">
                                        <span className="text-tastia-cream font-bold">المجموع النهائي</span>
                                        <span className="text-tastia-secondary text-2xl font-bold flex items-center gap-1">
                                            {finalTotal.toFixed(2)}
                                            <img 
                                                src="/رمز العملة السعودية.svg" 
                                                alt="ريال سعودي" 
                                                className="w-5 h-5 object-contain"
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => dispatch({ type: 'CLEAR_CART' })}
                                        className="flex-1 py-3 rounded-full border border-tastia-secondary/50 text-tastia-cream font-bold hover:bg-tastia-primary/20 transition-colors"
                                    >
                                        إفراغ السلة
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-tastia-secondary to-tastia-primary text-tastia-cream font-bold hover:brightness-110 transition-all"
                                    >
                                        إتمام الطلب
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Order Form */}
                        {showOrderForm && (
                            <div className="flex-1 overflow-y-auto p-4 border-t border-tastia-secondary/30 bg-tastia-dark space-y-4">
                                <h3 className="text-tastia-cream text-lg font-bold">معلومات الطلب</h3>
                                
                                <div>
                                    <label className="block text-tastia-cream/70 text-sm mb-2">رقم الهاتف *</label>
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="05xxxxxxxx"
                                        required
                                        className="w-full admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-tastia-cream/70 text-sm mb-2">الاسم (اختياري)</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="اسمك"
                                        className="w-full admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-tastia-cream/70 text-sm mb-2">رقم الطاولة (اختياري)</label>
                                    <input
                                        type="text"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        placeholder="رقم الطاولة"
                                        className="w-full admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-tastia-cream/70 text-sm mb-2">العنوان (اختياري)</label>
                                    <input
                                        type="text"
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                        placeholder="عنوان التوصيل"
                                        className="w-full admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-tastia-cream/70 text-sm mb-2">ملاحظات (اختياري)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="ملاحظات إضافية..."
                                        className="w-full admin-input min-h-20"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2 flex-shrink-0">
                                    <button
                                        onClick={() => setShowOrderForm(false)}
                                        disabled={isLoading}
                                        className="flex-1 py-3 rounded-full border border-tastia-secondary/50 text-tastia-cream font-bold hover:bg-tastia-primary/20 transition-colors disabled:opacity-50"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={isLoading || !customerPhone.trim()}
                                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-tastia-secondary to-tastia-primary text-tastia-cream font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                جاري الإرسال...
                                            </>
                                        ) : (
                                            'إرسال الطلب عبر واتساب'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
