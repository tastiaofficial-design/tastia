/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class CacheManager {
    private cache: Map<string, CacheEntry<any>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 300000) { // Default 5 minutes
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        const expiresAt = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { data, expiresAt });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        this.cache.forEach((entry, key) => {
            if (now > entry.expiresAt) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));
    }

    size(): number {
        return this.cache.size;
    }
}

export const cache = new CacheManager();

// Run cleanup every 10 minutes
if (typeof window === 'undefined') {
    setInterval(() => {
        cache.cleanup();
    }, 600000);
}

export const CacheTTL = {
    ONE_MINUTE: 60000,
    FIVE_MINUTES: 300000,
    TEN_MINUTES: 600000,
    THIRTY_MINUTES: 1800000,
    ONE_HOUR: 3600000,
    ONE_DAY: 86400000,
} as const;
