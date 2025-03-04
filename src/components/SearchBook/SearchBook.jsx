import { useLocation } from 'react-router-dom';
import useBookData from '../../hooks/useBookData';
import BookCard from '../BookCard/BookCard';
import CategoryNav from '../CategoryNav/CategoryNav';
import { FaAmazon } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination';

// import Loading from '../../Loading/Loading';

const SearchBook = () => {
    const [booksData] = useBookData()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('query')

    // console.log('search', searchTerm)
    // Filter the data array based on the search term
    const filteredResults = booksData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    console.log(filteredResults.length);

    const availableBooks = filteredResults.filter(item => item.available === "true")
    const unavailableBooks = filteredResults.filter(item => item.available === "false")


    // const filteredResults = booksData.filter((item) =>
    //     item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // const filteredAuthorResults = booksData.filter((item) =>
    //     item.author.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div className="mb-[30px] pt-28 md:pt-28 lg:pt-24  min-h-screen">
            <div className=" container mx-auto">
                <div className="flex gap-x-[30px] ">
                    {/* category nav  */}
                    <CategoryNav></CategoryNav>

                    <div className='flex flex-col w-full '>
                        <div>
                            {/* title  */}
                            <div className="flex flex-col my-4 lg:my-0 lg:mb-4 gap-y-8 text-center font-semibold lg:text-left text-[16px] dark:text-white px-[2vw] lg:px-0">
                                <div className='capitalize bg-gray-200 dark:text-black  md:px-2 rounded py-2'>
                                    {
                                        filteredResults?.length > 0
                                            ?
                                            `${filteredResults.length} results for "${searchTerm}"`
                                            :
                                            `no result found for " ${searchTerm} "`
                                    }
                                </div>
                                {/* pre order  */}
                                {
                                    filteredResults?.length > 0 ? `` : <div className='flex'>
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
                                    availableBooks.map((book, i) => {
                                        return <BookCard key={i}
                                            book={book}
                                        ></BookCard>
                                    })
                                }
                                {
                                    unavailableBooks.map((book, i) => {
                                        return <BookCard key={i}
                                            book={book}
                                        ></BookCard>
                                    })
                                }
                                {/* {
                                    filteredResults.map((book, i) => {
                                        return <BookCard key={i}
                                            book={book}
                                        ></BookCard>
                                    })
                                } */}
                            </div>
                        </div>



                        <Pagination />
                    </div>


                </div>
            </div>
        </div>
    );
};

export default SearchBook;