"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Flame, Clock } from "lucide-react";

interface MenuItemCardProps {
    id?: string;
    image: string;
    nameAr: string;
    nameEn: string;
    description: string;
    price: number;
    oldPrice?: number;
    category: string;
    status: "active" | "out" | "inactive";
    isFeatured?: boolean;
    calories?: number;
    preparationTime?: number;
}

export const MenuItemCard = ({
    id,
    image,
    nameAr,
    nameEn,
    description,
    price,
    oldPrice,
    category,
    status,
    isFeatured,
    calories,
    preparationTime,
}: MenuItemCardProps) => {
    const [imageError, setImageError] = useState(false);

    const actualPrice = oldPrice && oldPrice > price ? price : price;
    const hasDiscount = oldPrice && oldPrice > price;
    const discountPercentage = hasDiscount
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

    return (
        <article className="group bg-tastia-primary border-2 border-tastia-secondary rounded-3xl p-5 transition-all duration-300 restaurant-menu-item">
            <div className="flex flex-col gap-4">
                {/* Top Section: Image and Info */}
                <div className="flex items-start gap-4">
                    {/* Circular Image */}
                    <div className="flex-shrink-0 relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-tastia-dark border-2 border-tastia-secondary shadow-lg">
                            {image && !imageError ? (
                                <img
                                    src={image}
                                    alt={nameAr}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tastia-primary to-tastia-secondary">
                                    <span className="text-tastia-cream text-2xl font-bold">
                                        {nameAr.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                                {discountPercentage}%
                            </div>
                        )}

                        {/* Featured Badge */}
                        {isFeatured && !hasDiscount && (
                            <div className="absolute -top-2 -right-2 bg-tastia-secondary text-tastia-dark px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                                مميز
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-tastia-cream font-bold text-lg mb-1 leading-tight">
                            {nameAr}
                        </h3>

                        {nameEn && (
                            <p className="text-tastia-cream/60 text-xs mb-1">{nameEn}</p>
                        )}

                        {description && (
                            <p className="text-tastia-cream/70 text-sm leading-relaxed line-clamp-2 mb-2">
                                {description}
                            </p>
                        )}

                        {/* Meta Info Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {calories !== undefined && calories > 0 && (
                                <div className="flex items-center gap-1 bg-tastia-dark/50 px-2 py-1 rounded-full">
                                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                                    <span className="text-tastia-cream/90 text-xs font-medium">
                                        {calories} سعر
                                    </span>
                                </div>
                            )}

                            {preparationTime !== undefined && preparationTime > 0 && (
                                <div className="flex items-center gap-1 bg-tastia-dark/50 px-2 py-1 rounded-full">
                                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-tastia-cream/90 text-xs font-medium">
                                        {preparationTime} دقيقة
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Price and Actions */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-tastia-cream/20">
                    {/* Price Section */}
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-tastia-secondary to-tastia-primary text-tastia-cream px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                            <span className="font-bold text-base">{actualPrice}</span>
                            <img
                                src="/رمز العملة السعودية.svg"
                                alt="ريال سعودي"
                                className="w-5 h-5 object-contain"
                            />
                        </div>

                        {hasDiscount && (
                            <div className="text-tastia-cream/50 text-sm line-through flex items-center gap-1">
                                {oldPrice}
                                <img
                                    src="/رمز العملة السعودية.svg"
                                    alt="ريال سعودي"
                                    className="w-4 h-4 object-contain opacity-50"
                                />
                            </div>
                        )}
                    </div>

                    {/* Out of stock badge */}
                    {status === 'out' && (
                        <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1.5 rounded-full text-xs font-bold">
                            نفذ من المخزون
                        </div>
                    )}

                    {/* Inactive badge */}
                    {status === 'inactive' && (
                        <div className="bg-gray-500/20 text-gray-400 px-3 py-1.5 rounded-full text-xs font-bold">
                            غير متاح
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};
