import { useContext, useState } from "react";
import SearchForm from "../../SearchForm/SearchForm";
import { FiLogIn, FiLogOut, FiMenu, FiShoppingBag } from 'react-icons/fi'
import { FaClipboardList, FaRegUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import CategoryNavMobile from "../../CategoryNavMobile/CategoryNavMobile";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cart from "../../Cart/Cart";
import { AuthContext } from "../../../providers/AuthProvider/AuthProvider";
import useCart from "../../../hooks/useCart";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import useAdmin from "../../../hooks/useAdmin";
import logoSvg from '../../../assets/logo/navlogo.png'
import { showSuccessToast } from "../../../utils/toast";
import NotificationBell from "../NotificationBell/NotificationBell";
import ThemeToggle from "../ThemeToggle/ThemeToggle";


const Header = () => {
    const { user, logOut } = useContext(AuthContext)
    const [catNavMobile, setCatNavMobile] = useState(false);
    const { isOpen, setIsOpen } = useContext(CartContext);
    const navigate = useNavigate()
    // -----
    const [cart] = useCart()
    const [isAdmin] = useAdmin()


    const handleLogOut = () => {
        logOut()
            .then(() => {
                showSuccessToast("You have successfully logged out");
                // Sign-out successful.
                navigate('/')
                // console.log(navigate)
            }).catch((error) => {
                console.log(error)
                // An error happened.
            });
    }
    return (
        <header className="bg-black text-white py-2 lg:py-4 px-[2vw] fixed w-full top-0 z-40 border-b border-white/10">
            <div className="container mx-auto">
                <div className="flex flex-row gap-3 md:gap-5 items-center justify-between mb-2 lg:mb-0">
                    {/* menu  */}
                    <button
                        onClick={() => setCatNavMobile(true)}
                        aria-label="Open categories"
                        className="flex items-center justify-center w-9 h-9 rounded-full text-2xl lg:hidden cursor-pointer hover:bg-white/10 transition-colors -ml-1.5"
                    >
                        <FiMenu></FiMenu>
                    </button>
                    {/* category mobile nav  */}
                    <div className={`${catNavMobile ? 'left-0' : '-left-full'} fixed top-0 bottom-0 z-30 bg-slate-700 lg:w-1/3 w-3/4 transition-all duration-700  overflow-y-auto overflow-x-hidden `}>
                        <CategoryNavMobile
                            setCatNavMobile={setCatNavMobile}
                        ></CategoryNavMobile>
                    </div>

                    {/* logo  */}
                    <Link to={'/'} className="w-[150px] md:w-[210px] shrink-0" >
                        <img className="" src={logoSvg} alt="Book Ocean BD" />
                    </Link>

                    {/* search in dextop  */}
                    <div className="hidden lg:flex lg:max-w-[600px] xl:max-w-[700px] w-full mx-auto">
                        <SearchForm></SearchForm>
                    </div>


                    {/* phone and cart
                     */}

                    <div className="flex items-center justify-center gap-x-0.5 md:gap-x-1 shrink-0">

                        {/* drop down  */}
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end cursor-pointer ">
                            <label tabIndex={0} className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="avatar online placeholder">
                                    <div className="bg-gray-700 dark:bg-gray-600 text-white rounded-full w-6 md:w-7 ring-2 ring-transparent hover:ring-blue-400 duration-300 flex items-center justify-center overflow-hidden">
                                        {user?.photoURL
                                            ? <img src={user.photoURL} alt={user?.displayName} referrerPolicy="no-referrer" />
                                            : <FaRegUserCircle className="text-lg md:text-xl" />
                                        }
                                    </div>
                                </div>

                            </label>
                            <div tabIndex={0} className="dropdown-content z-[1] mt-3 w-64 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                {user?.email ? (
                                    <>
                                        {/* user info  */}
                                        <div className="flex items-center gap-3 p-4 bg-slate-900">
                                            <div className="avatar">
                                                <div className="w-11 rounded-full ring-2 ring-blue-400 overflow-hidden">
                                                    {user?.photoURL
                                                        ? <img src={user.photoURL} alt={user?.displayName} referrerPolicy="no-referrer" />
                                                        : <div className="bg-gray-700 text-white flex items-center justify-center h-full"><FaRegUserCircle className="text-2xl" /></div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white truncate">{user?.displayName || 'Welcome'}</p>
                                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                        </div>

                                        {/* menu  */}
                                        <ul className="py-2">
                                            <li>
                                                <NavLink
                                                    to={isAdmin ? '/dashboard/adminhome' : "/dashboard/orderHistory"}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200"
                                                >
                                                    {isAdmin ? <MdDashboard size={18} /> : <FaClipboardList size={16} />}
                                                    {isAdmin ? "Dashboard" : "My Order List"}
                                                </NavLink>
                                            </li>
                                        </ul>
                                        <div className="border-t dark:border-gray-700">
                                            <button
                                                onClick={handleLogOut}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 duration-200"
                                            >
                                                <FiLogOut size={18} /> Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Sign in to track orders and manage your cart.</p>
                                        <Link
                                            to='/login'
                                            className="flex items-center justify-center gap-2 w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600 duration-200"
                                        >
                                            <FiLogIn size={18} /> Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* theme switch - a device/browser preference, so it's
                            shown to everyone, not just logged-in users */}
                        <ThemeToggle />

                        {/* notification bell - only for logged-in users */}
                        {user?.email && <NotificationBell />}

                        {/* cart icon  */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Open cart"
                            className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <FiShoppingBag className="text-lg md:text-xl"></FiShoppingBag>

                            {/* amount - total copies across all lines, not just distinct books */}
                            <div className="flex justify-center items-center bg-blue-500 text-white absolute w-[18px] h-[18px] rounded-full top-0.5 right-0.5 text-[11px] font-semibold ring-2 ring-black">
                                {cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0}
                            </div>
                        </button>

                        {/* backdrop - dims the rest of the page while the cart is
                            open, so the panel reads as the one focused thing on
                            screen instead of just floating over an unchanged page.
                            Also closes the cart on click; pointer-events-none while
                            closed so it never sits invisibly on top of the page
                            intercepting clicks. */}
                        <div
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                            className={`${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} fixed inset-0 bg-black/50 z-10 transition-opacity duration-300`}
                        ></div>

                        {/* cart  */}
                        {/* no explicit height here on purpose - top-0 + bottom-0 on a
                            fixed element already sizes it to the real visible
                            viewport. h-screen (100vh) used to be set here too, but
                            100vh doesn't shrink for mobile browser chrome (address
                            bar, bottom nav) the way top/bottom-based sizing does, so
                            on a real phone the drawer was taller than what's
                            actually visible and pushed the Proceed button below the
                            fold, out of reach.
                            width is capped at every breakpoint (not just md: and up)
                            so it reads as a focused side panel instead of taking over
                            the full screen on narrower windows/phones. */}
                        <div className={`${isOpen ? 'right-0' : '-right-full'} bg-white dark:bg-gray-900 shadow-2xl fixed top-0 bottom-0 w-full max-w-[420px] z-20 transition-all duration-300`}>
                            <Cart></Cart>
                        </div>

                    </div>
                </div>
                {/* search for mobile only  */}
                <div className="lg:hidden">
                    <SearchForm></SearchForm>
                </div>
            </div >
        </header >
    );
};

export default Header;