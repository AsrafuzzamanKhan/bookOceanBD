import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";


const RamadanSpecial = () => {
    const [booksData] = useBookData();
    // console.log(booksData);
    const IslamicBook = booksData.filter(item => item.category === 'islamic')
    const availableBooks = IslamicBook.filter(item => item.available === "true")
    // const sliceData = availableBooks.slice(0, 10)
    // console.log(sliceData.length)
    return (

        <section className='container mx-auto px-4 lg:px-0'>
            <FadeIn delay={0.1} direction='down'  >
                <div className="w-full">
                    <h1 className='text-xl md:text-2xl tracking-wide text-center xl:text-left mb-5 font-semibold dark:text-white'>Ramadan Special Offers</h1>
                    <BookSlider data={availableBooks}></BookSlider>
                </div>
            </FadeIn>
        </section>

    );
};

export default RamadanSpecial;