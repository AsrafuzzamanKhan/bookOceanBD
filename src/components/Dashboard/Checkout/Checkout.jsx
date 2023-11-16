import { Link } from "react-router-dom";
import CartItem from "../../CartItem/CartItem";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";


const Checkout = ({ item }) => {
    const [cart, refetch] = useCart()
    const { user } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
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
            <div className="w-full flex flex-1">

                {/* info  */}
                <div className="border w-full p-12  flex flex-col items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="First name" {...register("First name", { required: true, maxLength: 80 })} />
                        <input type="text" placeholder="Email" {...register("Email", { required: true, pattern: /^\S+@\S+$/i })} />
                        <input type="tel" placeholder="Mobile number" {...register("Mobile number", { required: true, minLength: 6, maxLength: 12 })} />
                        <textarea {...register("Address", { required: true })} />

                        <input type="submit" />
                    </form>
                </div>
                <div className="flex-1">
                    cart detail
                </div>
            </div>

        </div>
    );
};

export default Checkout;