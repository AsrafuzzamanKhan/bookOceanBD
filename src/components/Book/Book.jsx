import { useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import BookCard from "../BookCard/BookCard";
import CategoryNav from "../CategoryNav/CategoryNav";
import FadeIn from "../../Animation/FadeIn";
import { Helmet } from "react-helmet-async";


const Books = () => {
    const [booksData] = useBookData()

    const { category } = useParams()
    console.log('category', category)

    // Define the category you want to filter by
    const selectedCategory = category;
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === selectedCategory);


    const { author } = useParams()
    console.log('author', author)
    const uniqueAuthor = [...new Set(booksData.map(item => item.author))];
    console.log('total author:', uniqueAuthor.length)

    // Define the category you want to filter by
    const selectedAuthor = author;
    // Use the filter method to get products of the selected category
    const filteredAuthor = booksData.filter(item => item.author === selectedAuthor);

    return (
        <div className="mb-[30px] pt-28 md:pt-28 lg:pt-24 min-h-screen">

            {
                selectedAuthor && <Helmet>
                    <title>Author - {selectedAuthor}'s books</title>
                </Helmet>
            }
            {
                selectedCategory && <Helmet>
                    <title>Category - {selectedCategory} books</title>
                </Helmet>
            }

            <div className="container mx-auto">
                <div className="flex gap-x-[30px]">
                    {/* category nav  */}
                    <CategoryNav />

                    <main className="w-full px-1 lg:px-0">
                        <FadeIn delay={0.4} direction='down' >
                            {/* title  */}

                            <h1 className="my-4 text-center capitalize text-xl lg:text-left dark:text-white font-semibold">

                                <div><span className="text-blue-400 me-2"> {category}{author}'s</span>Book</div>
                            </h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[8px] md:gap-[20px] w-full px-[2vw] md:px-0">
                                {filteredProducts.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })}

                                {/* get author books  */}
                                {filteredAuthor.map((book, i) => {
                                    return <BookCard key={i} book={book}>
                                    </BookCard>

                                })}

                            </div>
                            {/* product grid   */}

                        </FadeIn>
                    </main>

                    {/* author  */}



                </div>
            </div>
        </div>
    );
};

export default Books;