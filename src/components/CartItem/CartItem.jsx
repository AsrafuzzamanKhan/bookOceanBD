import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

import useCart from "../../hooks/useCart";
import Swal from "sweetalert2";


const CartItem = ({ item }) => {
    const [, refetch] = useCart();
    // const { price, quantity } = item;
    // const [productQuantity, setProductQuantity] = useState(quantity)

    // remover from cart 
    const handleCartRemove = item => {
        fetch(`https://book-ocean-bd-server.vercel.app/carts/${item._id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    refetch();

                    Swal.fire({
                        title: "Removed!",
                        text: "Book has been removed from cart.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500

                    });
                }

            })

    }

    // const handleIncrement = () => {
    //     setProductQuantity(productQuantity + 1)
    //     console.log('increment')
    // }
    // const handleDecrement = () => {
    //     if (productQuantity > 1) {
    //         setProductQuantity(productQuantity - 1)
    //     }

    //     console.log('decrement')
    // }
    // const totalPrice = price * productQuantity;
    return (
        <div className="flex gap-x-8">
            <Link
                to={`/book/${item.
                    bookId}`}
                className="w-[70px] h-[70px]">
                <img src={item.image} alt="mage" />
            </Link>
            {/* title and remove icon  */}
            <div className="flex-1">
                <div className="flex justify-between gap-x-4 mb-3">
                    <div className="flex flex-col">
                        <Link className="text-xl"
                            to={`book/${item.
                                bookId}`}
                        > {item.name}

                        </Link>
                        <Link
                            to={`book/${item.
                                bookId}`}
                        > by <span className="text-blue-400"> {item.author}</span>

                        </Link>
                    </div>
                    <div className="cursor-pointer text-[24px] hover:text-red-400 transition-all">
                        <IoClose onClick={() => handleCartRemove(item)}></IoClose>
                    </div>
                </div>
                <div className=" flex items-center gap-x-12">
                    {/* amount  */}
                    <div className="flex gap-x-4 mb-2 items-center">

                        <div className="flex gap-x-6 items-center  text-primary ">

                            {/* price  */}
                            <div>
                                <span className="text-blue-400">
                                    {item.price} <span>&#x09F3;</span>
                                </span>
                            </div>
                            {/* <div className="bg-gray-200">
                                <div className="flex gap-4 p-2">


                                    <button onClick={handleIncrement}><FaPlus />
                                    </button>
                                    <p>{productQuantity}</p>
                                    <button onClick={handleDecrement}><FaMinus />
                                    </button>
                                </div>

                            </div> */}
                            {/* <span className="text-blue-400">
                                {totalPrice} <span>&#x09F3;</span>
                            </span> */}

                        </div>
                    </div>

                </div>



            </div>


        </div>
    );
};

export default CartItem;