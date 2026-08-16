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

    // stock is looked up live from the book, not stored on the cart item -
    // it's the current source of truth and can change after the item was
    // added (someone else bought the last copy, admin restocked, etc)
    const book = booksData?.find(b => b._id === item.bookId);
    const stock = book?.quantity ?? 1;
    const qty = item.quantity || 1;

    // remover from cart
    const handleCartRemove = item => {
        fetch(`https://book-ocean-bd-server.vercel.app/carts/${item._id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    refetch();

                    showSuccessToast("Removed!", "Book has been removed from cart.")
                }

            })

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
        <div className="flex gap-x-3 sm:gap-x-4">
            <Link
                to={bookLink}
                className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex-shrink-0 rounded overflow-hidden bg-white/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            {/* title and remove icon  */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2 mb-2">
                    <div className="flex flex-col min-w-0">
                        <Link className="text-base sm:text-xl line-clamp-2 break-words"
                            to={bookLink}
                        > {item.name}

                        </Link>
                        <Link
                            className="text-sm sm:text-base truncate"
                            to={bookLink}
                        > by <span className="text-blue-400"> {item.author}</span>

                        </Link>
                    </div>
                    <button
                        onClick={() => handleCartRemove(item)}
                        aria-label="Remove from cart"
                        className="shrink-0 cursor-pointer text-[22px] sm:text-[24px] p-1 -m-1 hover:text-red-400 transition-all">
                        <IoClose />
                    </button>
                </div>
                <div className="flex items-center gap-x-3 flex-wrap">
                    {/* price  */}
                    {item.price != null && item.price !== item.discountPrice && (
                        <span className="text-xs sm:text-sm line-through text-orange-400">
                            ৳{item.price}
                        </span>
                    )}
                    {/* discount  */}
                    <span className="text-sm sm:text-base font-bold text-blue-400">
                        ৳{item.discountPrice}
                        {qty > 1 && <span className="text-gray-400 font-normal"> &times; {qty} = ৳{item.discountPrice * qty}</span>}
                    </span>

                    {/* quantity stepper - capped at the book's current stock */}
                    <div className="flex items-center gap-x-2 border border-white/20 rounded px-1.5 py-0.5">
                        <button
                            onClick={() => updateQuantity(qty - 1)}
                            disabled={qty <= 1 || updating}
                            aria-label="Decrease quantity"
                            className="p-1 disabled:opacity-30 hover:text-blue-400 transition-all">
                            <FaMinus size={10} />
                        </button>
                        <span className="text-sm w-4 text-center">{qty}</span>
                        <button
                            onClick={() => updateQuantity(qty + 1)}
                            disabled={qty >= stock || updating}
                            aria-label="Increase quantity"
                            className="p-1 disabled:opacity-30 hover:text-blue-400 transition-all">
                            <FaPlus size={10} />
                        </button>
                    </div>
                    {qty >= stock && (
                        <span className="text-[11px] text-orange-400">Max in stock</span>
                    )}
                </div>

            </div>


        </div>
    );
};

export default CartItem;
