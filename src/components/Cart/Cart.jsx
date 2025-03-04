import { useContext, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoArrowForward, IoCart } from 'react-icons/io5';

import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom';

import useCart from '../../hooks/useCart';

import { CartContext } from '../../providers/CartProvider/CartProvider';


const Cart = () => {
    const { setIsOpen, isOpen } = useContext(CartContext)
    const [cart, refetch] = useCart()

    // const [productQuantity, setProductQuantity] = useState()

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
    }, [setIsOpen]);

    const total = cart.reduce((sum, item) => parseInt(item.discountPrice) + sum, 0)
    // const total = cart.reduce((sum, item) => parseInt(item.price) + sum, 0)
    // console.log(parseInt(total))




    return (
        <div className="w-full h-full px-4 text-white " ref={sidebarRef}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className='text-4xl w-full h-[70px] flex justify-start items-center cursor-pointerfixed'>
                <IoMdClose></IoMdClose>
            </div>
            <div className='overflow-y-auto overflow-x-hidden h-[70vh]  '>
                {/* close icon  */}


                <div className='flex flex-col gap-y-10 px-2'>

                    {
                        cart.map((item, i) => {
                            return <CartItem key={i} item={item} />
                        })
                    }
                </div>
            </div>
            {/* subtotal and total  */}
            <div className='flex flex-col gap-8'>
                <div className=''>
                    {
                        cart.length >= 1 && < div className=''>
                            <div className='px-6 flex flex-col '>
                                {/* sub  */}
                                <div className='flex justify-between'>
                                </div>
                                {/* Subtotal: */}
                                <div className='flex justify-between text-2xl'>
                                    <h1>Subtotal:</h1>
                                    <p>
                                        {total} <span>&#x09F3;</span>
                                        {/* {parseFloat(total.toFixed(2))} <span>&#x09F3;</span> */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {/* button  */}
                <div className='px-6'>
                    {
                        cart.length >= 1 ?
                            <div className='flex justify-between gap-x-4'
                                onClick={() => setIsOpen(!isOpen)}>

                                <Link to='/checkout' >
                                    <button
                                        className='btn bg-blue-400 hover:bg-blue-200 text-primary flex-1 px-2 gap-x-2'>Procced to buy ({cart.length}
                                        {cart.length === 1 ? ' item' : ' items'})
                                        <IoArrowForward className='text-lg'></IoArrowForward></button>
                                </Link>


                            </div>
                            : <div className='h-full  absolute top-0 right-0 left-0 flex justify-center items-center -z-10 flex-col text-white/30'>
                                <h1 className='text-2xl'> Your Cart is Empty</h1>
                                <div className='text-6xl'>
                                    <IoCart></IoCart>
                                </div>
                            </div>

                    }
                </div>
            </div>
        </div >
    );
};

export default Cart;