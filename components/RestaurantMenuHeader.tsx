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
                        className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden border-2 border-tastia-secondary bg-[hsl(var(--tastia-primary))]"
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
                                <h1 className="text-tastia-cream text-2xl md:text-3xl font-bold tracking-wide">تستيا</h1>
                                <p className="text-tastia-cream/80 text-sm md:text-base">MADE TO ENJOY</p>

                                {/* Social Media Icons */}
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    {/* Instagram */}
                                    <a
                                        href="https://www.instagram.com/tastia.sa?igsh=NjQ2eHNzd3ZsYThz"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-tastia-cream/80 hover:text-tastia-cream transition-colors duration-200"
                                        aria-label="Instagram"
                                    >
                                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>

                                    {/* TikTok */}
                                    <a
                                        href="https://www.tiktok.com/@tastia.sa?_r=1&_t=ZS-9267Llw8UI0"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-tastia-cream/80 hover:text-tastia-cream transition-colors duration-200"
                                        aria-label="TikTok"
                                    >
                                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </a>

                                    {/* Twitter/X */}
                                    <a
                                        href="https://x.com/TastiaSa"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-tastia-cream/80 hover:text-tastia-cream transition-colors duration-200"
                                        aria-label="Twitter"
                                    >
                                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
