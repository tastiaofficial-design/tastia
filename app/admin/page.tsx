"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp, Loader2, Home } from "lucide-react";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    nameEn?: string;
    description?: string;
    image?: string;
    color: string;
    order: number;
    status: 'active' | 'inactive';
}

interface MenuItem {
    _id: string;
    name: string;
    nameEn?: string;
    description?: string;
    price: number;
    discountPrice?: number;
    image?: string;
    calories?: number;
    preparationTime?: number;
    categoryId: string;
    status: 'active' | 'inactive' | 'out_of_stock';
}

export default function AdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Form states
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Category form
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        nameEn: '',
        description: '',
        image: '',
        color: '#B94A24',
        order: 0,
        status: 'active' as 'active' | 'inactive',
    });

    // Item form
    const [itemForm, setItemForm] = useState({
        name: '',
        nameEn: '',
        description: '',
        price: 0,
        discountPrice: 0,
        image: '',
        calories: 0,
        preparationTime: 0,
        categoryId: '',
        status: 'active' as 'active' | 'inactive' | 'out_of_stock',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, itemsRes] = await Promise.all([
                fetch('/api/categories?admin=true'),
                fetch('/api/items?admin=true'),
            ]);

            const catData = await catRes.json();
            const itemsData = await itemsRes.json();

            if (catData.success) setCategories(catData.data);
            if (itemsData.success) setMenuItems(itemsData.data);
        } catch (error) {
            console.error('خطأ في جلب البيانات:', error);
        } finally {
            setLoading(false);
        }
    };

    // Category handlers
    const handleSaveCategory = async () => {
        setSaving(true);
        try {
            const url = editingCategory
                ? `/api/categories/${editingCategory._id}`
                : '/api/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm),
            });

            if (response.ok) {
                await fetchData();
                resetCategoryForm();
            }
        } catch (error) {
            console.error('خطأ في حفظ التصنيف:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

        try {
            const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (response.ok) await fetchData();
        } catch (error) {
            console.error('خطأ في حذف التصنيف:', error);
        }
    };

    const editCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            nameEn: category.nameEn || '',
            description: category.description || '',
            image: category.image || '',
            color: category.color,
            order: category.order,
            status: category.status,
        });
        setShowCategoryForm(true);
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setCategoryForm({
            name: '',
            nameEn: '',
            description: '',
            image: '',
            color: '#B94A24',
            order: 0,
            status: 'active',
        });
        setShowCategoryForm(false);
    };

    // Item handlers
    const handleSaveItem = async () => {
        setSaving(true);
        try {
            const url = editingItem
                ? `/api/items/${editingItem._id}`
                : '/api/items';
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemForm),
            });

            if (response.ok) {
                await fetchData();
                resetItemForm();
            }
        } catch (error) {
            console.error('خطأ في حفظ العنصر:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

        try {
            const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) await fetchData();
        } catch (error) {
            console.error('خطأ في حذف العنصر:', error);
        }
    };

    const editItem = (item: MenuItem) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            nameEn: item.nameEn || '',
            description: item.description || '',
            price: item.price,
            discountPrice: item.discountPrice || 0,
            image: item.image || '',
            calories: item.calories || 0,
            preparationTime: item.preparationTime || 0,
            categoryId: item.categoryId,
            status: item.status,
        });
        setShowItemForm(true);
    };

    const resetItemForm = () => {
        setEditingItem(null);
        setItemForm({
            name: '',
            nameEn: '',
            description: '',
            price: 0,
            discountPrice: 0,
            image: '',
            calories: 0,
            preparationTime: 0,
            categoryId: '',
            status: 'active',
        });
        setShowItemForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-tastia-dark flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-tastia-secondary animate-spin mx-auto mb-4" />
                    <p className="text-tastia-cream">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tastia-dark text-tastia-cream p-4 md:p-8" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">لوحة تحكم تاستيا</h1>
                    <p className="text-tastia-cream/60 mt-1">إدارة القائمة والتصنيفات</p>
                </div>
                <Link
                    href="/menu"
                    className="flex items-center gap-2 bg-tastia-primary px-4 py-2 rounded-lg hover:brightness-110 transition-all"
                >
                    <Home className="w-5 h-5" />
                    العودة للقائمة
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'categories'
                            ? 'bg-tastia-primary text-tastia-cream'
                            : 'bg-tastia-dark border border-tastia-secondary/30 text-tastia-cream/70 hover:text-tastia-cream'
                        }`}
                >
                    التصنيفات ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab('items')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'items'
                            ? 'bg-tastia-primary text-tastia-cream'
                            : 'bg-tastia-dark border border-tastia-secondary/30 text-tastia-cream/70 hover:text-tastia-cream'
                        }`}
                >
                    العناصر ({menuItems.length})
                </button>
            </div>

            {/* Categories Section */}
            {activeTab === 'categories' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">التصنيفات</h2>
                        <button
                            onClick={() => setShowCategoryForm(true)}
                            className="flex items-center gap-2 bg-tastia-secondary px-4 py-2 rounded-lg hover:brightness-110 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة تصنيف
                        </button>
                    </div>

                    {/* Category Form Modal */}
                    {showCategoryForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-tastia-dark border border-tastia-secondary/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">
                                        {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                                    </h3>
                                    <button onClick={resetCategoryForm} className="text-tastia-cream/60 hover:text-tastia-cream">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الاسم بالعربية *</label>
                                        <input
                                            type="text"
                                            value={categoryForm.name}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                            className="admin-input"
                                            placeholder="مثال: السلطات"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الاسم بالإنجليزية</label>
                                        <input
                                            type="text"
                                            value={categoryForm.nameEn}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                                            className="admin-input"
                                            placeholder="Salads"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الوصف</label>
                                        <textarea
                                            value={categoryForm.description}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                            className="admin-input min-h-[80px]"
                                            placeholder="وصف التصنيف..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                                        <input
                                            type="text"
                                            value={categoryForm.image}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                                            className="admin-input"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">اللون</label>
                                            <input
                                                type="color"
                                                value={categoryForm.color}
                                                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                                className="w-full h-10 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">الترتيب</label>
                                            <input
                                                type="number"
                                                value={categoryForm.order}
                                                onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                                                className="admin-input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الحالة</label>
                                        <select
                                            value={categoryForm.status}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as 'active' | 'inactive' })}
                                            className="admin-input"
                                        >
                                            <option value="active">نشط</option>
                                            <option value="inactive">غير نشط</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSaveCategory}
                                        disabled={saving || !categoryForm.name}
                                        className="flex-1 admin-button flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        حفظ
                                    </button>
                                    <button
                                        onClick={resetCategoryForm}
                                        className="flex-1 py-3 border border-tastia-secondary/50 rounded-lg hover:bg-tastia-primary/20 transition-all"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Categories List */}
                    <div className="space-y-3">
                        {categories.length === 0 ? (
                            <div className="text-center py-12 text-tastia-cream/60">
                                <p>لا توجد تصنيفات بعد</p>
                                <button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="mt-4 text-tastia-secondary hover:underline"
                                >
                                    أضف أول تصنيف
                                </button>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="admin-card"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                                style={{ backgroundColor: category.color }}
                                            >
                                                {category.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{category.name}</h3>
                                                {category.nameEn && (
                                                    <p className="text-tastia-cream/60 text-sm">{category.nameEn}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${category.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {category.status === 'active' ? 'نشط' : 'غير نشط'}
                                            </span>
                                            <button
                                                onClick={() => editCategory(category)}
                                                className="p-2 hover:bg-tastia-primary/20 rounded-lg transition-all"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Items Section */}
            {activeTab === 'items' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">العناصر</h2>
                        <button
                            onClick={() => setShowItemForm(true)}
                            className="flex items-center gap-2 bg-tastia-secondary px-4 py-2 rounded-lg hover:brightness-110 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة عنصر
                        </button>
                    </div>

                    {/* Item Form Modal */}
                    {showItemForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-tastia-dark border border-tastia-secondary/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">
                                        {editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
                                    </h3>
                                    <button onClick={resetItemForm} className="text-tastia-cream/60 hover:text-tastia-cream">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الاسم بالعربية *</label>
                                        <input
                                            type="text"
                                            value={itemForm.name}
                                            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                            className="admin-input"
                                            placeholder="مثال: سلطة سيزر"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الاسم بالإنجليزية</label>
                                        <input
                                            type="text"
                                            value={itemForm.nameEn}
                                            onChange={(e) => setItemForm({ ...itemForm, nameEn: e.target.value })}
                                            className="admin-input"
                                            placeholder="Caesar Salad"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">التصنيف *</label>
                                        <select
                                            value={itemForm.categoryId}
                                            onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                                            className="admin-input"
                                        >
                                            <option value="">اختر التصنيف</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الوصف</label>
                                        <textarea
                                            value={itemForm.description}
                                            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                            className="admin-input min-h-[80px]"
                                            placeholder="وصف العنصر..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">السعر (ر.س) *</label>
                                            <input
                                                type="number"
                                                value={itemForm.price}
                                                onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                                                className="admin-input"
                                                min="0"
                                                step="0.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">سعر الخصم</label>
                                            <input
                                                type="number"
                                                value={itemForm.discountPrice}
                                                onChange={(e) => setItemForm({ ...itemForm, discountPrice: parseFloat(e.target.value) || 0 })}
                                                className="admin-input"
                                                min="0"
                                                step="0.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                                        <input
                                            type="text"
                                            value={itemForm.image}
                                            onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                                            className="admin-input"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">السعرات الحرارية</label>
                                            <input
                                                type="number"
                                                value={itemForm.calories}
                                                onChange={(e) => setItemForm({ ...itemForm, calories: parseInt(e.target.value) || 0 })}
                                                className="admin-input"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">وقت التحضير (دقيقة)</label>
                                            <input
                                                type="number"
                                                value={itemForm.preparationTime}
                                                onChange={(e) => setItemForm({ ...itemForm, preparationTime: parseInt(e.target.value) || 0 })}
                                                className="admin-input"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الحالة</label>
                                        <select
                                            value={itemForm.status}
                                            onChange={(e) => setItemForm({ ...itemForm, status: e.target.value as any })}
                                            className="admin-input"
                                        >
                                            <option value="active">متاح</option>
                                            <option value="inactive">غير متاح</option>
                                            <option value="out_of_stock">نفذ من المخزون</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSaveItem}
                                        disabled={saving || !itemForm.name || !itemForm.categoryId || itemForm.price <= 0}
                                        className="flex-1 admin-button flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        حفظ
                                    </button>
                                    <button
                                        onClick={resetItemForm}
                                        className="flex-1 py-3 border border-tastia-secondary/50 rounded-lg hover:bg-tastia-primary/20 transition-all"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-3">
                        {menuItems.length === 0 ? (
                            <div className="text-center py-12 text-tastia-cream/60">
                                <p>لا توجد عناصر بعد</p>
                                <button
                                    onClick={() => setShowItemForm(true)}
                                    className="mt-4 text-tastia-secondary hover:underline"
                                >
                                    أضف أول عنصر
                                </button>
                            </div>
                        ) : (
                            menuItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="admin-card"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-tastia-primary">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-tastia-secondary font-bold">{item.price} ر.س</p>
                                                <p className="text-tastia-cream/60 text-xs">
                                                    {categories.find(c => c._id === item.categoryId)?.name || 'غير مصنف'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : item.status === 'out_of_stock'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {item.status === 'active' ? 'متاح' : item.status === 'out_of_stock' ? 'نفذ' : 'غير متاح'}
                                            </span>
                                            <button
                                                onClick={() => editItem(item)}
                                                className="p-2 hover:bg-tastia-primary/20 rounded-lg transition-all"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
