import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";
import GoogleAds from "../../GoogleAds/GoogleAds";

const Trending = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.best === "true")
    const availableBooks = newProduct.filter(item => item.available === "true")
    const sliceData = availableBooks.slice(0, 10);
    // console.log('slice', sliceItem);
    return (
        <section className='container mx-auto mb-12'>
            <div className='px-4 lg:px-0 pb-4'>
                <FadeIn delay={0.8} direction='up'  >
                    <h1 className='text-xl md:text-2xl font-semibold  text-center lg:text-left mb-5 dark:text-white'>Best Seller Books</h1>
                    <BookSlider data={sliceData}></BookSlider>
                </FadeIn>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-[2vw] lg:px-0">
                <GoogleAds dataAdSlot='4781902122' />
                <GoogleAds dataAdSlot='8872657546' />
            </div>
        </section>
    );
};

export default Trending;