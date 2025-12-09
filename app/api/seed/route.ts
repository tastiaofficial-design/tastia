import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { cache } from '@/lib/cache';

// Initial Tastia categories
const initialCategories = [
    { name: 'السلطات', nameEn: 'Salads', color: '#B94A24', order: 1, status: 'active' },
    { name: 'الشوربات', nameEn: 'Soups', color: '#B94A24', order: 2, status: 'active' },
    { name: 'المقبلات', nameEn: 'Appetizers', color: '#B94A24', order: 3, status: 'active' },
    { name: 'أطباق رئيسية دجاج', nameEn: 'Chicken Main Dishes', color: '#B94A24', order: 4, status: 'active' },
    { name: 'الباستا', nameEn: 'Pasta', color: '#B94A24', order: 5, status: 'active' },
    { name: 'أطباق رئيسية لحم', nameEn: 'Meat Main Dishes', color: '#B94A24', order: 6, status: 'active' },
    { name: 'أطباق رئيسية أسماك', nameEn: 'Fish Main Dishes', color: '#B94A24', order: 7, status: 'active' },
    { name: 'الحلى', nameEn: 'Desserts', color: '#B94A24', order: 8, status: 'active' },
    { name: 'مشروبات غازية', nameEn: 'Soft Drinks', color: '#B94A24', order: 9, status: 'active' },
    { name: 'مياة', nameEn: 'Water', color: '#B94A24', order: 10, status: 'active' },
];

// POST - Seed initial categories
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Check if categories already exist
        const existingCount = await Category.countDocuments();

        // Option to force reseed by adding ?force=true to the URL
        const { searchParams } = new URL(request.url);
        const force = searchParams.get('force') === 'true';

        if (existingCount > 0 && !force) {
            return NextResponse.json({
                success: false,
                message: 'التصنيفات موجودة بالفعل. استخدم ?force=true لإعادة الإضافة',
                existingCount,
            }, { status: 400 });
        }

        // If force is true, delete existing categories first
        if (force && existingCount > 0) {
            await Category.deleteMany({});
        }

        // Insert all categories
        const categories = await Category.insertMany(initialCategories);

        // Clear cache
        cache.clear();

        return NextResponse.json({
            success: true,
            message: 'تم إضافة التصنيفات بنجاح',
            data: categories,
            count: categories.length,
        }, { status: 201 });
    } catch (error: any) {
        console.error('خطأ في إضافة التصنيفات:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET - Check seed status
export async function GET() {
    try {
        await dbConnect();

        const count = await Category.countDocuments();
        const categories = await Category.find().sort({ order: 1 }).lean();

        return NextResponse.json({
            success: true,
            seeded: count > 0,
            count,
            categories,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
