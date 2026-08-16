import { useContext, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoArrowForward, IoCart } from 'react-icons/io5';

import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom';

import useCart from '../../hooks/useCart';

import { CartContext } from '../../providers/CartProvider/CartProvider';


const Cart = () => {
    const { setIsOpen, isOpen } = useContext(CartContext)
    const [cart] = useCart()

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
        <div className="w-full h-full text-gray-900 dark:text-white flex flex-col" ref={sidebarRef}>
            {/* header  */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-[60px] sm:h-[70px] flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    Your Cart
                    {totalItemCount > 0 && (
                        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full px-2 py-0.5">
                            {totalItemCount}
                        </span>
                    )}
                </h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Close cart"
                    className="text-2xl p-1 -m-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer">
                    <IoMdClose />
                </button>
            </div>

            {/* items  */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
                {
                    cart.length === 0 &&
                    <div className='h-full flex justify-center items-center flex-col text-center px-6 gap-3'>
                        <div className="text-6xl text-gray-200 dark:text-gray-700">
                            <IoCart />
                        </div>
                        <h1 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>Your cart is empty</h1>
                        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-[220px]">
                            Looks like you haven&apos;t added any books yet.
                        </p>
                        <Link
                            to='/'
                            onClick={() => setIsOpen(false)}
                            className="mt-2 text-sm font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Browse books &rarr;
                        </Link>
                    </div>
                }

                <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800 px-4 sm:px-6'>
                    {
                        cart.map((item, i) => {
                            return <CartItem key={i} item={item} />
                        })
                    }
                </div>
            </div>

            {/* subtotal and checkout  */}
            {
                cart.length >= 1 &&
                // extra bottom padding (+ safe-area-inset for notched phones)
                // so the button has real breathing room above the screen
                // edge instead of sitting flush against it on mobile
                <div className='flex flex-col gap-3 flex-shrink-0 pt-4 pb-6 sm:pb-8 px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-black/20' style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                    <div className='flex justify-between items-baseline'>
                        <h1 className="text-base font-medium text-gray-500 dark:text-gray-400">Subtotal</h1>
                        <p className="text-2xl font-bold">
                            &#x09F3;{total.toLocaleString()}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
                        Delivery charge calculated at checkout.
                    </p>
                    <Link to='/checkout' className='block mt-1' onClick={() => setIsOpen(!isOpen)}>
                        <button
                            className='btn bg-blue-500 hover:bg-blue-600 border-0 text-white w-full gap-x-2 flex-wrap text-center shadow-sm'>
                            Proceed to buy ({totalItemCount}
                            {totalItemCount === 1 ? ' item' : ' items'})
                            <IoArrowForward className='text-lg'></IoArrowForward>
                        </button>
                    </Link>
                </div>
            }
        </div>
    );
};

export default Cart;
