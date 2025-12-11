import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { cache } from '@/lib/cache';
import { jsonWithCors, optionsResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET single item
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const item = await MenuItem.findById(params.id).lean();

        if (!item) {
            return jsonWithCors(
                { success: false, error: 'العنصر غير موجود' },
                { status: 404 }
            );
        }

        return jsonWithCors({ success: true, data: item });
    } catch (error: any) {
        return jsonWithCors(
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
            return jsonWithCors(
                { success: false, error: 'العنصر غير موجود' },
                { status: 404 }
            );
        }

        cache.clear();

        return jsonWithCors(
            { success: true, data: item },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error: any) {
        return jsonWithCors(
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
            return jsonWithCors(
                { success: false, error: 'العنصر غير موجود' },
                { status: 404 }
            );
        }

        cache.clear();

        return jsonWithCors(
            { success: true, data: {} },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error: any) {
        return jsonWithCors(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// OPTIONS (CORS / preflight)
export function OPTIONS() {
    return optionsResponse();
}
