import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";
import SectionHeader from "../../Shared/SectionHeader/SectionHeader";


const LatestBook = () => {
    const [booksData] = useBookData();
    // console.log(booksData);
    const newProduct = booksData.filter(item => item.newBook === 'true')
    const availableBooks = newProduct.filter(item => item.available === "true")
    const sliceData = availableBooks.slice(0, 10)
    // console.log(sliceData.length)
    return (

        <section className='py-10'>
            <div className='container mx-auto px-4 lg:px-0'>
                <FadeIn delay={0.1} direction='down'  >
                    <SectionHeader title="Latest Books" subtitle="Freshly added to the catalog" viewAllTo="/books" />
                    <BookSlider data={sliceData}></BookSlider>
                </FadeIn>
            </div>
        </section>

    );
};

export default LatestBook;
