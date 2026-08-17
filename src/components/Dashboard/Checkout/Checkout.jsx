import { Link, useNavigate } from "react-router-dom";
// import CartItem from "../../CartItem/CartItem";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import useBookData from "../../../hooks/useBookData";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import { format } from 'date-fns';
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaTruck, FaUser } from "react-icons/fa";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

const NORMAL_DELIVERY_CHARGE = { dhaka: 80, outside: 100 };
const HEAVY_DELIVERY_CHARGE = { dhaka: 100, outside: 120 };
const HEAVY_ORDER_THRESHOLD_GRAMS = 2000; // 2 kg
// ~37% of the catalog has no itemWeight on file - used for those (and for
// anything unparseable) so a handful of missing weights can't silently
// zero out the whole order's weight. 350g is a typical single paperback.
const FALLBACK_BOOK_WEIGHT_GRAMS = 350;

// Book weight is admin-typed free text ("310 g", "1 kg 70 g", "1.8 pounds",
// occasionally "N/A" or even dimensions pasted in by mistake) - not a
// normalized number+unit. Sums every kg/g/pound/ounce amount found in the
// string; a bare number with no unit is treated as grams (the dominant
// format in the data). Verified against all 563 distinct values actually in
// the catalog before shipping this - see conversation for the audit.
function parseWeightToGrams(raw) {
    if (!raw) return 0;
    const text = raw.toString().replace(/[‎‏‪-‮]/g, '').trim();
    if (!text) return 0;
    // a few entries have dimensions pasted into this field by mistake
    // (e.g. "13.97 x 3.07 x 21.59 cm") - don't misread those as a weight
    if (/\bcm\b|\bmm\b|\bx\b/i.test(text)) return 0;

    let grams = 0;
    let matched = false;
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*kg\b/gi)) { grams += parseFloat(m[1]) * 1000; matched = true; }
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*g\b/gi)) { grams += parseFloat(m[1]); matched = true; }
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*pounds?\b/gi)) { grams += parseFloat(m[1]) * 453.592; matched = true; }
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*ounces?\b/gi)) { grams += parseFloat(m[1]) * 28.3495; matched = true; }

    if (!matched) {
        const bare = text.match(/(\d+(?:\.\d+)?)/);
        if (bare) grams = parseFloat(bare[1]);
    }
    return grams;
}

const Checkout = () => {

    const [cart, refetch] = useCart()
    const [booksData] = useBookData()
    const [axiosSecure] = useAxiosSecure()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    // per-line total, not just unit price - a cart line can be more than one
    // copy of the same book (see CartItem's quantity stepper)
    const total = cart.reduce((sum, item) => sum + parseInt(item.discountPrice) * (item.quantity || 1), 0);
    const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // total order weight, looked up live from each book's current
    // itemWeight (not stored on the cart item) - used to decide whether the
    // heavier delivery rate applies
    const totalWeightGrams = cart.reduce((sum, item) => {
        const book = booksData?.find(b => b._id === item.bookId);
        const perCopy = parseWeightToGrams(book?.itemWeight) || FALLBACK_BOOK_WEIGHT_GRAMS;
        return sum + perCopy * (item.quantity || 1);
    }, 0);
    const isHeavyOrder = totalWeightGrams > HEAVY_ORDER_THRESHOLD_GRAMS;
    const DELIVERY_CHARGE = isHeavyOrder ? HEAVY_DELIVERY_CHARGE : NORMAL_DELIVERY_CHARGE;


    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    // delivery charge depends on the selected zone - defaults to the Dhaka rate
    // until the customer picks one (submit is blocked until they do)
    const selectedArea = watch('area');
    const deliveryCharge = selectedArea === 'outside' ? DELIVERY_CHARGE.outside : DELIVERY_CHARGE.dhaka;
    const totalAmount = (total + deliveryCharge);
    const navigate = useNavigate()



    const onSubmit = data => {
        setIsSubmitting(true)

        // save payment insformation to database
        const currentDate = new Date();
        const date = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

        const order = {
            cart, orderQuantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0), total, deliveryCharge, totalAmount, data, date, email: user?.email,
            totalWeightGrams, isHeavyOrder,
            cartItems: cart.map(item => item?._id),
            itemNames: cart.map(item => item?.name),
            bookItems: cart.map(item => item?.bookId),
            status: 'pending'
        }
        axiosSecure.post('/orders', order)
            .then(res => {
                console.log(res.data);
                if (res.data.insertResult.insertedId) {
                    reset();
                    refetch();
                    navigate('/dashboard/orderHistory')
                    // dipslay confimr

                    showSuccessToast(`${cart.length} books order has confirmed.`)
                }
            })
            .catch(err => {
                console.error(err);
                setIsSubmitting(false)
                showErrorToast('Could not place order', 'Please check your connection and try again.')
            })

    };

    return (
        <div className="pt-32 md:pt-32 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-950/40 min-h-screen">
            <Helmet>
                <title>Book Ocean BD | Checkout</title>
            </Helmet>
            <div className="container mx-auto px-4 lg:px-0">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cash on delivery, nationwide.</p>
                </div>

                {cart.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiShoppingBag className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your cart is empty</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Add a few books before checking out.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                        >
                            Browse books <FiArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-5 gap-6 items-start">

                        {/* shipping details  */}
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-5 sm:p-6">
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <FaTruck className="text-blue-500" /> Shipping details
                            </h2>

                            <div className="flex flex-col gap-4">
                                {/* name*/}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        <FaUser className="text-blue-400" size={13} /> Full name*
                                    </label>
                                    <input type="text" placeholder="Type your name" className="input input-bordered w-full"
                                        {...register("name", { required: true })} />
                                    {errors.name && <span className="text-red-600 text-xs font-medium mt-1 block">Name is required*</span>}
                                </div>

                                {/* phone */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        <FaPhone className="text-blue-400" size={13} /> Phone number*
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        className="input input-bordered w-full"
                                        placeholder="e.g. 01712345678"
                                        {...register("phone", {
                                            required: true,
                                            // Bangladeshi mobile numbers: 11 digits, starting 01[3-9]
                                            // (013/014/017 Grameenphone, 015 Teletalk, 016 Airtel, 018 Robi, 019 Banglalink)
                                            pattern: /^01[3-9]\d{8}$/,
                                        })}
                                    />
                                    {errors?.phone?.type === 'required' && <span className="text-red-600 text-xs font-medium mt-1 block">Phone number is required*</span>}
                                    {errors?.phone?.type === 'pattern' && <span className="text-red-600 text-xs font-medium mt-1 block">Enter a valid Bangladeshi phone number, e.g. 01712345678</span>}
                                </div>

                                {/* Address  */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        <FaMapMarkerAlt className="text-blue-400" size={13} /> Address*
                                    </label>
                                    <textarea className="input input-bordered w-full h-24 py-2" placeholder="Enter full address" {...register("address", { required: true })} />
                                    {errors?.address && <span className="text-red-600 text-xs font-medium mt-1 block">Address is required*</span>}
                                </div>

                                {/* Zone  */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        <FaTruck className="text-blue-400" size={13} /> Delivery area*
                                    </label>
                                    <select
                                        defaultValue=""
                                        className="select select-bordered w-full"
                                        {...register("area", { required: true })}
                                    >
                                        <option value="" disabled>Select delivery area</option>
                                        <option value="dhaka">Inside Dhaka - ৳{DELIVERY_CHARGE.dhaka}</option>
                                        <option value="outside">Outside Dhaka - ৳{DELIVERY_CHARGE.outside}</option>
                                    </select>
                                    {errors?.area && <span className="text-red-600 text-xs font-medium mt-1 block">Please select a delivery area*</span>}
                                </div>
                            </div>
                        </div>

                        {/* order summary - sticky so it stays visible while the
                            form (which can get tall on mobile) scrolls past it */}
                        <div className="lg:col-span-2 lg:sticky lg:top-24">
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="font-semibold text-gray-900 dark:text-white">
                                        Your order <span className="text-gray-400 dark:text-gray-500 font-normal">({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                                    </h2>
                                </div>

                                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 scrollbar-thin scrollbar-webkit">
                                    {cart.map((book, i) => (
                                        <div key={i} className="flex gap-3 p-4">
                                            <Link
                                                to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                                            >
                                                <img className="w-full h-full object-cover" src={book.image} alt={book.name} />
                                            </Link>
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                    className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-500 transition-colors"
                                                >
                                                    {book.name}
                                                </Link>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">by {book.author}</p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">Qty {book.quantity || 1}</span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">৳{book.discountPrice * (book.quantity || 1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-5 space-y-2 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <span>Subtotal</span>
                                        <span>৳{total}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span>Delivery charge</span>
                                        <span className="flex items-center gap-1.5">
                                            {selectedArea && <span className="text-xs text-gray-400 dark:text-gray-500">({selectedArea === 'outside' ? 'outside dhaka' : 'inside dhaka'})</span>}
                                            ৳{deliveryCharge}
                                        </span>
                                    </div>
                                    {isHeavyOrder && (
                                        <p className="text-xs text-orange-500 dark:text-orange-400 text-right">
                                            Heavier delivery rate applies - order weighs over 2kg
                                        </p>
                                    )}
                                    <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span>Total</span>
                                        <span className="text-blue-600 dark:text-blue-400">৳{totalAmount}</span>
                                    </div>
                                </div>

                                <div className="p-5 pt-0">
                                    <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
                                        *** Cash on Delivery ***
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting
                                            ? <span className="loading loading-bars loading-md"></span>
                                            : <>Confirm order <FiArrowRight size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Checkout;
