import useBookData from "../../hooks/useBookData"
import BookCard from "../BookCard/BookCard"
import CategoryNav from "../CategoryNav/CategoryNav"

const Books = () => {
    const [booksData] = useBookData()
    const availableBooks = booksData.filter(item => item.available === "true")
    const unavailableBooks = booksData.filter(item => item.available === "false")
    return (
        <section className="mb-4 pt-[6rem] md:pt-28 lg:pt-24 min-h-screen">

            <main className="container mx-auto">
                <div className="flex gap-x-[30px] ">

                    {/* category nav  */}
                    <CategoryNav />

                    <div className="w-full px-1 lg:px-0 py-8 lg:py-0">

                        {/* get books by category  */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[8px] md:gap-[20px] w-full px-[2vw] md:px-0">

                            {availableBooks.map((book, i) => {
                                return <BookCard key={i} book={book}>
                                </BookCard>

                            })}
                            {unavailableBooks.map((book, i) => {
                                return <BookCard key={i} book={book}>
                                </BookCard>

                            })}

                        </div>

                    </div>

                </div>

            </main>

        </section>
    )
}

export default Books