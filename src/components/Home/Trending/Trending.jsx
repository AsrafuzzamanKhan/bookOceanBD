import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const Trending = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.best === "true")
    const sliceData = newProduct.slice(0, 10);
    // console.log('slice', sliceItem);
    return (
        <div className='my-16'>
            <div className='container mx-auto px-4 lg:px-0'>
                <FadeIn delay={0.6} direction='up'  >
                    <h2 className='text-2xl text-center xl:text-left mb-5 font-semibold dark:text-white'>Best Seller Books</h2>
                    <BookSlider data={sliceData}></BookSlider>
                </FadeIn>
            </div>


        </div>
    );
};

export default Trending;