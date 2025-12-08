import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { CacheInvalidation, noCacheHeaders } from '@/lib/cache-invalidation';
import { cache, CacheTTL } from '@/lib/cache';

// GET all menu items
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const admin = searchParams.get('admin');
        const isAdmin = admin === 'true';

        const cacheKey = `items:${categoryId || 'all'}`;

        // Admin requests bypass cache
        if (!isAdmin) {
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return NextResponse.json(
                    { success: true, data: cachedData, cached: true },
                    {
                        headers: {
                            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                            'X-Cache-Status': 'HIT'
                        }
                    }
                );
            }
        }

        await dbConnect();

        const query = categoryId ? { categoryId } : {};

        const items = await MenuItem
            .find(query)
            .select('name nameEn description price discountPrice image calories preparationTime categoryId status')
            .sort({ order: 1, createdAt: -1 })
            .lean()
            .exec();

        if (!isAdmin) {
            cache.set(cacheKey, items, CacheTTL.FIVE_MINUTES);
        }

        const headers: Record<string, string> = {};
        if (isAdmin) {
            headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0';
            headers['Pragma'] = 'no-cache';
            headers['Expires'] = '0';
        } else {
            headers['Cache-Control'] = 'public, s-maxage=300, stale-while-revalidate=600';
            headers['X-Cache-Status'] = 'MISS';
        }

        return NextResponse.json(
            { success: true, data: items },
            { headers }
        );
    } catch (error: any) {
        console.error('❌ خطأ في API:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// POST create new item
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const item = await MenuItem.create(body);

        CacheInvalidation.items();

        return NextResponse.json(
            { success: true, data: item },
            { status: 201, headers: noCacheHeaders() }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
