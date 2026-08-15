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
        <header className="bg-black text-white py-2 lg:py-4 px-[2vw] fixed  w-full top-0 z-40  ">
            <div className="container mx-auto">
                <div className="flex flex-row gap-4 items-center justify-between  mb-2 lg:mb-0">
                    {/* menu  */}
                    <div
                        onClick={() => setCatNavMobile(true)}
                        className="text-3xl lg:hidden cursor-pointer"
                    >
                        <FiMenu></FiMenu>
                    </div>
                    {/* category mobile nav  */}
                    <div className={`${catNavMobile ? 'left-0' : '-left-full'} fixed top-0 bottom-0 z-30 bg-slate-700 lg:w-1/3 w-3/4 transition-all duration-700  overflow-y-auto overflow-x-hidden `}>
                        <CategoryNavMobile
                            setCatNavMobile={setCatNavMobile}
                        ></CategoryNavMobile>
                    </div>

                    {/* logo  */}
                    <Link to={'/'} className="w-[200px] md:w-[250px]" >
                        <img className="" src={logoSvg} alt="" />
                    </Link>

                    {/* search in dextop  */}
                    <div className="hidden lg:flex lg:max-w-[700px] rounded-lg w-full ">
                        <SearchForm></SearchForm>
                    </div>


                    {/* phone and cart 
                     */}

                    <div className="flex items-center justify-center gap-x-[10px] ">

                        {/* drop down  */}
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end cursor-pointer ">
                            <label tabIndex={0} >
                                <div className="avatar online placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-7 md:w-10 ring-2 ring-transparent hover:ring-blue-400 duration-300">
                                        {user ? <img src={user?.photoURL} alt={user?.displayName} referrerPolicy="no-referrer" /> : <><FaRegUserCircle /></>}

                                    </div>
                                </div>

                            </label>
                            <div tabIndex={0} className="dropdown-content z-[1] mt-3 w-64 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                {user?.email ? (
                                    <>
                                        {/* user info  */}
                                        <div className="flex items-center gap-3 p-4 bg-slate-900">
                                            <div className="avatar">
                                                <div className="w-11 rounded-full ring-2 ring-blue-400">
                                                    {user?.photoURL
                                                        ? <img src={user.photoURL} alt={user?.displayName} referrerPolicy="no-referrer" />
                                                        : <div className="bg-neutral text-neutral-content flex items-center justify-center h-full"><FaRegUserCircle className="text-2xl" /></div>
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


                        {/* cart icon  */}
                        <div onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer">
                            <FiShoppingBag className="text-2xl md:text-3xl"></FiShoppingBag>

                            {/* amount  */}
                            {/* cart total  */}
                            <div className="flex justify-center items-center bg-blue-400 absolute w-[18px] h-[18px] rounded-full top-3 -right-1 text-[14px] font-semibold ">{cart?.length || 0}</div>
                        </div>

                        {/* cart  */}
                        <div className={`${isOpen ? 'right-0' : '-right-full'}  bg-black shadow-xl fixed top-0 bottom-0 w-full h-screen z-10 md:max-w-[500px] transition-all duration-300`}>
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