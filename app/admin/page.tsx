"use client";

import Link from "next/link";
import { LayoutDashboard, FolderOpen, Package } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6">
          <div>
            <h1 className="text-3xl font-bold text-tastia-cream mb-2">لوحة التحكم</h1>
            <p className="text-tastia-cream/70">إدارة قائمة المطعم</p>
                </div>
            </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
            href="/admin/categories"
            className="glass-effect rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-tastia-primary/20 flex items-center justify-center group-hover:bg-tastia-primary/30 transition-colors">
                <FolderOpen className="text-tastia-secondary" size={24} />
              </div>
              <h2 className="text-xl font-bold text-tastia-cream">الفئات</h2>
            </div>
            <p className="text-tastia-cream/70 text-sm">
              إدارة فئات القائمة وإضافة فئات جديدة
            </p>
          </Link>

          <Link
            href="/admin/items"
            className="glass-effect rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-tastia-primary/20 flex items-center justify-center group-hover:bg-tastia-primary/30 transition-colors">
                <Package className="text-tastia-secondary" size={24} />
              </div>
              <h2 className="text-xl font-bold text-tastia-cream">المنتجات</h2>
            </div>
            <p className="text-tastia-cream/70 text-sm">
              إدارة منتجات القائمة وإضافة منتجات جديدة
            </p>
          </Link>

          <Link
            href="/menu"
            className="glass-effect rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-tastia-primary/20 flex items-center justify-center group-hover:bg-tastia-primary/30 transition-colors">
                <LayoutDashboard className="text-tastia-secondary" size={24} />
                    </div>
              <h2 className="text-xl font-bold text-tastia-cream">عرض القائمة</h2>
                                </div>
            <p className="text-tastia-cream/70 text-sm">
              عرض القائمة للمستخدمين
            </p>
          </Link>
        </div>
      </div>
  );
}
