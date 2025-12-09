"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";

export const RestaurantMenuHeader = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <header className="relative w-full mb-6">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main header */}
            <div className="relative px-4 py-4">
                {/* Hamburger */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="absolute top-6 left-6 z-20"
                    aria-label="فتح القائمة"
                >
                    <div className="w-6 h-6 flex flex-col justify-between">
                        <div className="w-full h-0.5 bg-tastia-cream rounded"></div>
                        <div className="w-full h-0.5 bg-tastia-cream rounded"></div>
                        <div className="w-full h-0.5 bg-tastia-cream rounded"></div>
                    </div>
                </button>

                <div className="relative w-full">
                    <div
                        className="relative w-full h-44 sm:h-56 md:h-64 rounded-2xl overflow-hidden border-2 border-tastia-secondary bg-[hsl(var(--tastia-primary))]"
                    >
                        {/* Image layer sits on top of the brand orange so both stay visible */}
                        <div
                            className="absolute inset-0 opacity-80 mix-blend-multiply"
                            style={{
                                backgroundImage: "url('/Restaurant_Aesthetic_food_Red_Wallpaper_4-removebg-preview.webp')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                        {/* Orange-tinted gradient to keep the brand color present over the image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--tastia-primary))] via-[hsl(var(--tastia-secondary))] to-[hsl(var(--tastia-dark))] opacity-80" />

                        <div className="relative z-10 h-full flex items-center justify-center">
                            {/* Brand Logo */}
                            <div className="text-center">
                                {/* Hexagon Logo Shape */}
                                <div className="mx-auto mb-4 w-28 h-28 md:w-36 md:h-36 relative">
                                    <div className="absolute inset-0 bg-tastia-primary rounded-2xl rotate-45 border-4 border-tastia-secondary shadow-lg"></div>
                                    <div className="absolute inset-2 bg-tastia-dark rounded-xl rotate-45 flex items-center justify-center">
                                        <Image 
                                            src="/tastia-logo.png" 
                                            alt="Tastia Logo" 
                                            width={80} 
                                            height={80} 
                                            className="object-contain -rotate-45"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-tastia-cream text-2xl md:text-3xl font-bold tracking-wide">تاستيا</h1>
                                <p className="text-tastia-cream/80 text-sm md:text-base">MADE TO ENJOY</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
