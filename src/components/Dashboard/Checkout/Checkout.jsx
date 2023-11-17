import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../CartItem/CartItem";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const Checkout = ({ item }) => {
    const [cart, refetch] = useCart()
    const [axiosSecure] = useAxiosSecure()
    const { user } = useAuth()
    const total = cart.reduce((sum, item) => item.price + sum, 0);
    const deliveryCharge = 80;
    const totalAmount = (total + deliveryCharge);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const onSubmit = data => {

        // save payment insformation to database 
        const date = new Date()
        const order = {
            cart, orderQuantity: cart.length, total, deliveryCharge, totalAmount, data, date, email: user?.email,
            cartItems: cart.map(item => item._id),
            itemNames: cart.map(item => item.name),
            bookItems: cart.map(item => item.bookId),
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
        // <div className="pt-40">

        //     <div className="flex gap-x-8">
        //         <Link
        //             to={`product/${item.id}`}
        //             className="w-[70px] hi-[70px]">
        //             <img src={item.image} alt="" />
        //         </Link>
        //         {/* title and remove icon  */}
        //         <div className="flex-1">
        //             <div className="flex gap-x-4 mb-3">
        //                 <Link
        //                     to={`book/${item.id}`}
        //                 > {item.name}</Link>
        //                 {/* <div className="cursor-pointer text-[24px] hover:text-blue-400 transition-all">
        //                     <IoClose onClick={() => removerFromCart(item.id)}></IoClose>
        //                 </div> */}
        //             </div>
        //             <div className=" flex items-center gap-x-12">
        //                 {/* amount  */}
        //                 <div className="flex gap-x-4 mb-2 items-center">

        //                     <Qty item={item}></Qty>

        //                     <div className="text-blue-400 text-xl"> $ {price} </div>
        //                 </div>

        //             </div>
        //             {/* price  */}
        //             <div>
        //                 <span className="text-blue-400">
        //                     {item.price} per piece
        //                 </span>
        //             </div>


        //         </div>


        //     </div>
        // </div>
        <div className="mb-[30px] pt-36 md:pt-36 lg:pt-0 xl:pt-28 ">
            {cart.length}
            {user?.displayName}
            {user?.email}
            <div className="container mx-auto">
                <div className="w-full flex gap-4">

                    {/* info  */}
                    <div className="border w-1/3 ">
                        <div className="py-12 px-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* name*/}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Name*</span>
                                    </label>
                                    <input type="text" placeholder="Type Name" className="input input-bordered w-full"
                                        {...register("name", { required: true })} />
                                </div>
                                {errors.name && <span className="text-red-600 font-semibold">Name is required*</span>}
                                {/* email  */}
                                {/* <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Email*</span>
                                    </label>

                                    <input type="email" placeholder="Type here" className="input input-bordered w-full"
                                        {...register("email",)} defaultValue={user?.email} />
                                </div> */}
                                {/* phone  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Phone Number*</span>
                                    </label>
                                    <input type="tel" className="input input-bordered w-full" placeholder="Enter phone number" {...register("phone", { required: true, minLength: 11, maxLength: 11 })} />

                                </div>
                                {errors?.phone && <span className="text-red-600 font-semibold">Phone number is required*</span>}
                                {errors.phone?.type === 'maxLength' && <p className="text-red-600 font-semibold">
                                    Phone number must be in 11 digits</p>}
                                {/* Address  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Address*</span>
                                    </label>

                                    <textarea className="input input-bordered w-full h-24" placeholder="Enter full address" {...register("address", { required: true })} />
                                </div>
                                {errors?.address && <span className="text-red-600 font-semibold">Address is required*</span>}


                                <input className="mt-4 w-full py-4 rounded bg-black text-white hover:scale-105 hover:text-green-600 duration-300 cursor-pointer " type="submit" value="Confirm" />
                            </form>
                        </div>
                    </div>
                    <div className="w-2/3 border">
                        cart detail
                        <div className="px-8 py-12 ">
                            <div className="overflow-x-auto">
                                <table className="table  table-pin-rows table-pin-cols ">
                                    {/* head */}
                                    <thead >
                                        <tr>
                                            <th>S/N</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Quantity</th>
                                            <th>Price</th>

                                        </tr>
                                    </thead>
                                    <tbody className="text-xl" >

                                        {cart?.map((book, i) => <tr key={i}>
                                            <th>
                                                <label>
                                                    {i + 1}
                                                </label>
                                            </th>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img src={book.image} alt="Avatar Tailwind CSS Component" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>
                                            <td className="w-80">
                                                {book.name}
                                                <br />
                                                <span className="badge badge-ghost badge-sm">{book.author}</span>
                                            </td>
                                            <td>{book.category}</td>
                                            <td className="text-center">{book.quantity}</td>
                                            <td><span>&#x09F3;</span> {book.price}</td>

                                        </tr>)}



                                    </tbody>


                                </table>
                                {/* order summery  */}
                                <div className="flex justify-end mt-12">
                                    <div className="w-1/2 border rounded-md shadow-2xl p-5 uppercase font-semibold ">
                                        <h2 className="text-2xl font-semibold mb-8 text-center">Order summery</h2>
                                        <div className="flex justify-between">
                                            <div>Sub Total</div>
                                            <div><span>&#x09F3;</span> {total}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>Delivery charge:</div>
                                            {
                                                cart.length > 0 ? <div><span>&#x09F3;</span>  {deliveryCharge}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                        <div className="flex justify-between">
                                            <div>Total:</div>
                                            {
                                                cart.length > 0 ? <div><span>&#x09F3;</span>  {totalAmount}
                                                </div> : <div><span>&#x09F3;</span>  0
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Checkout;