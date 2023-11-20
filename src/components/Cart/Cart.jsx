import { useContext, useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoArrowForward, IoCart } from 'react-icons/io5';

import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import Swal from 'sweetalert2';
import { CartContext } from '../../providers/CartProvider/CartProvider';


const Cart = () => {

    const { setIsOpen, isOpen } = useContext(CartContext)
    const [cart, refetch] = useCart()
    const [removerCart, setRemoveCart] = useState([])

    const sidebarRef = useRef(null);
    useEffect(() => {
        // Function to handle click outside of the sidebar
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                fetch(`https://book-ocean-bd-server.vercel.app/carts/${item._id}`, {
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
                        // setIsOpen(false)
                    })
            }
        });
    }


    return (
        <div className="w-full h-full px-4 text-white " ref={sidebarRef}
        >
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
                        </div>
                        {/* Subtotal: */}
                        <div className='flex justify-between text-2xl'>
                            <div>Subtotal:</div>
                            <div>
                                {parseFloat(total.toFixed(2))} <span>&#x09F3;</span>

                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* button  */}
            <div className='p-6'>
                {
                    cart.length >= 1 ?
                        <div className='flex justify-between gap-x-4'
                            onClick={() => setIsOpen(!isOpen)}>
                            {/* clear cart  */}
                            {/* <button

                                onClick={handleclearCart}
                                className='btn bg-blue-400 hover:bg-blue-200 text-primary'
                            >Clear Cart</button> */}


                            {/* check out  */}
                            <Link to='/checkout' >
                                <button
                                    className='btn bg-blue-400 hover:bg-blue-200 text-primary flex-1 px-2 gap-x-2'>Procced to buy ({cart.length}
                                    {cart.length === 1 ? ' item' : ' items'})
                                    <IoArrowForward className='text-lg'></IoArrowForward></button>
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