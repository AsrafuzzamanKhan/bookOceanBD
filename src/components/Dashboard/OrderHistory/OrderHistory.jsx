import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import useUserOrder from "../../../hooks/useUserOrder";
import { MdDelete } from "react-icons/md";
import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { IoMdPricetags } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

import Swal from "sweetalert2";
const OrderHistory = () => {
    const [orders, refetch] = useUserOrder()
    const { user } = useAuth()
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
                            Swal.fire({
                                title: "Canceled!",
                                text: "Your Order has been Canceled.",
                                icon: "success"
                            });
                        }
                        // setIsOpen(false)
                    })
            }
        });
    }



    return (
        <div>
            <Helmet>
                <title>Book Ocean BD || Order History</title>
            </Helmet>

            <div className=" text-white text-2xl  text-center mb-5 bg-[#081A51] py-12">
                {user.displayName}'s Order history
            </div>
            <div className="lg:px-10 p-2 dark:text-white hidden ">
                <div className="overflow-x-auto border dark:border-gray-900 shadow-xl rounded-md ">
                    <table className=" table-fixed lg:text-[16px] lg:table-lg table-xs ">
                        {/* head */}
                        <thead>
                            <tr className="text-center lg:text-lg">
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Delivery Info</th>
                                <th>Book List</th>
                                <th>Bill</th>
                                <th>Status</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>

                            {orders?.map((order, i) => <tr key={i}>
                                <th className="">
                                    <label>
                                        {i + 1}
                                    </label>
                                </th>
                                <td className="">
                                    {order.data.name}
                                    <br />

                                </td>

                                <td className="">
                                    <span className="font-semibold leading-loose">Date: </span>
                                    {order.date}
                                    <br />
                                    <div className="font-semibold leading-loose"> {user.email}</div>
                                    <div className="  "> <span className="font-semibold leading-loose">Address:</span> {order.data.address}

                                    </div>

                                    <div>
                                        <span className="font-semibold">Phone:</span> {order.data.phone}
                                    </div>
                                </td>


                                {/* <td className=""> {order.cart.map((book, i) => <>
                                    <div className="leading-loose">
                                        {i + 1} - {book.name} - by {book.author}
                                    </div></>)}
                                </td> */}

                                <td className=""> {order.cart.map((book, i) => <>

                                    <div className="flex mb-4">
                                        <div className="w-1/4">
                                            <img className="w-12" src={book.image} alt="Avatar Tailwind CSS Component" />
                                        </div>
                                        <div className="w-3/4">
                                            <span className="text-blue-600">  {i + 1} </span> - {book.name} - by <span className="text-blue-400">{book.author}</span>
                                        </div>
                                    </div>
                                </>)}
                                </td>

                                <td className="text-center font-semibold">

                                    <div className="flex">
                                        <span>&#x09F3; </span>
                                        <p className="mx-1"> {order.totalAmount}</p>
                                    </div>
                                </td>
                                <td className={`${(order.status === 'pending' || order.status === 'canceled') ? 'text-yellow-600' : 'text-blue-600'} w-32 text-center`}>
                                    <span className="border p-2 rounded-lg bg-gray-200 uppercase font-semibold">{order.status}</span>
                                </td>


                                <td>
                                    {
                                        (order.status === 'pending') &&
                                        <button onClick={() => handleCancelOrder(order)} className="btn bg-red-200 "> Cancel</button>

                                    }
                                    {
                                        (order.status === 'canceled') && <span className="text-sm text-red-600">Limited Stock... </span>
                                    }
                                    {

                                        (order.status === 'approve') && <span className="text-sm text-green-600">The Parcel is ready for delivery </span>

                                    }
                                    {

                                        (order.status === 'delivered') && <span className="text-sm text-green-600">Delivered</span>

                                    }

                                </td>
                            </tr>)}



                        </tbody>


                    </table>
                </div>
            </div>
            {/* mobile responsive  */}
            <div className="px-2 lg:px-8 dark:text-white pb-12 ">
                {
                    orders.map((order, i) =>
                        <div key={i} className=" border dark:border-none dark:bg-gray-800  rounded-[8px] my-4 hover:bg-gray-100 dark:hover:bg-slate-700 duration-300">

                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div className="border p-2 rounded-lg bg-gray-200 dark:bg-gray-800 uppercase font-semibold">{order.status}</div>

                                    <div className="flex font-semibold">
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

                                        (order.status === 'approve') && <span className="text-sm text-green-600">The Parcel is ready for delivery </span>

                                    }
                                    {

                                        (order.status === 'delivered') && <span className="text-sm text-green-600">Delivered</span>

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

                                            <div className="flex mb-4">
                                                <div className="w-1/4">
                                                    <img className="w-12" src={book.image} alt="Avatar Tailwind CSS Component" />
                                                </div>
                                                <div className="w-3/4">
                                                    <span className="text-blue-600">  {i + 1} </span> - {book.name} - by <span className="text-blue-400">{book.author}</span>
                                                    <div className="flex items-center"> <IoMdPricetags className="me-2" /><span className="me-1">&#x09F3; </span> {book.price}  </div>
                                                </div>
                                            </div>
                                        </>)}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    );
};

export default OrderHistory;