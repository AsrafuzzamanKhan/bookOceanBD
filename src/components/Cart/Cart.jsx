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

    // per-line total, not just unit price - a cart line can now be more than
    // one copy of the same book (see CartItem's quantity stepper)
    const total = cart.reduce((sum, item) => sum + parseInt(item.discountPrice) * (item.quantity || 1), 0)
    const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)




    return (
        <div className="w-full h-full px-3 sm:px-4 text-white flex flex-col" ref={sidebarRef}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className='text-3xl sm:text-4xl w-full h-[60px] sm:h-[70px] flex justify-start items-center cursor-pointer flex-shrink-0'>
                <IoMdClose></IoMdClose>
            </div>
            <div className='overflow-y-auto overflow-x-hidden flex-1 min-h-0'>
                {
                    cart.length === 0 &&
                    <div className='h-full flex justify-center items-center flex-col text-white/30'>
                        <h1 className='text-xl sm:text-2xl text-center px-4'> Your Cart is Empty</h1>
                        <div className='text-5xl sm:text-6xl'>
                            <IoCart></IoCart>
                        </div>
                    </div>
                }

                <div className='flex flex-col gap-y-6 sm:gap-y-8 px-1 sm:px-2 pb-4'>

                    {
                        cart.map((item, i) => {
                            return <CartItem key={i} item={item} />
                        })
                    }
                </div>
            </div>
            {/* subtotal and total  */}
            {
                cart.length >= 1 &&
                // extra bottom padding (+ safe-area-inset for notched phones)
                // so the button has real breathing room above the screen
                // edge instead of sitting flush against it on mobile
                <div className='flex flex-col gap-4 sm:gap-6 flex-shrink-0 pt-3 sm:pt-4 pb-6 sm:pb-8 border-t border-white/10' style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                    {/* Subtotal: */}
                    <div className='flex justify-between text-xl sm:text-2xl px-4 sm:px-6'>
                        <h1>Subtotal:</h1>
                        <p>
                            {total} <span>&#x09F3;</span>
                        </p>
                    </div>
                    {/* button  */}
                    <div className='px-4 sm:px-6'
                        onClick={() => setIsOpen(!isOpen)}>
                        <Link to='/checkout' className='block'>
                            <button
                                className='btn bg-blue-400 hover:bg-blue-200 text-primary w-full px-2 gap-x-2 flex-wrap text-center'>
                                Proceed to buy ({totalItemCount}
                                {totalItemCount === 1 ? ' item' : ' items'})
                                <IoArrowForward className='text-lg'></IoArrowForward>
                            </button>
                        </Link>
                    </div>
                </div>
            }
        </div >
    );
};

export default Cart;