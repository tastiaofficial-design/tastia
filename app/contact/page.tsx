"use client";

import { motion } from "framer-motion";
import { RestaurantMenuHeader } from "@/components/RestaurantMenuHeader";
import { Phone, MapPin } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ContactPage() {
    const phoneNumber = "+966 56 336 9848";
    const mapLat = 16.9151878356934;
    const mapLng = 42.5570106506348;
    const mapUrl = `https://www.google.com/maps?q=${mapLat},${mapLng}`;

    return (
        <div
            className="min-h-screen relative overflow-hidden font-['Cairo'] bg-tastia-dark"
            dir="rtl"
        >
            <motion.div
                className="relative z-10 min-h-screen pb-8"
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

                {/* Contact Content */}
                <div className="px-4 py-6 space-y-6">
                    {/* Page Title */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
                        className="text-center mb-8"
                    >
                        <h1 className="arabic-title text-3xl md:text-4xl text-tastia-cream text-shadow mb-2">
                            تواصل معنا
                        </h1>
                        <p className="text-tastia-cream/70 text-lg">
                            نحن هنا لمساعدتك
                        </p>
                    </motion.div>

                    {/* Contact Information Card */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
                        className="glass-effect rounded-3xl p-6 space-y-6"
                    >
                        {/* Phone Number */}
                        <div className="flex items-center gap-4">
                            <div className="glass-button rounded-full p-4 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-tastia-cream" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-tastia-cream/70 text-sm mb-1">رقم الهاتف</h3>
                                <a
                                    href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                                    className="text-tastia-cream text-xl font-bold hover:text-tastia-secondary transition-colors"
                                >
                                    {phoneNumber}
                                </a>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="glass-button rounded-full p-4 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-tastia-cream" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-tastia-cream/70 text-sm mb-1">الموقع</h3>
                                <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-tastia-cream text-lg font-medium hover:text-tastia-secondary transition-colors"
                                >
                                    افتح في خرائط جوجل
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
                        className="glass-effect rounded-3xl overflow-hidden"
                    >
                        <div className="p-4">
                            <h2 className="arabic-title text-xl text-tastia-cream text-shadow mb-4 text-center">
                                موقعنا على الخريطة
                            </h2>
                            <div className="relative w-full" style={{ height: '400px' }}>
                                <iframe
                                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.123456789!2d${mapLng}!3d${mapLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDU0JzU0LjciTiA0MsKwMzMnMjUuMiJF!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&q=${mapLat},${mapLng}`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '1rem' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-2xl"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block glass-button text-tastia-cream px-6 py-3 rounded-full hover:brightness-110 transition-all text-sm font-medium"
                                >
                                    عرض في خرائط جوجل
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}















