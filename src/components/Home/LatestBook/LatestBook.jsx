import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const LatestBook = () => {
    const [booksData] = useBookData();
    // console.log(booksData);
    const newProduct = booksData.filter(item => item.newBook === 'true')
    const availableBooks = newProduct.filter(item => item.available === "true")
    const sliceData = availableBooks.slice(0, 10)
    // console.log(sliceData.length)
    return (
        <section className=''>
            <div className='container mx-auto px-4 lg:px-0'>
                <FadeIn delay={0.4} direction='up'  >
                    <div className="w-full mb-8">
                        <h1 className='text-xl md:text-2xl  text-center xl:text-left mb-5 font-semibold dark:text-white'>Latest Books</h1>

                        <BookSlider data={sliceData}></BookSlider>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default LatestBook;