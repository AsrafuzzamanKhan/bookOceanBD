import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Windowed page numbers with ellipsis - always includes the first page, the
// last page, and a small range around the current page. Without this, a
// listing with 60+ pages (e.g. the full book catalog) would render 60+
// buttons in a single row with nowhere sane to put them, especially on
// mobile.
function getPageNumbers(currentPage, totalPages, delta = 1) {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            range.push(i);
        }
    }

    const withDots = [];
    let last;
    range.forEach((page) => {
        if (last !== undefined) {
            if (page - last === 2) {
                withDots.push(last + 1);
            } else if (page - last > 2) {
                withDots.push('...');
            }
        }
        withDots.push(page);
        last = page;
    });
    return withDots;
}

const BASE_BTN = 'min-w-[36px] h-9 px-2 rounded-md text-sm font-medium duration-200 flex items-center justify-center';
const INACTIVE_BTN = 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700';
const ACTIVE_BTN = 'bg-blue-500 text-white border border-blue-500';

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
    const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
    if (totalPages <= 1) return null;

    const goTo = (page) => {
        const clamped = Math.min(Math.max(page, 1), totalPages);
        if (clamped === currentPage) return;
        setCurrentPage(clamped);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 my-10 flex-wrap">
            <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`${BASE_BTN} ${INACTIVE_BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                <FaChevronLeft size={12} />
            </button>

            {/* mobile: collapse the page-number list to a simple counter so it
                always fits, regardless of how many pages there are */}
            <span className="sm:hidden text-sm text-gray-600 dark:text-gray-300 px-2 whitespace-nowrap">
                Page {currentPage} of {totalPages}
            </span>

            {/* tablet/desktop: full windowed page numbers */}
            <div className="hidden sm:flex items-center gap-2">
                {pageNumbers.map((page, index) =>
                    page === '...' ? (
                        <span key={`dots-${index}`} className="px-1 text-gray-400 select-none">…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goTo(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                            className={`${BASE_BTN} ${currentPage === page ? ACTIVE_BTN : INACTIVE_BTN}`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`${BASE_BTN} ${INACTIVE_BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                <FaChevronRight size={12} />
            </button>
        </nav>
    );
};

export default Pagination;
