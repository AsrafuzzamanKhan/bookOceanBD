import { useContext } from 'react';
import { IoMdClose } from 'react-icons/io';


import { IoArrowForward, IoCart } from 'react-icons/io5';
import { CartContext } from '../../providers/CartProvider/CartProvider';
import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import Swal from 'sweetalert2';
const Cart = () => {
    const { setIsOpen, isOpen, clearCart } = useContext(CartContext);
    const [cart, refetch] = useCart()
    const { user } = useAuth()
    const handleCheckOut = cart => {
        console.log(cart)


    }
    const total = cart.reduce((sum, item) => item.price + sum, 0)
    const handleCartRemove = item => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/carts/${item._id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch()
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                        setIsOpen(false)
                    })
            }
        });
    }

    return (
        <div className="w-full h-full px-4 text-white">
            <div className='overflow-y-auto overflow-x-hidden h-[70vh]'>
                {/* close icon  */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className='text-4xl w-20 h-[98px] flex justify-start items-center cursor-pointer'>
                    <IoMdClose></IoMdClose>
                </div>
                <div className='flex flex-col gap-y-10 px-2'>

                    {
                        cart.map((item, i) => {
                            return <CartItem key={i} item={item} handleCartRemove={handleCartRemove} />
                        })
                    }
                </div>
            </div>
            {/* subtotal and total  */}
            {
                cart.length >= 1 && < div className=''>
                    <div className='px-6 py-10 flex flex-col '>
                        {/* sub  */}
                        <div className='flex justify-between'>
                            <div>Subtotal:</div>

                            <div>
                                {/* ${parseFloat(total.toFixed(2))} */}
                                total
                            </div>
                        </div>
                        {/* total  */}
                        <div className='flex justify-between text-2xl'>
                            <div>Total:</div>
                            <div>
                                ${parseFloat(total.toFixed(2))}

                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* button  */}
            <div className='p-6'>
                {
                    cart.length >= 1 ?
                        <div className='flex justify-between gap-x-4'>
                            {/* clear cart  */}
                            <button
                                onClick={clearCart}
                                className='btn bg-blue-400 hover:bg-blue-200 text-primary'
                            >Clear Cart</button>


                            {/* check out  */}
                            <Link to='/checkout'>
                                <button
                                    onClick={() => handleCheckOut(cart)}
                                    className='btn bg-blue-400 hover:bg-blue-200 text-primary flex-1 px-2 gap-x-2'>Check Out <IoArrowForward className='text-lg'></IoArrowForward></button>
                            </Link>


                        </div>
                        : <div className='h-full  absolute top-0 right-0 left-0 flex justify-center items-center -z-10 flex-col text-white/30'>
                            <div className='text-2xl'> Your Cart is Empty</div>
                            <div className='text-6xl'>
                                <IoCart></IoCart>
                            </div>
                        </div>

                }
            </div>
        </div >
    );
};

export default Cart;