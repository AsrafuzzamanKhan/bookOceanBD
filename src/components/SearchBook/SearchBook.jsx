import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import useBookData from '../../hooks/useBookData';
import BookCard from '../BookCard/BookCard';
import CategoryNav from '../CategoryNav/CategoryNav';
import { FaAmazon, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination';
import { trackPixelEvent } from '../../utils/fbPixel';

// import Loading from '../../Loading/Loading';

const RESULTS_PER_PAGE = 20;

const SearchBook = () => {
    const [booksData] = useBookData()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('query') || ''

    // 1. exact/substring match first - fast and precise for correctly spelled queries
    const exactMatches = useMemo(() => {
        if (!searchTerm) return [];
        const term = searchTerm.toLowerCase();
        return booksData.filter((item) =>
            item.name?.toLowerCase().includes(term) ||
            item.author?.toLowerCase().includes(term) ||
            item.category?.toLowerCase().includes(term));
    }, [booksData, searchTerm]);

    // 2. typo-tolerant fallback, only built/used when the exact search comes up empty
    // (e.g. "Colen Hoover" -> "Colleen Hoover"). threshold 0.4 tolerates a handful of
    // wrong/missing/swapped letters without matching totally unrelated titles.
    const fuse = useMemo(() => new Fuse(booksData, {
        keys: [
            { name: 'name', weight: 0.5 },
            { name: 'author', weight: 0.25 },
            { name: 'category', weight: 0.25 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
    }), [booksData]);

    const fuzzyMatches = useMemo(() => {
        if (!searchTerm || exactMatches.length > 0) return [];
        return fuse.search(searchTerm).slice(0, 24).map((result) => result.item);
    }, [fuse, searchTerm, exactMatches]);

    const isFuzzy = exactMatches.length === 0 && fuzzyMatches.length > 0;
    const filteredResults = exactMatches.length > 0 ? exactMatches : fuzzyMatches;

    const availableBooks = filteredResults.filter(item => item.available === "true")
    const unavailableBooks = filteredResults.filter(item => item.available === "false")
    const allResults = [...availableBooks, ...unavailableBooks]

    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm]);

    // real Search event - fired once per distinct query actually run,
    // instead of on every page load site-wide (see src/utils/fbPixel.js)
    useEffect(() => {
        if (!searchTerm) return;
        trackPixelEvent('Search', { search_string: searchTerm, content_category: 'book' });
    }, [searchTerm]);

    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const currentResults = allResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);

    return (
        <div className="mb-[30px] pt-28 md:pt-28 lg:pt-24  min-h-screen">
            <div className=" container mx-auto">
                <div className="flex gap-x-[30px] ">
                    {/* category nav  */}
                    <CategoryNav sticky></CategoryNav>

                    <div className='flex flex-col w-full '>
                        <div>
                            {/* title  */}
                            <div className="flex flex-col my-4 lg:my-0 lg:mb-4 gap-y-8 text-center font-semibold lg:text-left text-[16px] dark:text-white px-[2vw] lg:px-0">
                                <div className='capitalize bg-gray-200 dark:text-black  md:px-2 rounded py-2'>
                                    {
                                        allResults.length > 0
                                            ? isFuzzy
                                                ? `No exact matches for "${searchTerm}". Showing similar results:`
                                                : `${allResults.length} results for "${searchTerm}"`
                                            : `no result found for " ${searchTerm} "`
                                    }
                                </div>
                                {/* pre order  */}
                                {
                                    allResults.length > 0 ? `` : <div className='flex'>
                                        <div className="flex flex-col mx-auto items-center justify-center gap-4 border dark:border-gray-700 dark:text-white p-8 text-[18px] rounded font-semibold shadow-lg hover:scale-105 hover:duration-300 transition-all">
                                            <FaAmazon size={50} className="text-[#FF9900]" />
                                            <p className="text-black dark:text-white text-center">
                                                Can&apos;t find it? Pre-order any book from Amazon through us.
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-3">
                                                <a
                                                    href="https://m.me/bookoceanbd"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 bg-[#0084FF] hover:bg-[#006fd6] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                                                    onClick={() => trackPixelEvent('Lead', { content_name: searchTerm, content_category: 'pre-order-search-fallback' })}
                                                >
                                                    <FaFacebookMessenger size={16} />
                                                    Message on Facebook
                                                </a>
                                                <a
                                                    href="https://www.instagram.com/bookoceanbd/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity duration-200"
                                                    onClick={() => trackPixelEvent('Lead', { content_name: searchTerm, content_category: 'pre-order-search-fallback' })}
                                                >
                                                    <FaInstagram size={16} />
                                                    Message on Instagram
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                            {/* products grid */}
                            <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[8px] md:grid-[30px] w-full px-[2vw] md:px-0">
                                {
                                    currentResults.map((book, i) => {
                                        return <BookCard key={i}
                                            book={book}
                                        ></BookCard>
                                    })
                                }
                            </div>
                        </div>



                        {allResults.length > RESULTS_PER_PAGE && (
                            <Pagination
                                totalPosts={allResults.length}
                                postsPerPage={RESULTS_PER_PAGE}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default SearchBook;
