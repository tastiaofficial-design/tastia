"use client";

import { MenuItemCard } from "./MenuItemCard";
import { motion } from "framer-motion";

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
    onAddToCart: (itemId: string) => void;
    categories: Category[];
    showGrouped?: boolean;
    selectedCategory?: string | null;
    viewMode?: 'list' | 'grid';
}

export const MenuItemsList = ({
    items,
    onAddToCart,
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
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-tastia-cream text-xl font-bold mb-2">لا توجد عناصر</h3>
                    <p className="text-tastia-cream/60">لم يتم العثور على أي عناصر في هذا التصنيف</p>
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
                <motion.div key={item._id} variants={itemVariants}>
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
                </motion.div>
            ))}
        </motion.div>
    );

    if (showGrouped && groupedItems) {
        return (
            <div 
                className="px-4 menu-items-container relative"
                style={{
                    background: 'linear-gradient(to bottom, rgb(249, 115, 22), rgb(234, 88, 12), rgb(194, 65, 12))',
                }}
            >
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'url(/Carlos_Sainz_wallpaper-removebg-preview.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.3,
                        zIndex: 0,
                    }}
                />
                <div className="relative z-10">
                    {Object.values(groupedItems).map(({ category, items: categoryItems }) => (
                        <div key={category._id} className="mb-8">
                            <h3 className="text-tastia-cream text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-tastia-secondary"></span>
                                {category.name}
                            </h3>
                            {renderItems(categoryItems)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div 
            className="px-4 menu-items-container relative"
            style={{
                background: 'linear-gradient(to bottom, rgb(249, 115, 22), rgb(234, 88, 12), rgb(194, 65, 12))',
            }}
        >
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'url(/Carlos_Sainz_wallpaper-removebg-preview.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.3,
                    zIndex: 0,
                }}
            />
            <div className="relative z-10">
                {renderItems(filteredItems)}
            </div>
        </div>
    );
};
