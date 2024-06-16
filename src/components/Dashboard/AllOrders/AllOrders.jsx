import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

// import { AiFillDelete } from "react-icons/ai";
import { IoMdPricetags } from "react-icons/io";
import { IoCalendar } from "react-icons/io5";
import { FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";

const AllOrders = () => {
    const [axiosSecure] = useAxiosSecure();
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/allOrders')
            return res.data;

        }
    });
    // show data in reverse 
    const reversedOrderData = orders.slice().reverse();
    // approve 
    const handleApproved = order => {
        console.log(order._id)
        axiosSecure.patch(`/orders/approve-order/${order._id}`)
            .then(res => {
                console.log(res.data)
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `order is Approved`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }
    // cancel 
    const handleCanceled = order => {
        console.log(order._id)
        axiosSecure.patch(`/orders/cancel-order/${order._id}`)
            .then(res => {
                console.log(res.data)
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `order is Canceled`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }
    // Delievery 
    const handleDelivery = order => {
        console.log(order._id)
        axiosSecure.patch(`/orders/delivery-order/${order._id}`)
            .then(res => {
                console.log(res.data)
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Delivered`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }


    // const handleDelete = order => {
    //     console.log(order._id)
    // }
    return (
        <div className='container mx-auto'>
            <Helmet>
                <title>Book Ocean BD || All Orders</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className='items-center  mb-8 flex flex-col'>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Total Order: {orders?.length}</h1>
                </div>

                {/* mobile responsive  */}
                <div className="px-1 lg:px-0 dark:text-white pb-12 ">
                    {
                        reversedOrderData?.map((order, i) =>
                            <div key={i} className=" border dark:border-none dark:bg-gray-800  rounded-[8px] my-4 hover:bg-gray-100 dark:hover:bg-slate-700 duration-300">

                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <div className="dropdown">
                                            <div tabIndex={0} role="button" className="btn m-1">{order.status}</div>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                {order.status === 'pending' ?

                                                    <li>
                                                        <a >{order.status === 'approve' ? 'Approved' : <button onClick={() => handleApproved(order)} className="btn bg-green-600 text-white">{order.status}-Aprrove</button>}
                                                        </a>
                                                    </li> : <>{order.status === 'canceled' ||
                                                        < li >
                                                            <a> {order.status === 'delivered' ? 'Delivered' : <button onClick={() => handleDelivery(order)} className="btn bg-blue-600 text-white">Delivery-{order.status}</button>}</a>
                                                        </li>
                                                    }</>

                                                }
                                                {(order.status === 'approve' || order.status === 'delivered') ||

                                                    <li>
                                                        <a> {order.status === 'canceled' ? 'Canceled' : <button onClick={() => handleCanceled(order)} className="btn bg-orange-600 text-white">{order.status}--Cancel</button>}
                                                        </a>
                                                    </li>}

                                                {/* <li>
                                                <a> {order.status === 'canceled' ? 'Canceled' : <button onClick={() => handleCanceled(order)} className="btn bg-orange-600 text-white">{order.status}</button>}
                                                </a>
                                            </li> */}

                                            </ul>
                                        </div>

                                        <div className="flex font-semibold bg-gray-100 dark:bg-slate-950  rounded px-4 py-2 ">
                                            <span>&#x09F3; </span>

                                            <p className="mx-1 "> {order.totalAmount}</p>
                                        </div>

                                    </div>

                                    {/* <div>

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

                                </div> */}
                                    <div className="flex lg:flex-row md:flex-col flex-col">
                                        <div className="flex-1 leading-loose">
                                            <div className="flex items-center "><IoCalendar className="mr-2" /> {order.date}</div>
                                            <div className="flex items-center "><FaUser className="mr-2" />{order.data.name}</div>
                                            <div className="flex items-center "><FaUser className="mr-2" />{order.email}</div>
                                            <div className="flex items-center"><FaPhone className="mr-2" />{order.data.phone}</div>
                                            <div className="flex items-center"> <FaMapMarkerAlt className="mr-2" />{order.data.address}</div>
                                        </div>

                                        <div className="flex-1 mt-4 lg:mt-0">
                                            {order.cart.map((book, i) => <div key={i} >

                                                <div className="flex mb-4">
                                                    <div className="w-1/4">
                                                        <img className="w-12" src={book.image} alt={book.image} />
                                                    </div>
                                                    <div className="w-3/4">
                                                        <span className="text-blue-600">  {i + 1} </span> - {book.name} - by <span className="text-blue-400">{book.author}</span>
                                                        <div className="flex items-center"> <IoMdPricetags className="me-2" /><span className="me-1">&#x09F3; </span> {book.price}  </div>
                                                    </div>
                                                </div>
                                            </div>)}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                {/* <div className="overflow-x-auto px-8">
                <table className="table table-zebra ">

                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>qtn</th>
                            <th>Books</th>
                            <th>Total</th>
                            <th>Approve</th>
                            <th>Cancel</th>
                            <th>Delivered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.map((order, i) => <tr key={i}>
                                <th>{i + 1}</th>
                                <td>
                                    <div>
                                        {order.data.name}
                                    </div>
                                    <div>
                                        {order.email}
                                    </div>
                                    <div className="  "> <span className="font-semibold leading-loose">Address:</span> {order.data.address}

                                    </div>

                                    <div>
                                        <span className="font-semibold">Phone:</span> {order.data.phone}
                                    </div>
                                </td>

                                <td>{order.orderQuantity}</td>


                                <td className="">
                                    <div>
                                        <span className="font-semibold leading-loose">Date: </span>
                                        {order.date}
                                    </div>
                                    {order.cart.map((book, i) => <>

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


                                <td>{order.totalAmount}</td>
                                <td>{order.status === 'approve' ? 'Approved' : <button onClick={() => handleApproved(order)} className="btn bg-green-600 text-white">{order.status}</button>}</td>

                                <td>{order.status === 'canceled' ? 'Canceled' : <button onClick={() => handleCanceled(order)} className="btn bg-orange-600 text-white">{order.status}</button>}</td>


                                <td>{order.status === 'delivered' ? 'Delivered' : <button onClick={() => handleDelivery(order)} className="btn bg-orange-600 text-white">{order.status}</button>}</td>

                            </tr>)
                        }


                    </tbody>
                </table>
            </div> */}
            </div>
        </div>
    );
};

export default AllOrders;