import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";
import GoogleAds from "../../GoogleAds/GoogleAds";
// import GoogleAds from "../../GoogleAds/GoogleAds";

const Trending = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.best === "true")
    const availableBooks = newProduct.filter(item => item.available === "true")
    const sliceData = availableBooks.slice(0, 10);
    // console.log('slice', sliceItem);
    return (
        <section className='container mx-auto px-4 lg:px-0'>
            <div className='lg:px-0 pb-4'>
                <FadeIn delay={0.15} direction='up'  >
                    <h1 className='text-xl md:text-2xl font-semibold  text-center lg:text-left mb-5 dark:text-white'>Best Selling Books</h1>
                    <BookSlider data={sliceData}></BookSlider>
                </FadeIn>
            </div>
            {/* <div className="flex gap-4 px-4 lg:px-0">
                <GoogleAds dataAdSlot="3004054082" />
                <GoogleAds dataAdSlot="5919723972" />
            </div> */}

        </section>
    );
};

export default Trending;