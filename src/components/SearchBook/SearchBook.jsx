import { useLocation } from 'react-router-dom';
import useBookData from '../../hooks/useBookData';
import BookCard from '../BookCard/BookCard';
import CategoryNav from '../CategoryNav/CategoryNav';

const SearchBook = () => {
    const [booksData] = useBookData()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('query')

    console.log('search', searchTerm)
    // Filter the data array based on the search term
    const filteredResults = booksData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));



    // const filteredResults = booksData.filter((item) =>
    //     item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // const filteredAuthorResults = booksData.filter((item) =>
    //     item.author.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
            <div className="container mx-auto px-1 lg:px-0">
                <div className="flex gap-x-[30px] ">
                    {/* category nav  */}
                    <CategoryNav></CategoryNav>
                    <div className='flex flex-col'>
                        <div>
                            {/* title  */}
                            <div className="my-4 capitalize text-center font-semibold lg:text-left text-xl dark:text-white">
                                {filteredResults?.length > 0 ? `${filteredResults.length} results for ${searchTerm}` : `no result found for ${searchTerm} `}
                            </div>
                            {/* products grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:grid-[30px] w-full">
                                {
                                    filteredResults.map((book, i) => {
                                        return <BookCard key={i}
                                            book={book}
                                        ></BookCard>
                                    })
                                }
                            </div>
                        </div>


                        {/* author  */}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchBook;