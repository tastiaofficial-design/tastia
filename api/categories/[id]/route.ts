import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { cache } from '@/lib/cache';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const category = await Category.findById(params.id).lean();

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'التصنيف غير موجود' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const category = await Category.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'التصنيف غير موجود' },
                { status: 404 }
            );
        }

        cache.clear();

        return NextResponse.json(
            { success: true, data: category },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const category = await Category.findByIdAndDelete(params.id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'التصنيف غير موجود' },
                { status: 404 }
            );
        }

        cache.clear();

        return NextResponse.json(
            { success: true, data: {} },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
