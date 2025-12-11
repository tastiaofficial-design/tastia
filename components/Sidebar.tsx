"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { label: "القائمة", href: "/menu" },
    { label: "تواصل معنا", href: "/contact" },
] as const;

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed right-0 top-0 h-full w-[320px] max-w-[90vw] z-50 transition-transform duration-300",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="relative h-full">
                    {/* Glass overlay */}
                    <div className="absolute inset-0 m-4">
                        <div className="glass-sidebar rounded-2xl h-full p-6 flex flex-col">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 text-tastia-cream hover:text-tastia-secondary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <div className="text-center py-8">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-tastia-primary border-2 border-tastia-secondary flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/tastia-logo.png"
                                        alt="Tastia Logo"
                                        width={96}
                                        height={96}
                                        className="object-contain -rotate-45"
                                        priority
                                    />
                                </div>
                                <h1 className="arabic-title text-2xl text-tastia-cream text-shadow">
                                    تستيا
                                </h1>
                            </div>

                            {/* Navigation Items */}
                            <nav className="flex-1 flex flex-col justify-center space-y-6">
                                {menuItems.map((item, index) => (
                                    <div key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="block text-center text-tastia-cream text-lg py-4 hover:text-tastia-secondary transition-colors font-medium"
                                            onClick={onClose}
                                        >
                                            {item.label}
                                        </Link>
                                        {index < menuItems.length - 1 && (
                                            <div className="mx-auto w-32 h-px bg-tastia-secondary/30 mt-4" />
                                        )}
                                    </div>
                                ))}
                            </nav>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
