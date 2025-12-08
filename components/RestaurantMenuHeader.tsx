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
                    <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-tastia-primary to-tastia-dark border-2 border-tastia-secondary">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-20 h-20 border border-tastia-cream rounded-full"></div>
                            <div className="absolute bottom-4 right-4 w-32 h-32 border border-tastia-cream rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-tastia-cream rounded-full"></div>
                        </div>

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
