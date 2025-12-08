"use client";

export const MenuPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-tastia-dark p-4 animate-pulse">
            {/* Header Skeleton */}
            <div className="w-full h-56 bg-tastia-primary/30 rounded-2xl mb-6" />

            {/* Search Skeleton */}
            <div className="max-w-md mx-auto h-12 bg-tastia-primary/20 rounded-2xl mb-6" />

            {/* Categories Skeleton */}
            <div className="flex gap-4 overflow-hidden mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0">
                        <div className="w-20 h-20 bg-tastia-primary/30 rounded-full" />
                        <div className="w-16 h-3 bg-tastia-primary/20 rounded mt-2 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Menu Items Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-tastia-primary/20 rounded-3xl p-5 h-48" />
                ))}
            </div>
        </div>
    );
};

export const SkeletonLoader = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-tastia-primary/20 rounded-lg h-32 w-full"></div>
        </div>
    );
};
