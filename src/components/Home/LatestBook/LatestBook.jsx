import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const LatestBook = () => {
    const [booksData] = useBookData();
    const newProduct = booksData.filter(item => item.isNew === true)
    const sliceData = newProduct.slice(1, 10)
    // console.log(sliceData.length)
    return (
        <div className='mb-16'>

            <div className='container mx-auto'>
                <h2 className='text-xl text-center xl:text-left mb-5 font-semibold'>Latest Books</h2>

                <BookSlider data={sliceData}></BookSlider>
            </div>
        </div>
    );
};

export default LatestBook;