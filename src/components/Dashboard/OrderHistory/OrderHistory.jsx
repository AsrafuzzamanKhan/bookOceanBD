import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import useUserOrder from "../../../hooks/useUserOrder";

import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { IoMdPricetags } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

import Swal from "sweetalert2";
import { showSuccessToast } from "../../../utils/toast";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    // const [orders, refetch] = useUserOrder()
    const { user } = useAuth()
    const [order, refetch] = useUserOrder()
    console.log(order);
    const approve = order.filter(pd => pd.status === 'approve');
    const pending = order.filter(pd => pd.status === 'pending');
    const cancel = order.filter(pd => pd.status === 'canceled');
    const deliver = order.filter(pd => pd.status === 'delivered');
    console.log('approve', approve.lenght)
    // console.log(orders.length);
    const handleCancelOrder = item => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://book-ocean-bd-server.vercel.app/orders/${item._id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch()
                            showSuccessToast("Canceled!", "Your Order has been Canceled and Removed from History.")
                        }
                        // setIsOpen(false)
                    })
            }
        });
    }



    return (
        <div className=" min-h-screen ">
            <Helmet>
                <title>Book Ocean BD || Order History</title>
            </Helmet>
            <div className="container mx-auto">
                <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                    <div className=' items-center  mb-8 flex flex-col'>
                        <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>{`${user.displayName}'s`} Order history</h1>
                    </div>

                    {/* order stats 
            
            */}


                    <div className=" w-full grid grid-cols-2 lg:grid-cols-4 dark:text-white px-1 lg:px-0 ">

                        <div className=" bg-blue-200 flex flex-col justify-center items-center py-4  ">
                            <div className=" dark:text-white font-semibold">Delivered</div>
                            <div className="text-2xl font-bold">{deliver.length}  </div>
                        </div>
                        <div className=" bg-green-400 flex flex-col justify-center items-center  py-4   ">
                            <div className="dark:text-white font-semibold">Approved</div>
                            <div className="text-2xl font-bold">{approve.length}  </div>
                        </div>

                        <div className=" bg-blue-400 flex flex-col justify-center items-center py-4   ">
                            <div className=" dark:text-white font-semibold">Pending</div>
                            <div className="text-2xl font-bold">  {pending.length}</div>

                        </div>
                        <div className=" bg-red-400 flex flex-col justify-center items-center  py-4  ">
                            <div className=" dark:text-white font-semibold">Canceled</div>
                            <div className="text-2xl font-bold">  {cancel.length}</div>

                        </div>

                    </div>
                    {/* mobile responsive  */}
                    <div className="px-1 lg:px-0 dark:text-white pb-12 ">
                        {
                            order.map((order, i) =>
                                <div key={i} className=" border dark:border-none dark:bg-gray-800  rounded-[8px] my-4 hover:bg-gray-100 dark:hover:bg-slate-700 duration-300">

                                    <div className="card-body">
                                        <div className="flex justify-between items-center">
                                            <div className="border p-2 rounded-lg bg-gray-200 dark:bg-gray-800 uppercase font-semibold">{order.status}</div>

                                            <div className="flex font-semibold border px-4 py-2 rounded">
                                                <span>&#x09F3; </span>
                                                <p className="mx-1"> {order.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div>

                                            {
                                                (order.status === 'pending') &&
                                                <button onClick={() => handleCancelOrder(order)} className="btn bg-red-200 dark:bg-white"> Cancel</button>

                                            }
                                            {
                                                (order.status === 'canceled') && <span className="text-sm text-red-400">Limited Stock... </span>
                                            }
                                            {

                                                (order.status === 'approve') && <span className="text-sm text-green-600">The Parcel is ready for delivery.</span>

                                            }
                                            {

                                                (order.status === 'delivered') && <span className="text-sm text-green-600">Thank you for purchasing.</span>

                                            }

                                        </div>
                                        <div className="flex lg:flex-row md:flex-col flex-col">
                                            <div className="flex-1 leading-loose">
                                                <div className="flex items-center "><IoCalendar className="mr-2" /> {order.date}</div>
                                                <div className="flex items-center "><FaUser className="mr-2" />{order.data.name}</div>
                                                <div className="flex items-center"><FaPhone className="mr-2" />{order.data.phone}</div>
                                                <div className="flex items-center"> <FaMapMarkerAlt className="mr-2" />{order.data.address}</div>
                                            </div>

                                            <div className="flex-1 mt-4 lg:mt-0">
                                                {order.cart.map((book, i) => <>

                                                    <Link to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`} className="flex mb-4 hover:scale-95 duration-500">
                                                        <div className="w-1/4">
                                                            <img className="w-12" src={book.image} alt="Avatar Tailwind CSS Component" />
                                                        </div>
                                                        <div className="w-3/4">
                                                            <span className="text-blue-600">  {i + 1} </span> - {book.name} - by <span className="text-blue-400">{book.author}</span>
                                                            <div className="flex items-center"> <IoMdPricetags className="me-2" /><span className="me-1">&#x09F3; </span> {book.discountPrice}  </div>
                                                        </div>
                                                    </Link>
                                                </>)}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default OrderHistory;