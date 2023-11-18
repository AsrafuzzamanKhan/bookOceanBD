import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const LatestBook = () => {
    const [booksData] = useBookData();
    console.log(booksData);
    const newProduct = booksData.filter(item => item.newBook === 'true')
    const sliceData = newProduct.slice(1, 10)
    // console.log(sliceData.length)
    return (
        <div className='my-16'>
            <div className='container mx-auto px-4 lg:px-0'>
                <div className="w-full">
                    <h2 className='text-2xl text-center xl:text-left mb-5 font-semibold'>Latest Books</h2>

                    <BookSlider data={sliceData}></BookSlider>
                </div>
            </div>
        </div>
    );
};

export default LatestBook;