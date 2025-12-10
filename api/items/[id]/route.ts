import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { cache } from '@/lib/cache';

// GET single item
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const item = await MenuItem.findById(params.id).lean();

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'العنصر غير موجود' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// PUT update item
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const item = await MenuItem.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'العنصر غير موجود' },
                { status: 404 }
            );
        }

        cache.clear();

        return NextResponse.json(
            { success: true, data: item },
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

// DELETE item
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const item = await MenuItem.findByIdAndDelete(params.id);

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'العنصر غير موجود' },
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
