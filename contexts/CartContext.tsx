"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
    id: string;
    name: string;
    nameEn?: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    notes?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    totalItems: number;
    totalPrice: number;
    tips: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'SET_CART_OPEN'; payload: boolean }
    | { type: 'LOAD_CART'; payload: CartItem[] }
    | { type: 'SET_TIPS'; payload: number };

const initialState: CartState = {
    items: [],
    isOpen: false,
    totalItems: 0,
    totalPrice: 0,
    tips: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            let newItems: CartItem[];
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
            };
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
            };
        }

        case 'UPDATE_QUANTITY': {
            const newItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                    : item
            ).filter(item => item.quantity > 0);

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
            };
        }

        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0,
                tips: 0,
            };

        case 'SET_TIPS':
            return {
                ...state,
                tips: Math.max(0, action.payload),
            };

        case 'TOGGLE_CART':
            return {
                ...state,
                isOpen: !state.isOpen,
            };

        case 'SET_CART_OPEN':
            return {
                ...state,
                isOpen: action.payload,
            };

        case 'LOAD_CART': {
            const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: action.payload,
                totalItems,
                totalPrice,
            };
        }

        default:
            return state;
    }
}

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('tastia_cart');
            if (savedCart) {
                try {
                    const cartItems = JSON.parse(savedCart);
                    dispatch({ type: 'LOAD_CART', payload: cartItems });
                } catch (error) {
                    console.error('خطأ في تحميل السلة:', error);
                }
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tastia_cart', JSON.stringify(state.items));
            localStorage.setItem('tastia_cart_tips', JSON.stringify(state.tips));
        }
    }, [state.items, state.tips]);

    // Load tips from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTips = localStorage.getItem('tastia_cart_tips');
            if (savedTips) {
                try {
                    const tips = parseFloat(savedTips) || 0;
                    dispatch({ type: 'SET_TIPS', payload: tips });
                } catch (error) {
                    console.error('Error loading tips:', error);
                }
            }
        }
    }, []);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        console.warn('useCart must be used within a CartProvider');
        return {
            state: initialState,
            dispatch: () => { },
        };
    }
    return context;
}
