import FadeIn from "../../../Animation/FadeIn";
import useBookData from "../../../hooks/useBookData";
import BookSlider from "../../BookSlider/BookSlider";
import SectionHeader from "../../Shared/SectionHeader/SectionHeader";


const RamadanSpecial = () => {
    const [booksData] = useBookData();
    // console.log(booksData);
    const IslamicBook = booksData.filter(item => item.category === 'islamic')
    const availableBooks = IslamicBook.filter(item => item.available === "true")
    // const sliceData = availableBooks.slice(0, 10)
    // console.log(sliceData.length)

    if (availableBooks.length === 0) return null;

    return (

        <section className="py-10">
            <div className='container mx-auto px-4 lg:px-0'>
                <FadeIn delay={0.1} direction='down'  >
                    {/* was hardcoded "Ramadan Special Offers" year-round regardless
                        of season - swapped for an evergreen title that still
                        reads correctly outside Ramadan; same underlying islamic
                        category filter, no data change */}
                    <SectionHeader title="Islamic Books Collection" subtitle="Quran, Hadith, and Islamic literature" viewAllTo="/books/islamic" />
                    <BookSlider data={availableBooks}></BookSlider>
                </FadeIn>
            </div>
        </section>

    );
};

export default RamadanSpecial;
