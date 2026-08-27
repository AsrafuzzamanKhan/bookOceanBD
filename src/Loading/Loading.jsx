// Shown as the Suspense fallback for every lazy-loaded route (see main.jsx) -
// which is exactly what's on screen for that first flash after a hard
// reload/deep link, before the route's JS chunk finishes loading. A content
// shaped skeleton reads as "the page is arriving" far better than a bare
// spinner, and settles the perceived-blank-flash complaint reloads had.
//
// Kept generic (no page-specific shape) since this same component is reused
// both for whole-app first paint (nothing else on screen yet) and for
// nested route swaps inside an already-visible layout (e.g. admin dashboard
// pages) - a book-grid-shaped skeleton reads fine as a neutral "loading"
// placeholder in either context.
const SkeletonCard = () => (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="h-[200px] bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 flex flex-col gap-2">
            <div className="h-2.5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 mt-2" />
        </div>
    </div>
);

const Loading = () => {
    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-[2vw] md:px-4">
                {/* title bar placeholder */}
                <div className="h-6 w-40 sm:w-56 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-6" />

                {/* card grid placeholder */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[30px]">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
