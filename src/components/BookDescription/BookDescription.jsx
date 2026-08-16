import { useParams } from "react-router-dom"
import useBookData from "../../hooks/useBookData";

const coverLabels = {
    hardcover: 'Hardcover',
    paperback: 'Paperback',
    'leather bound': 'Leather Bound',
};

const BookDescription = () => {
    const { id } = useParams()
    const [booksData] = useBookData()
    const book = booksData?.find(pd => pd._id === id)

    if (!book) return null;

    const specs = [
        ['Title', book.name],
        ['Author', book.author],
        ['Language', book.language],
        ['Publisher', book.publisher],
        ['Cover', coverLabels[book.cover] || book.cover],
        ['Pages', book.page && `${book.page} Pages`],
        ['ISBN-10', book.isbn10],
        ['ISBN-13', book.isbn13],
        ['Item Weight', book.itemWeight],
        ['Dimensions', book.dimensions],
    ].filter(([, value]) => value);

    return (
        <section className='px-[2vw] lg:px-0 mt-8'>
            {/* description  */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-0 rounded-2xl shadow-sm p-6 md:p-8 mb-6">
                <h3 className="text-lg font-bold mb-3">Description</h3>
                <p className="whitespace-normal text-sm md:text-[15px] tracking-wide leading-7 text-gray-600 dark:text-gray-300">
                    {book.description}
                </p>
            </div>

            {/* details  */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-0 rounded-2xl shadow-sm p-6 md:p-8">
                <h1 className='text-lg font-bold mb-4'>Book Details</h1>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    {specs.map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                            <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
                            <dd className="text-sm font-medium text-right">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default BookDescription
