import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import useUserOrder from "../../../hooks/useUserOrder";
import { MdDelete } from "react-icons/md";
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

            <div className=" text-white text-2xl  text-center mb-12 bg-[#081A51] py-12">
                {user.displayName}'s Order history
            </div>
            <div className="px-10 dark:text-white  ">
                <div className="overflow-x-auto border dark:border-gray-900 shadow-xl rounded-md ">
                    <table className="table lg:text-[16px] lg:table-lg table-xs ">
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
                                <td className="sm:w-50">
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


                                <td className=""> {order.cart.map((book, i) => <>
                                    <div className="leading-loose">
                                        {i + 1} - {book.name} - by {book.author}
                                    </div></>)}
                                </td>

                                <td className=" text-center">

                                    <span>&#x09F3;</span>{order.totalAmount}




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
        </div >
    );
};

export default OrderHistory;