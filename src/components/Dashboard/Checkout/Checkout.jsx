import { Link, useNavigate } from "react-router-dom";
// import CartItem from "../../CartItem/CartItem";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import { Helmet } from "react-helmet-async";


const Checkout = () => {

    const [cart, refetch] = useCart()
    const [axiosSecure] = useAxiosSecure()
    const { user } = useAuth()
    const total = cart.reduce((sum, item) => parseInt(item.discountPrice) + sum, 0);
    // const total = cart.reduce((sum, item) => parseInt(item.price) + sum, 0);




    const deliveryCharge = 80;
    const totalAmount = (total + deliveryCharge);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()



    const onSubmit = data => {

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

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${cart.length} books order has confirmed.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })

    };
    console.log(errors);

    return (
        <div className="mb-[30px] pt-32 md:32 lg:pt-24 ">
            <Helmet>
                <title>Book Ocean BD || Checkout</title>
            </Helmet>
            <div className="container mx-auto px-1 lg:px-2 dark:text-white">
                <h1 className="uppercase text-lg md:text-2xl text-center font-semibold mb-2">
                    check out
                </h1>
                <div className="w-full flex flex-col xl:flex-row lg:flex-row  gap-4">

                    {/* info  */}
                    <div className=" lg:w-1/3 w-full ">
                        <div className="py-8 lg:px-6  px-3 dark:bg-gray-800 rounded shadow-xl">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* name*/}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Name*</span>
                                    </label>
                                    <input type="text" placeholder="Type Name" className="input input-bordered w-full dark:bg-white"
                                        {...register("name", { required: true })} />
                                </div>
                                {errors.name && <span className="text-red-600 font-semibold">Name is required*</span>}

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Phone Number*</span>
                                    </label>
                                    <input type="tel" className="input input-bordered w-full dark:bg-white" placeholder="Enter phone number" {...register("phone", { required: true, minLength: 11, maxLength: 11 })} />

                                </div>
                                {errors?.phone && <span className="text-red-600 font-semibold">Phone number is required*</span>}
                                {errors.phone?.type === 'maxLength' && <p className="text-red-600 font-semibold">
                                    Phone number must be in 11 digits</p>}
                                {/* Address  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Address*</span>
                                    </label>

                                    <textarea className="input input-bordered w-full h-24 dark:bg-white" placeholder="Enter full address" {...register("address", { required: true })} />
                                </div>
                                {errors?.address && <span className="text-red-600 font-semibold">Address is required*</span>}

                                {/* Zone  */}
                                {/* <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Area*</span>
                                    </label>

                                    <select className="select select-bordered uppercase bg-white"  {...register("area", { required: true })}>
                                        <option disabled >Pick one</option>
                                        <option value={dhakaArea}>Dhaka</option>
                                        <option value='100'>Outside Dhaka-100</option>

                                    </select>
                                </div> */}
                                {errors?.address && <span className="text-red-600 font-semibold">Address is required*</span>}
                                {/* order summery  */}
                                <div className="my-6">
                                    <div className="  border dark:border-0 dark:bg-gray-900 rounded-md shadow-2xl p-5 uppercase font-semibold  ">
                                        <h2 className="text-lg lg:text-xl font-semibold mb-2 text-center">Order summary</h2>
                                        <hr />

                                        <div className="text-center text-md lg:text-xl my-4">
                                            *** Cash on Delivery ***
                                        </div>
                                        <div className="flex justify-between">
                                            <h2>Sub Total:</h2>
                                            <p><span>&#x09F3;</span> {total}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <h2>Delivery charge:</h2>
                                            {
                                                cart.length > 0 ? <div><span>&#x09F3;</span>  {deliveryCharge}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                        <div className="flex justify-between">
                                            <h2>Total:</h2>
                                            {
                                                cart.length > 0 ? <div><span>&#x09F3;</span>  {totalAmount}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <input className="mt-4 w-full py-4 rounded font-semibold bg-black dark:bg-gray-700 dark:text-green-400 text-white hover:scale-95 hover:text-green-600 duration-300 cursor-pointer uppercase leading-tight tracking-wider" type="submit" value="Confirm" />
                            </form>
                        </div>
                    </div>
                    <div className="lg:w-2/3  w-full border dark:border-none rounded shadow-2xl">
                        <h1 className="uppercase font-semibold text-lg md:text-2xl text-center mt-4 lg:mt-8 ">
                            Order Details
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