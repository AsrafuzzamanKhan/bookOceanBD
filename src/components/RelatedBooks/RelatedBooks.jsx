import useBookData from "../../hooks/useBookData";
import BookSlider from "../BookSlider/BookSlider";
// import AdSense from 'react-adsense';
import GoogleAds from "../GoogleAds/GoogleAds";

const RelatedBooks = ({ categoryTitle }) => {
    const [booksData] = useBookData()

    // get product by category title 
    // Use the filter method to get products of the selected category
    const filteredProducts = booksData.filter(item => item.category === categoryTitle);

    const sliceData = filteredProducts.slice(0, 20)

    return (
        <section className="px-4 lg:px-0 mt-12">
            <div className="pb-10">
                <h2 className=" text-xl md:text-2xl mb-6 tracking-wide text-center lg:text-start dark:text-white font-semibold">Related Books</h2>
                <BookSlider data={sliceData}></BookSlider>
            </div>
            {/* <AdSense.Google
                client='ca-pub-6281834095701895'
                slot="3004054082"
                style={{ display: 'block' }}
                format='auto'
                responsive='true'
                layoutKey='-gw-1+2a-9x+5c'
            /> */}
            {/* 
            <div className="flex gap-4 px-4 ">
                <GoogleAds dataAdSlot='4781902122' />
                <GoogleAds dataAdSlot='8872657546' />
            </div> */}

        </section>
    );
};

export default RelatedBooks;