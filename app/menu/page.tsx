"use client";

import { useEffect, useState } from "react";
import { List, Grid3X3 } from "lucide-react";
import { RestaurantMenuHeader } from "@/components/RestaurantMenuHeader";
import { CategoriesSection } from "@/components/CategoriesSection";
import { MenuItemsList } from "@/components/MenuItemsList";
import { MenuPageSkeleton } from "@/components/SkeletonLoader";
import { SearchBar } from "@/components/SearchBar";
import ErrorBoundary from "@/components/ErrorBoundary";

import { useCachedFetch } from "@/hooks/useCachedFetch";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

interface Category {
    _id: string;
    name: string;
    nameEn?: string;
    description?: string;
    image?: string;
    icon?: string;
    color: string;
    order: number;
    status: 'active' | 'inactive';
}

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

export default function Menu() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    // Use cached fetch for categories
    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
        isCached: categoriesCached
    } = useCachedFetch<Category[]>('/api/categories', {
        cacheKey: 'tastia_categories_cache_v1',
        cacheTTL: 10 * 60 * 1000
    });

    // Use cached fetch for menu items
    const {
        data: itemsData,
        loading: itemsLoading,
        error: itemsError,
        isCached: itemsCached
    } = useCachedFetch<MenuItem[]>('/api/items', {
        cacheKey: 'tastia_items_cache_v1',
        cacheTTL: 10 * 60 * 1000
    });

    // Process categories data
    const categories = categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0
        ? categoriesData
            .filter((category: Category) => category.status === 'active')
            .sort((a: Category, b: Category) => a.order - b.order)
            .map((category: Category) => ({
                ...category,
                // Ensure _id is a string for consistent comparison
                _id: String(category._id || '')
            }))
        : [];

    // Process menu items data
    const menuItems = itemsData && Array.isArray(itemsData) && itemsData.length > 0
        ? itemsData
            .filter((item: MenuItem) => item.status === 'active')
            .map((item: MenuItem) => ({
                ...item,
                // Ensure categoryId is a string for consistent comparison
                categoryId: String(item.categoryId || '')
            }))
        : [];

    const loading = categoriesLoading || itemsLoading;

    useEffect(() => {
        if (categoriesCached) {
            console.log('التصنيفات محملة من الذاكرة المؤقتة');
        }
        if (itemsCached) {
            console.log('عناصر القائمة محملة من الذاكرة المؤقتة');
        }

        // Debug logging
        if (categoriesData) {
            console.log('Categories loaded:', categoriesData.length, categoriesData);
        }
        if (itemsData) {
            console.log('Items loaded:', itemsData.length, itemsData);
            console.log('Items with categoryIds:', itemsData.map((item: MenuItem) => ({
                name: item.name,
                categoryId: item.categoryId,
                categoryIdType: typeof item.categoryId
            })));
        }
    }, [categoriesCached, itemsCached, categoriesData, itemsData]);

    const handleCategoryClick = (categoryId: string) => {
        if (categoryId === 'all') {
            setSelectedCategory(null);
        } else if (categoryId === 'offers') {
            setSelectedCategory('offers');
        } else {
            setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
        }
    };



    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            setSelectedCategory(null);
        }
    };

    // Filter menu items
    const filteredMenuItems = (() => {
        let items = menuItems;

        if (selectedCategory && selectedCategory !== 'offers') {
            // Convert both to strings for comparison to handle ObjectId vs string mismatch
            items = items.filter(item => String(item.categoryId) === String(selectedCategory));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            items = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.nameEn && item.nameEn.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
        }

        return items;
    })();

    const offersCount = menuItems.filter(item => item.discountPrice && item.discountPrice < item.price).length;

    return (
        <div
            className="min-h-screen relative overflow-hidden font-['Cairo'] bg-tastia-dark"
            dir="rtl"
        >
            {loading ? (
                <MenuPageSkeleton />
            ) : categoriesError || itemsError ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center text-tastia-cream">
                        <h2 className="text-xl font-bold mb-2">خطأ في تحميل البيانات</h2>
                        <p className="text-tastia-cream/70 mb-4">
                            {categoriesError ? 'فشل في تحميل التصنيفات' : 'فشل في تحميل عناصر القائمة'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-tastia-primary to-tastia-secondary text-tastia-cream px-4 py-2 rounded-full hover:brightness-110 transition-all"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            ) : (
                <ErrorBoundary>
                    <motion.div
                        className="relative z-10 min-h-screen pb-24"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ y: -16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <RestaurantMenuHeader />
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
                        >
                            <SearchBar onSearch={handleSearch} />
                        </motion.div>

                        {/* Categories Section */}
                        <motion.div
                            key={selectedCategory ?? 'all'}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
                        >
                            <CategoriesSection
                                categories={categories}
                                onCategoryClick={handleCategoryClick}
                                selectedCategory={selectedCategory}
                                offersCount={offersCount}
                            />
                        </motion.div>

                        {/* View Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
                            className="px-4 mb-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-tastia-cream/70 text-sm">عرض:</span>
                                    <div className="flex bg-tastia-dark/80 border border-tastia-secondary/30 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                                ? 'bg-tastia-primary text-tastia-cream'
                                                : 'text-tastia-cream/60 hover:text-tastia-cream/80'
                                                }`}
                                        >
                                            <List className="w-4 h-4" />
                                            قائمة
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid'
                                                ? 'bg-tastia-primary text-tastia-cream'
                                                : 'text-tastia-cream/60 hover:text-tastia-cream/80'
                                                }`}
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                            شبكة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Menu Items with background */}
                        <motion.div
                            key={`${selectedCategory ?? 'all'}-${searchQuery}-${viewMode}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
                        >
                            <div
                                className="rounded-3xl overflow-hidden bg-tastia-dark"
                            >
                                <div className="md:backdrop-blur-sm md:bg-tastia-dark/85">
                                    <MenuItemsList
                                        items={filteredMenuItems}
                                        categories={categories}
                                        showGrouped={selectedCategory === null && !searchQuery.trim()}
                                        selectedCategory={selectedCategory}
                                        viewMode={viewMode}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </ErrorBoundary>
            )}


        </div>
    );
}
