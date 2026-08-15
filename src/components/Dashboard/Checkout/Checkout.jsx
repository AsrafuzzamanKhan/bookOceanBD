import { Link, useNavigate } from "react-router-dom";
// import CartItem from "../../CartItem/CartItem";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import { format } from 'date-fns';
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaReceipt, FaTruck, FaUser } from "react-icons/fa";

const DELIVERY_CHARGE = {
    dhaka: 80,
    outside: 100,
};

const Checkout = () => {

    const [cart, refetch] = useCart()
    const [axiosSecure] = useAxiosSecure()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const total = cart.reduce((sum, item) => parseInt(item.discountPrice) + sum, 0);
    // const total = cart.reduce((sum, item) => parseInt(item.price) + sum, 0);


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
            cart, orderQuantity: cart.length, total, deliveryCharge, totalAmount, data, date, email: user?.email,
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
    console.log(errors);

    return (
        <div className="mb-[30px] pt-32 md:32 lg:pt-24 ">
            <Helmet>
                <title>Book Ocean BD || Checkout</title>
            </Helmet>
            <div className="container mx-auto px-1 lg:px-2 dark:text-white">
                <h1 className="uppercase text-lg md:text-2xl text-center font-semibold mb-6">
                    check out
                </h1>
                <div className="w-full flex flex-col xl:flex-row lg:flex-row  gap-4">

                    {/* info  */}
                    <div className=" lg:w-1/3 w-full ">
                        <div className="py-8 lg:px-6  px-3 dark:bg-gray-800 rounded-lg shadow-xl">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* name*/}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2"><FaUser className="text-blue-400" /> Name*</span>
                                    </label>
                                    <input type="text" placeholder="Type Name" className="input input-bordered w-full dark:bg-white"
                                        {...register("name", { required: true })} />
                                </div>
                                {errors.name && <span className="text-red-600 font-semibold">Name is required*</span>}

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2"><FaPhone className="text-blue-400" /> Phone Number*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        className="input input-bordered w-full dark:bg-white"
                                        placeholder="e.g. 01712345678"
                                        {...register("phone", {
                                            required: true,
                                            // Bangladeshi mobile numbers: 11 digits, starting 01[3-9]
                                            // (013/014/017 Grameenphone, 015 Teletalk, 016 Airtel, 018 Robi, 019 Banglalink)
                                            pattern: /^01[3-9]\d{8}$/,
                                        })}
                                    />

                                </div>
                                {errors?.phone?.type === 'required' && <span className="text-red-600 font-semibold">Phone number is required*</span>}
                                {errors?.phone?.type === 'pattern' && <p className="text-red-600 font-semibold">
                                    Enter a valid Bangladeshi phone number, e.g. 01712345678</p>}
                                {/* Address  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2"><FaMapMarkerAlt className="text-blue-400" /> Address*</span>
                                    </label>

                                    <textarea className="input input-bordered w-full h-24 dark:bg-white" placeholder="Enter full address" {...register("address", { required: true })} />
                                </div>
                                {errors?.address && <span className="text-red-600 font-semibold">Address is required*</span>}

                                {/* Zone  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2"><FaTruck className="text-blue-400" /> Delivery Area*</span>
                                    </label>

                                    <select
                                        defaultValue=""
                                        className="select select-bordered w-full dark:bg-white"
                                        {...register("area", { required: true })}
                                    >
                                        <option value="" disabled>Select delivery area</option>
                                        <option value="dhaka">Inside Dhaka - ৳{DELIVERY_CHARGE.dhaka}</option>
                                        <option value="outside">Outside Dhaka - ৳{DELIVERY_CHARGE.outside}</option>
                                    </select>
                                </div>
                                {errors?.area && <span className="text-red-600 font-semibold">Please select a delivery area*</span>}

                                {/* order summery  */}
                                <div className="my-6">
                                    <div className="  border dark:border-0 dark:bg-gray-900 rounded-md shadow-2xl p-5 uppercase font-semibold  ">
                                        <h2 className="text-lg lg:text-xl font-semibold mb-2 text-center flex items-center justify-center gap-2"><FaReceipt /> Order summary</h2>
                                        <hr />

                                        <div className="text-center text-md lg:text-xl my-4">
                                            *** Cash on Delivery ***
                                        </div>
                                        <div className="flex justify-between">
                                            <h2>Sub Total:</h2>
                                            <p><span>&#x09F3;</span> {total}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <h2>Delivery charge:</h2>
                                            {
                                                cart.length > 0 ? <div className="flex items-center gap-2">
                                                    {selectedArea && <span className="normal-case text-xs text-gray-400 dark:text-gray-500">({selectedArea === 'outside' ? 'outside dhaka' : 'inside dhaka'})</span>}
                                                    <span>&#x09F3;</span>  {deliveryCharge}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between text-lg text-blue-500 dark:text-blue-400">
                                            <h2>Total:</h2>
                                            {
                                                cart.length > 0 ? <div><span>&#x09F3;</span>  {totalAmount}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    cart.length === 0
                                        ? <p className="text-center text-sm text-gray-400">Your cart is empty. Add a book before checking out.</p>
                                        : <input
                                            className="mt-4 w-full py-4 rounded font-semibold bg-black dark:bg-gray-700 dark:text-green-400 text-white hover:scale-95 hover:text-green-600 duration-300 cursor-pointer uppercase leading-tight tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            type="submit"
                                            disabled={isSubmitting}
                                            value={isSubmitting ? 'Placing order...' : 'Confirm'}
                                        />
                                }
                            </form>
                        </div>
                    </div>
                    <div className="lg:w-2/3  w-full border dark:border-none dark:bg-gray-800 rounded-lg shadow-2xl">
                        <h1 className="uppercase font-semibold text-lg md:text-2xl text-center mt-4 lg:mt-8 flex items-center justify-center gap-2">
                            <FaReceipt /> Order Details
                        </h1>
                        <div className="flex flex-col items-center py-4 lg:py-6 ">
                            <div className="overflow-x-auto w-full">
                                <table className="table lg:table-lg table-xs table-pin-rows table-pin-cols ">
                                    {/* head */}
                                    <thead >
                                        <tr className="dark:text-white" >
                                            <th className="!p-1" >S/N</th>
                                            <th className="!p-1">Image</th>
                                            <th className="!p-1" >Book Info</th>
                                            <th className="!p-1">Qty</th>
                                            <th className="!p-1">Price</th>

                                        </tr>
                                    </thead>
                                    <tbody >

                                        {cart?.map((book, i) =>



                                            <tr key={i} className="dark:hover:bg-gray-700 hover:bg-gray-200 duration-300 transition-all" >
                                                <th className="!p-4">
                                                    {i + 1}
                                                </th>
                                                <td className="!p-1">
                                                    <div className="w-12 object-cover overflow-hidden ">
                                                        <Link
                                                            to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                        >
                                                            <img className="w-full " src={book.image} alt={book.image} />
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="!px-1">
                                                    <Link
                                                        to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                    >
                                                        <div className="flex flex-col gap-y-1 ">
                                                            <h2>
                                                                {book.name}
                                                            </h2>
                                                            <h2>
                                                                Author - {book.author}
                                                            </h2>
                                                            <h2>Genre - {book.category}</h2>
                                                        </div>
                                                    </Link>
                                                </td>

                                                <td className="!p-1">
                                                    {book.quantity}

                                                </td>
                                                <td className="!p-1">

                                                    <div className="flex gap-1">
                                                        <span>&#x09F3;</span> <p>{book.discountPrice}</p>
                                                    </div>
                                                </td>

                                            </tr>

                                        )}



                                    </tbody>


                                </table>


                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Checkout;
