import { useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import CategoryNav from "../CategoryNav/CategoryNav";


const Books = () => {
    const { category } = useParams()
    console.log(category)
    const [booksData] = useBookData()
    // Define the category you want to filter by
    const selectedCategory = category;
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === selectedCategory);
    return (
        <div className="pt-40 mb-16 lg:pt-28">

            <div className="container mx-auto px-2">
                <div className="flex gap-x-[30px]">
                    {/* category nav  */}
                    <CategoryNav />
                    <main className="w-full">
                        {/* title  */}
                        <div className="py-4 text-center uppercase text-xl lg:text-left">{category} Book</div>
                        {/* product grid   */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[15px] md:gap-[30px]">
                            {filteredProducts.map((book, i) => {
                                return <BookCard key={i} book={book}></BookCard>
                            })}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Books;