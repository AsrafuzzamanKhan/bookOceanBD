import { useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import CategoryNav from "../CategoryNav/CategoryNav";
import FadeIn from "../../Animation/FadeIn";
import { Helmet } from "react-helmet-async";


const Books = () => {
    const { category } = useParams()
    console.log(category)
    const [booksData] = useBookData()
    // Define the category you want to filter by
    const selectedCategory = category;
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === selectedCategory);
    return (
        <div className="mb-[30px] pt-36 md:pt-36 lg:pt-0 xl:pt-28 ">
            {/* <div className="mb-16 pt-40 md:pt-28 lg:pt-28 "> */}
            {/* xl:pt-28   md:pt-40 */}
            <Helmet>
                <title>Book Ocean BD || Books</title>
            </Helmet>

            <div className="container mx-auto px-1">
                <div className="flex gap-x-[30px]">
                    {/* category nav  */}
                    <CategoryNav />


                    <main className="w-full">
                        {/* title  */}
                        <div className="py-4 text-center uppercase text-xl lg:text-left dark:text-white">{category} Book</div>
                        {/* product grid   */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[5px] md:gap-[30px]">
                            {filteredProducts.map((book, i) => {
                                return <BookCard key={i} book={book}>


                                </BookCard>

                            })}
                        </div>
                    </main>


                </div>
            </div>
        </div>
    );
};

export default Books;