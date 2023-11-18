import useBookData from "../../hooks/useBookData";
import BookSlider from "../BookSlider/BookSlider";


const RelatedBooks = ({ categoryTitle }) => {
    const [booksData] = useBookData()

    // get product by category title 
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === categoryTitle);
    return (
        <div className="my-16">
            <div className="container mx-auto">
                <h2 className="h2 mb-6 text-center lg:text-start">Related Books</h2>
                <BookSlider data={filteredProducts}></BookSlider>
            </div>
        </div>
    );
};

export default RelatedBooks;