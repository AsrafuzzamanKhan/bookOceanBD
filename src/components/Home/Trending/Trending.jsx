import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const Trending = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.isTrending === true)
    const sliceData = newProduct.slice(0, 10);
    // console.log('slice', sliceItem);
    return (
        <div className='my-16'>
            <div className='container mx-auto'>
                <h2 className='text-2xl text-center xl:text-left mb-5 font-semibold'>Trending Books</h2>
                <BookSlider data={sliceData}></BookSlider>
            </div>


        </div>
    );
};

export default Trending;