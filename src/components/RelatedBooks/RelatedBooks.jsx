import useBookData from "../../hooks/useBookData";
import BookSlider from "../BookSlider/BookSlider";


const RelatedBooks = ({ categoryTitle }) => {
    const [booksData] = useBookData()

    // get product by category title 
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === categoryTitle);

    const sliceData = filteredProducts.slice(1, 20)

    return (
        <div className="my-16">
            <div className="container mx-auto">
                <h2 className="h2 mb-6 text-center lg:text-start dark:text-white">Related Books</h2>
                <BookSlider data={sliceData}></BookSlider>
            </div>
        </div>
    );
};

export default RelatedBooks;