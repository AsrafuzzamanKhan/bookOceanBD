import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaUserShield } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

const AllOrders = () => {
    const [axiosSecure] = useAxiosSecure();
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/orders')
            return res.data;

        }
    });
    const handleApproved = order => {
        console.log(order._id)
        axiosSecure.patch(`/orders/status/${order._id}`)
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


    const handleDelete = order => {
        console.log(order._id)
    }
    return (
        <div className="w-full">
            <Helmet>
                <title>Book Ocean BD || All orders</title>
            </Helmet>
            <div className=" text-white text-2xl font-bold text-center mb-12 bg-[#081A51] py-12">
                Total Order: {orders?.length}
            </div>

            <div className="overflow-x-auto px-8">
                <table className="table table-zebra table-pin-rows table-pin-cols">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Order qtn</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.map((order, i) => <tr key={i}>
                                <th>{i + 1}</th>
                                <td>{order.data.name}</td>
                                <td>{order.email}</td>
                                <td>{order.orderQuantity}</td>
                                <td>{order.totalAmount}</td>
                                <td>{order.status === 'approve' ? 'Approved' : <button onClick={() => handleApproved(order)} className="btn bg-orange-600 text-white">{order.status}</button>}</td>
                                <th>
                                    <button onClick={() => handleDelete(order)} className="btn bg-red-600 text-white"> <AiFillDelete className='text-2xl' /></button>
                                </th>
                            </tr>)
                        }


                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrders;