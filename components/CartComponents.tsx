"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                        className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] bg-tastia-dark border-t-2 border-tastia-secondary rounded-t-3xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-tastia-secondary/30">
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
                        <div className="overflow-y-auto max-h-[50vh] p-4">
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
                                                <p className="text-tastia-secondary font-bold">{item.price} ر.س</p>
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
                        {state.items.length > 0 && (
                            <div className="p-4 border-t border-tastia-secondary/30 bg-tastia-dark">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-tastia-cream/70">المجموع</span>
                                    <span className="text-tastia-cream text-2xl font-bold">{state.totalPrice} ر.س</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => dispatch({ type: 'CLEAR_CART' })}
                                        className="flex-1 py-3 rounded-full border border-tastia-secondary/50 text-tastia-cream font-bold hover:bg-tastia-primary/20 transition-colors"
                                    >
                                        إفراغ السلة
                                    </button>
                                    <button
                                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-tastia-secondary to-tastia-primary text-tastia-cream font-bold hover:brightness-110 transition-all"
                                    >
                                        إتمام الطلب
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
