import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";
import SectionHeader from "../../Shared/SectionHeader/SectionHeader";
import GoogleAds from "../../GoogleAds/GoogleAds";
// import GoogleAds from "../../GoogleAds/GoogleAds";

const Trending = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.best === "true")
    const availableBooks = newProduct.filter(item => item.available === "true")
    const sliceData = availableBooks.slice(0, 10);
    // console.log('slice', sliceItem);
    return (
        <section className="bg-gray-50 dark:bg-gray-950/40 py-10">
            <div className='container mx-auto px-4 lg:px-0'>
                <FadeIn delay={0.15} direction='up'  >
                    <SectionHeader title="Best Selling Books" subtitle="Reader favorites, restocked often" viewAllTo="/books" />
                    <BookSlider data={sliceData}></BookSlider>
                </FadeIn>
                {/* <div className="flex gap-4 px-4 lg:px-0 mt-6">
                    <GoogleAds dataAdSlot="3004054082" />
                    <GoogleAds dataAdSlot="5919723972" />
                </div> */}
            </div>
        </section>
    );
};

export default Trending;
