"use client";

import { motion } from "framer-motion";

interface Category {
    _id: string;
    name: string;
    nameEn?: string;
    image?: string;
    icon?: string;
    color: string;
}

interface CategoriesSectionProps {
    categories: Category[];
    onCategoryClick: (categoryId: string) => void;
    selectedCategory?: string | null;
    offersCount?: number;
}

export const CategoriesSection = ({ categories, onCategoryClick, selectedCategory, offersCount = 0 }: CategoriesSectionProps) => {
    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="px-4 mb-6">
            <h2 className="text-[#5a2c1f] text-lg font-bold mb-4 text-center">التصنيفات</h2>
            <motion.div
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                variants={listVariants}
                initial="hidden"
                animate="show"
            >
                {/* All Categories Option */}
                <motion.div
                    onClick={() => onCategoryClick('all')}
                    className="flex-shrink-0 cursor-pointer group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={`w-20 h-20 rounded-full overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 category-circle ${selectedCategory === null || selectedCategory === 'all'
                            ? 'bg-tastia-primary border-tastia-secondary'
                            : 'bg-tastia-dark/50 border-tastia-secondary/30 group-hover:border-tastia-secondary/60'
                        }`}>
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tastia-primary/60 to-tastia-secondary/40">
                            <span className="text-tastia-cream text-lg font-bold">الكل</span>
                        </div>
                    </div>
                    <p className="text-[#5a2c1f] text-xs text-center mt-2 font-medium">
                        الكل
                    </p>
                </motion.div>

                {/* Offers Category */}
                {offersCount > 0 && (
                    <motion.div
                        onClick={() => onCategoryClick('offers')}
                        className="flex-shrink-0 cursor-pointer group"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`w-20 h-20 rounded-full overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 category-circle relative ${selectedCategory === 'offers'
                                ? 'bg-tastia-primary border-tastia-secondary'
                                : 'bg-tastia-dark/50 border-tastia-secondary/30 group-hover:border-tastia-secondary/60'
                            }`}>
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/40 to-orange-500/40">
                                <span className="text-2xl">🏷️</span>
                            </div>
                            {/* Badge */}
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {offersCount}
                            </div>
                        </div>
                        <p className="text-[#5a2c1f] text-xs text-center mt-2 font-medium">
                            العروض
                        </p>
                    </motion.div>
                )}

                {/* Category Items */}
                {categories.map((category) => (
                    <motion.div
                        key={category._id}
                        onClick={() => onCategoryClick(category._id)}
                        className="flex-shrink-0 cursor-pointer group"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`w-20 h-20 rounded-full overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 category-circle ${selectedCategory === category._id
                                ? 'bg-tastia-primary border-tastia-secondary'
                                : 'bg-tastia-dark/50 border-tastia-secondary/30 group-hover:border-tastia-secondary/60'
                            }`}>
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ backgroundColor: `${category.color}40` }}
                                >
                                    <span className="text-tastia-cream text-lg font-bold">
                                        {category.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-[#5a2c1f] text-xs text-center mt-2 font-medium max-w-20 truncate">
                            {category.name}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
