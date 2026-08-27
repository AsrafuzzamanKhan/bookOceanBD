import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState } from "react";


const BookCard = ({ book }) => {
    const { _id, name, author, price, image, thumbnail, available, newBook, category, cover } = book;

    const [isLoaded, setIsLoaded] = useState(false);
    const discount = price * 0.05;
    const discountPrice = parseInt(price - discount)
    const discountPercent = price ? Math.round((discount / price) * 100) : 0;
    const isOutOfStock = available === 'false';

    return (
        <div className="h-full">
            <Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`} >
                <div className="dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-0 w-full h-[380px] rounded-xl shadow-sm hover:shadow-lg relative group overflow-hidden flex flex-col transition-shadow duration-300">

                    {/* badges  */}
                    {newBook === 'true' && (
                        <div className="absolute bg-blue-500 text-white text-[10px] font-bold uppercase top-3 right-3 rounded-full px-2 py-0.5 z-10 shadow-sm">
                            new
                        </div>
                    )}
                    {!isOutOfStock && discountPercent > 0 && (
                        <div className="absolute bg-orange-400 text-white text-[10px] font-bold uppercase top-3 left-3 rounded-full px-2 py-0.5 z-10 shadow-sm">
                            {discountPercent}% off
                        </div>
                    )}

                    {/* image  */}
                    <div className="w-full h-[200px] flex items-center justify-center relative bg-gray-50 dark:bg-gray-900/50">

                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
                                <span className="loading loading-spinner loading-md text-blue-400"></span>
                            </div>
                        )}

                        <img
                            className={`w-28 object-contain transition-all duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"} ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                            src={thumbnail || image}
                            alt={name}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setIsLoaded(true)}
                        />

                        {isOutOfStock && (
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[11px] font-bold uppercase text-center py-1 tracking-wider">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* text  */}
                    <div className="flex flex-col flex-grow gap-y-2 p-4">
                        <div className="flex-grow">
                            <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{category}</h4>
                            <h1 className="text-sm font-semibold line-clamp-2 mt-1 leading-snug capitalize group-hover:text-blue-500 transition-colors" title={name}>
                                {name}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                {cover} • by <span className="text-blue-400 not-italic">{author}</span>
                            </p>
                        </div>

                        {/* price  */}
                        <div className="mt-auto border-t pt-3 dark:border-gray-700">
                            {isOutOfStock ? (
                                <p className="text-sm font-bold text-orange-400 uppercase">Out of Stock</p>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{discountPrice}</span>
                                    <span className="text-[11px] line-through text-gray-400">৳{price}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link >
        </div >
    );
};

BookCard.propTypes = {
    book: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.number,
        image: PropTypes.string,
        thumbnail: PropTypes.string,
        available: PropTypes.string,
        newBook: PropTypes.string,
        category: PropTypes.string,
        cover: PropTypes.string
    })
};
export default BookCard;
