import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
    title: "تاستيا - Tastia Menu",
    description: "مصنوع للاستمتاع - Made to Enjoy",
    icons: {
        icon: "/tastia-logo.png",
        shortcut: "/tastia-logo.png",
        apple: "/tastia-logo.png",
    },
};

// Force all routes under this layout to be dynamically rendered (SSR)
export const dynamic = 'force-dynamic';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                <CartProvider>
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
