"use client";

import { MenuItemCard } from "./MenuItemCard";
import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { useState } from "react";

const parsePositiveNumber = (value: number | string | undefined | null) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : null;
};

interface MenuItem {
    _id: string;
    name: string;
    nameEn?: string;
    description?: string;
    price: number;
    discountPrice?: number;
    image?: string;
    calories?: number;
    preparationTime?: number;
    categoryId: string;
    status: 'active' | 'inactive' | 'out_of_stock';
}

interface Category {
    _id: string;
    name: string;
    nameEn?: string;
}

interface MenuItemsListProps {
    items: MenuItem[];
    categories: Category[];
    showGrouped?: boolean;
    selectedCategory?: string | null;
    viewMode?: 'list' | 'grid';
}

const MenuItemGridCard = ({ item }: { item: MenuItem }) => {
    const [imageError, setImageError] = useState(false);
    const hasDiscount = item.discountPrice && item.discountPrice < item.price;
    const actualPrice = hasDiscount ? item.discountPrice! : item.price;
    const status = item.status === 'out_of_stock' ? 'out' : item.status;
    const caloriesValue = parsePositiveNumber(item.calories);
    const prepTimeValue = parsePositiveNumber(item.preparationTime);

    return (
        <div className="bg-[#fda766] border-2 border-tastia-secondary rounded-2xl overflow-hidden shadow-lg flex flex-col h-full">
            <div className="relative h-48 sm:h-56 bg-tastia-dark/40">
                {item.image && !imageError ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-tastia-dark/60 text-tastia-cream/80 text-4xl font-bold">
                        {item.name.charAt(0)}
                    </div>
                )}

                {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round(((item.price - item.discountPrice!) / item.price) * 100)}%
                    </div>
                )}

                {status === 'out' && (
                    <div className="absolute top-3 left-3 bg-yellow-500/80 text-tastia-dark text-xs font-bold px-2 py-1 rounded-full">
                        نفذ من المخزون
                    </div>
                )}

                {status === 'inactive' && (
                    <div className="absolute top-3 left-3 bg-gray-500/80 text-tastia-cream text-xs font-bold px-2 py-1 rounded-full">
                        غير متاح
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[#5a2c1f] font-bold text-lg leading-tight truncate">{item.name}</h3>
                        {item.nameEn && (
                            <p className="text-[#7a4c32] text-xs truncate">{item.nameEn}</p>
                        )}
                    </div>
                </div>

                {item.description && (
                    <p className="text-[#5a2c1f] text-sm leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    {caloriesValue !== null && (
                        <div className="flex items-center gap-1 bg-tastia-dark/50 px-2 py-1 rounded-full text-xs text-tastia-cream/90">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                            <span>{caloriesValue} سعر</span>
                        </div>
                    )}

                    {prepTimeValue !== null && (
                        <div className="flex items-center gap-1 bg-tastia-dark/50 px-2 py-1 rounded-full text-xs text-tastia-cream/90">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span>{prepTimeValue} دقيقة</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-tastia-cream/10">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-tastia-secondary to-tastia-primary text-tastia-cream px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <span className="font-bold text-base">{actualPrice}</span>
                            <img
                                src="/رمز العملة السعودية.svg"
                                alt="ريال سعودي"
                                className="w-4 h-4 object-contain"
                            />
                        </div>

                        {hasDiscount && (
                            <div className="text-tastia-cream/60 text-sm line-through flex items-center gap-1">
                                {item.price}
                                <img
                                    src="/رمز العملة السعودية.svg"
                                    alt="ريال سعودي"
                                    className="w-4 h-4 object-contain opacity-50"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export const MenuItemsList = ({
    items,
    categories,
    showGrouped = false,
    selectedCategory,
    viewMode = 'grid',
}: MenuItemsListProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 }
    };

    // Filter items for offers
    const filteredItems = selectedCategory === 'offers'
        ? items.filter(item => item.discountPrice && item.discountPrice < item.price)
        : items;

    // Group items by category if showGrouped is true
    const groupedItems = showGrouped
        ? categories.reduce((acc, category) => {
            // Convert both to strings for comparison to handle ObjectId vs string mismatch
            const categoryIdStr = String(category._id);
            const categoryItems = filteredItems.filter(item => String(item.categoryId) === categoryIdStr);
            if (categoryItems.length > 0) {
                acc[category._id] = {
                    category,
                    items: categoryItems,
                };
            }
            return acc;
        }, {} as Record<string, { category: Category; items: MenuItem[] }>)
        : null;

    if (filteredItems.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 px-4">
                <div className="text-center bg-[#f1e7d9] border-2 border-tastia-secondary rounded-3xl px-6 py-8 w-full">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-[#5a2c1f] text-xl font-bold mb-2">لا توجد عناصر</h3>
                    <p className="text-[#7a4c32]">لم يتم العثور على أي عناصر في هذا التصنيف</p>
                </div>
            </div>
        );
    }

    const renderItems = (itemsToRender: MenuItem[]) => (
        <motion.div
            className={`grid gap-4 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
                }`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {itemsToRender.map((item) => (
                <motion.div key={item._id} variants={itemVariants} className="h-full">
                    {viewMode === 'grid' ? (
                        <MenuItemGridCard item={item} />
                    ) : (
                        <MenuItemCard
                            id={item._id}
                            image={item.image || ''}
                            nameAr={item.name}
                            nameEn={item.nameEn || ''}
                            description={item.description || ''}
                            price={item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price}
                            oldPrice={item.discountPrice && item.discountPrice < item.price ? item.price : undefined}
                            category={categories.find(c => c._id === item.categoryId)?.name || ''}
                            status={item.status === 'out_of_stock' ? 'out' : item.status}
                            calories={item.calories}
                            preparationTime={item.preparationTime}
                        />
                    )}
                </motion.div>
            ))}
        </motion.div>
    );

    if (showGrouped && groupedItems) {
        return (
            <div className="px-4 menu-items-container bg-[#f1e7d9] border-2 border-tastia-secondary rounded-3xl py-4">
                {Object.values(groupedItems).map(({ category, items: categoryItems }) => (
                    <div key={category._id} className="mb-8">
                        <h3 className="text-[#5a2c1f] text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-tastia-secondary"></span>
                            {category.name}
                        </h3>
                        {renderItems(categoryItems)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="px-4 menu-items-container bg-[#f1e7d9] border-2 border-tastia-secondary rounded-3xl py-4">
            {renderItems(filteredItems)}
        </div>
    );
};
