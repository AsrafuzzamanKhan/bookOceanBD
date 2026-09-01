import PropTypes from "prop-types";

const coverLabels = {
    hardcover: 'Hardcover',
    paperback: 'Paperback',
    'leather bound': 'Leather Bound',
};

// Takes the book as a prop from BookDetails.jsx rather than fetching its
// own copy - it used to independently re-derive it from the shared
// all-books list (useBookData), but that list no longer carries
// description/language/publisher/isbn/dimensions/etc (see GET /books on
// the server - trimmed down to only what listing/card views need), so this
// component was silently showing a blank description and partial specs
// for every book. BookDetails.jsx already fetches the one full record this
// page needs via GET /books/:id; reusing that here instead of a second,
// incomplete fetch is both the fix and the right shape for it regardless.
const BookDescription = ({ book }) => {
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

BookDescription.propTypes = {
    book: PropTypes.shape({
        name: PropTypes.string,
        author: PropTypes.string,
        language: PropTypes.string,
        publisher: PropTypes.string,
        cover: PropTypes.string,
        page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        isbn10: PropTypes.string,
        isbn13: PropTypes.string,
        itemWeight: PropTypes.string,
        dimensions: PropTypes.string,
        description: PropTypes.string,
    }),
};

export default BookDescription
