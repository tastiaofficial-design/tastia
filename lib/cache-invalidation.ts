import { cache } from './cache';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Cache invalidation utilities
 */
export const CacheInvalidation = {
    // Invalidate all category-related caches
    categories: () => {
        cache.clear();
        try {
            revalidatePath('/');
            revalidatePath('/menu');
            revalidateTag('categories');
        } catch (e) {
            console.warn('Failed to revalidate paths:', e);
        }
    },

    // Invalidate all item-related caches
    items: () => {
        cache.clear();
        try {
            revalidatePath('/');
            revalidatePath('/menu');
            revalidateTag('items');
        } catch (e) {
            console.warn('Failed to revalidate paths:', e);
        }
    },

    // Invalidate everything
    all: () => {
        cache.clear();
        try {
            revalidatePath('/');
            revalidatePath('/menu');
            revalidatePath('/admin');
            revalidateTag('categories');
            revalidateTag('items');
        } catch (e) {
            console.warn('Failed to revalidate paths:', e);
        }
    },
};

/**
 * Get cache-control headers for public API responses
 */
export function getCacheHeaders(maxAge: number = 300): Record<string, string> {
    return {
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    };
}

/**
 * Get no-cache headers for admin/private API responses
 */
export function noCacheHeaders(): Record<string, string> {
    return {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
    };
}
