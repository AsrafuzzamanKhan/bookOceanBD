import { useState } from "react"
import useBookData from "../../hooks/useBookData"
import BookCard from "../BookCard/BookCard"
import CategoryNav from "../CategoryNav/CategoryNav"
import Pagination from "../Pagination/Pagination"

const BOOKS_PER_PAGE = 20;

const Books = () => {
    const [booksData] = useBookData()
    const [currentPage, setCurrentPage] = useState(1)
    const availableBooks = booksData.filter(item => item.available === "true")
    const unavailableBooks = booksData.filter(item => item.available === "false")
    const allBooks = [...availableBooks, ...unavailableBooks]

    // only render one page worth of book cards (and their images) at a time
    // instead of mounting every book in the catalog
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
    const currentBooks = allBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE)

    return (
        <section className="mb-4 pt-[6rem] md:pt-28 lg:pt-24 min-h-screen">

            <main className="container mx-auto">
                <div className="flex gap-x-[30px] ">

                    {/* category nav  */}
                    <CategoryNav sticky />

                    <div className="w-full px-1 lg:px-0 py-8 lg:py-0">

                        {/* get books by category  */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-[8px] md:gap-[20px] w-full px-[2vw] md:px-0">

                            {currentBooks.map((book, i) => {
                                return <BookCard key={i} book={book}>
                                </BookCard>

                            })}

                        </div>

                        {/* pagination */}
                        <Pagination
                            totalPosts={allBooks.length}
                            postsPerPage={BOOKS_PER_PAGE}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />

                    </div>

                </div>

            </main>

        </section>
    )
}

export default Books
