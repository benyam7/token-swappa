export function Shimmer({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
    );
}

export function TokenShimmer() {
    return (
        <div className="flex items-center gap-3 p-3">
            <Shimmer className="w-8 h-8 rounded-full" />
            <div className="flex-1">
                <Shimmer className="h-4 w-16 mb-1" />
                <Shimmer className="h-3 w-24" />
            </div>
            <Shimmer className="h-4 w-20" />
        </div>
    );
}
