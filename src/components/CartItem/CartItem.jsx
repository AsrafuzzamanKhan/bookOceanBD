import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

import useCart from "../../hooks/useCart";
import useBookData from "../../hooks/useBookData";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showSuccessToast, showErrorToast } from "../../utils/toast";


const CartItem = ({ item }) => {
    const [, refetch] = useCart();
    const [axiosSecure] = useAxiosSecure();
    const [booksData] = useBookData();
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // stock is looked up live from the book, not stored on the cart item -
    // it's the current source of truth and can change after the item was
    // added (someone else bought the last copy, admin restocked, etc)
    const book = booksData?.find(b => b._id === item.bookId);
    const stock = book?.quantity ?? 1;
    const qty = item.quantity || 1;

    // remove from cart - was a bare fetch() with no auth header; the server
    // route now requires login + ownership, matching updateQuantity below
    const handleCartRemove = item => {
        setRemoving(true);
        axiosSecure.delete(`/carts/${item._id}`)
            .then(res => {
                if (res.data.deletedCount > 0) {
                    refetch();
                    showSuccessToast("Removed!", "Book has been removed from cart.")
                }
            })
            .catch(err => showErrorToast('Failed to remove item', err.response?.data?.message || err.message))
            .finally(() => setRemoving(false))
    }

    const updateQuantity = (newQty) => {
        if (newQty < 1 || newQty > stock || updating) return;
        setUpdating(true);
        axiosSecure.patch(`/carts/${item._id}`, { quantity: newQty })
            .then(() => refetch())
            .catch(err => showErrorToast('Failed to update quantity', err.response?.data?.message || err.message))
            .finally(() => setUpdating(false));
    };

    // route is /book/:name/:id (see main.jsx) - a link with only the id
    // 404s, which is what was happening here before
    const bookLink = `/book/${(item.name || "").replace(/\s/g, "_")}/${item.bookId}`;
    return (
        <div className={`flex gap-x-3 sm:gap-x-4 py-4 first:pt-5 transition-opacity ${removing ? 'opacity-40' : ''}`}>
            {/* cover - object-contain (not cover) so portrait book covers show
                whole, same convention as BookCard, instead of getting cropped
                by a square box */}
            <Link
                to={bookLink}
                className="w-16 h-20 sm:w-[72px] sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
            </Link>
            {/* title and remove icon  */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-x-2">
                    <div className="flex flex-col min-w-0">
                        <Link className="text-sm sm:text-base font-semibold line-clamp-2 break-words hover:text-blue-500 transition-colors"
                            to={bookLink}
                        >{item.name}</Link>
                        <Link
                            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5"
                            to={bookLink}
                        >by <span className="text-blue-500">{item.author}</span></Link>
                    </div>
                    <button
                        onClick={() => handleCartRemove(item)}
                        disabled={removing}
                        aria-label="Remove from cart"
                        className="shrink-0 cursor-pointer text-lg p-1 -m-1 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors disabled:opacity-50">
                        <IoClose />
                    </button>
                </div>

                <div className="flex items-end justify-between gap-x-2 mt-auto pt-2 flex-wrap">
                    {/* price  */}
                    <div className="flex flex-col">
                        {item.price != null && item.price !== item.discountPrice && (
                            <span className="text-[11px] line-through text-orange-400">
                                &#x09F3;{item.price}
                            </span>
                        )}
                        <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                            &#x09F3;{item.discountPrice * qty}
                        </span>
                        {qty > 1 && (
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">&#x09F3;{item.discountPrice} each</span>
                        )}
                    </div>

                    {/* quantity stepper - capped at the book's current stock */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-x-3 border border-gray-200 dark:border-gray-700 rounded-full px-1 py-1">
                            <button
                                onClick={() => updateQuantity(qty - 1)}
                                disabled={qty <= 1 || updating}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <FaMinus size={9} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center tabular-nums">{qty}</span>
                            <button
                                onClick={() => updateQuantity(qty + 1)}
                                disabled={qty >= stock || updating}
                                aria-label="Increase quantity"
                                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <FaPlus size={9} />
                            </button>
                        </div>
                        {qty >= stock && (
                            <span className="text-[11px] text-orange-400">Max in stock</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
