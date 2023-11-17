import { AiFillDelete } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import useUserOrder from "../../../hooks/useUserOrder";

const OrderHistory = () => {
    const [orders] = useUserOrder()
    const { user } = useAuth()


    return (
        <div>
            {user.displayName} Order historyadad

            <div className="overflow-x-auto ">
                <table className="table table-zebra table-pin-rows table-pin-cols  ">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Order Date</th>
                            <th>Book List</th>
                            <th>Price</th>
                            <th>Approval</th>
                        </tr>
                    </thead>
                    <tbody>

                        {orders?.map((order, i) => <tr key={i}>
                            <th>
                                <label>
                                    {i + 1}
                                </label>
                            </th>
                            <td>
                                {order.data.name}
                            </td>
                            <td>
                                {order.date}
                                <br />

                            </td>

                            <td> {order.cart.map((book, i) => <>
                                <ul>
                                    {i + 1} - {book.name}
                                </ul></>)}
                            </td>

                            <td>

                                {order.totalAmount}




                            </td>
                            <td className={`${order.status === 'pending' ? 'text-red-600' : 'text-blue-600'}`}>{order.status}</td>
                        </tr>)}



                    </tbody>


                </table>
            </div>
        </div >
    );
};

export default OrderHistory;