'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { AdminAuth } from '@/components/AdminAuth';

const navigation = [
  { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { name: 'الفئات', href: '/admin/categories', icon: FolderOpen },
  { name: 'المنتجات', href: '/admin/items', icon: Package },
  { name: 'التحليلات', href: '/admin/analytics', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <AdminAuth>
    <div className="min-h-screen bg-tastia-dark">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 glass-effect rounded-xl text-tastia-cream"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-40 h-screen transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full glass-sidebar border-l border-tastia-secondary/30 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-tastia-secondary/30">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <h1 className="text-2xl font-bold text-tastia-cream font-arabic">
                  لوحة التحكم
                </h1>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-colors text-tastia-cream"
              >
                {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
            {!collapsed && (
              <p className="text-sm text-tastia-cream/70 mt-2">إدارة قائمة المطعم</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-tastia-primary text-tastia-cream shadow-lg'
                      : 'text-tastia-cream/80 hover:bg-white/10'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon size={20} />
                  {!collapsed && (
                    <span className="font-semibold">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-tastia-secondary/30">
            {!collapsed && (
              <div className="glass-effect rounded-xl p-4">
                <p className="text-sm text-tastia-cream/90 font-semibold">تاستيا</p>
                <p className="text-xs text-tastia-cream/60 mt-1">
                  نظام إدارة المطاعم
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          collapsed ? 'lg:mr-20' : 'lg:mr-72'
        }`}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </AdminAuth>
  );
}



