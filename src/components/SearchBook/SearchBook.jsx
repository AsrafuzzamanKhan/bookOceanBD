import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import useBookData from '../../hooks/useBookData';
import BookCard from '../BookCard/BookCard';
import CategoryNav from '../CategoryNav/CategoryNav';
import { FaAmazon } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination';

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
                                        <div className="flex flex-col mx-auto items-center justify-center gap-2  border  dark:text-white p-8 text-[18px] rounded font-semibold shadow-lg hover:scale-105 hover:duration-300 transition-all">
                                            <FaAmazon size={50} />
                                            <a href="https://m.me/bookoceanbd" target="_blank" rel="noreferrer" className="  text-[#FF9900] hover:text-[#946b2d] duration-500 flex items-center gap-2">
                                                <span className='text-black dark:text-white'>Inbox us.</span>
                                                Pre-order any book from amazon through us.
                                            </a>
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
