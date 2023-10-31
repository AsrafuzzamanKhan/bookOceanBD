
import { useLocation } from 'react-router-dom';
import useBookData from '../../hooks/useBookData';
import BookCard from '../BookCard/BookCard';
import CategoryNav from '../CategoryNav/CategoryNav';

const SearchBook = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('query')
    const [booksData] = useBookData()
    console.log('search', searchTerm)
    // Filter the data array based on the search term
    const filteredResults = booksData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div className="mb-[30px] pt-40 md:pt-40 lg:pt-28">
            <div className="container mx-auto px-2">
                <div className="flex gap-x-[30px]">
                    {/* category nav  */}
                    <CategoryNav></CategoryNav>
                    <div>
                        {/* title  */}
                        <div className="py-3 uppercase text-center lg:text-left text-xl">
                            {filteredResults?.length > 0 ? `${filteredResults.length} results for ${searchTerm}` : `no result found for ${searchTerm} `}
                        </div>
                        {/* products grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:grid-[30px]">
                            {
                                filteredResults.map((book, i) => {
                                    return <BookCard key={i}
                                        book={book}
                                    ></BookCard>
                                })
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchBook;