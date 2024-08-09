import useBookData from "../../hooks/useBookData";
import BookSlider from "../BookSlider/BookSlider";
import GoogleAds from "../GoogleAds/GoogleAds";


const RelatedBooks = ({ categoryTitle }) => {
    const [booksData] = useBookData()

    // get product by category title 
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === categoryTitle);

    const sliceData = filteredProducts.slice(0, 20)

    return (
        <section className="">
            <div className="px-[2vw] lg:px-0 py-8">
                <h2 className=" text-xl md:text-2xl mb-6 text-center lg:text-start dark:text-white font-semibold">Related Books</h2>
                <BookSlider data={sliceData}></BookSlider>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 px-[2vw] lg:px-0">
                <GoogleAds dataAdSlot='5919723972' />
                <GoogleAds dataAdSlot='3004054082' />
            </div>
        </section>
    );
};

export default RelatedBooks;