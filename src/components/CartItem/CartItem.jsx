import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import Qty from "../Qty/Qty";
import { useContext } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";


const CartItem = ({ item }) => {
    const { removerFromCart } = useContext(CartContext)
    // console.log(item)
    const price = (item.price * item.amount).toFixed(2)
    return (
        <div className="flex gap-x-8">
            <Link
                to={`product/${item.id}`}
                className="w-[70px] hi-[70px]">
                <img src={item.image} alt="" />
            </Link>
            {/* title and remove icon  */}
            <div className="flex-1">
                <div className="flex gap-x-4 mb-3">
                    <Link
                        to={`book/${item.id}`}
                    > {item.name}</Link>
                    <div className="cursor-pointer text-[24px] hover:text-blue-400 transition-all">
                        <IoClose onClick={() => removerFromCart(item.id)}></IoClose>
                    </div>
                </div>
                <div className=" flex items-center gap-x-12">
                    {/* amount  */}
                    <div className="flex gap-x-4 mb-2 items-center">

                        <Qty item={item}></Qty>

                        <div className="text-blue-400 text-xl"> $ {price} </div>
                    </div>

                </div>
                {/* price  */}
                <div>
                    <span className="text-blue-400">
                        {item.price} per piece
                    </span>
                </div>


            </div>


        </div>
    );
};

export default CartItem;