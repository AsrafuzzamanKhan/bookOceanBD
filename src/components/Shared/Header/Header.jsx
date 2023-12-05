import { useContext, useState } from "react";
import SearchForm from "../../SearchForm/SearchForm";

import { FiMenu, FiShoppingBag } from 'react-icons/fi'
import { FaRegUserCircle } from "react-icons/fa";
import CategoryNavMobile from "../../CategoryNavMobile/CategoryNavMobile";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cart from "../../Cart/Cart";
import { AuthContext } from "../../../providers/AuthProvider/AuthProvider";

import useCart from "../../../hooks/useCart";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import useAdmin from "../../../hooks/useAdmin";

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
                // Sign-out successful.
                navigate('/')
                // console.log(navigate)
            }).catch((error) => {
                console.log(error)
                // An error happened.
            });
    }
    return (
        <header className="bg-black text-white py-3 lg:py-4 px-2 fixed xl:fixed w-full top-0 z-40 lg:relative lg:mb-[30px] ">
            <div className="container mx-auto  ">
                <div className="flex flex-row gap-4 items-center justify-between  mb-2   xl:mb-0">
                    {/* menu  */}
                    <div
                        onClick={() => setCatNavMobile(true)}
                        className="text-3xl lg:hidden cursor-pointer"
                    >
                        <FiMenu></FiMenu>
                    </div>
                    {/* category mobile nav  */}
                    <div className={`${catNavMobile ? 'left-0' : '-left-full'} fixed top-0 bottom-0 z-30 bg-slate-700 lg:w-1/3 w-1/2 h-[70vh]transition-all duration-700  overflow-y-auto overflow-x-hidden `}>
                        <CategoryNavMobile
                            setCatNavMobile={setCatNavMobile}
                        ></CategoryNavMobile>
                    </div>

                    {/* logo  */}
                    <Link to={'/'} className="text-xl lg:text-2xl font-bold"> BOOK OCEAN BD</Link>

                    {/* search in dextop  */}
                    <div className="hidden lg:flex lg:max-w-[738px] rounded-lg w-full ">
                        <SearchForm></SearchForm>
                    </div>


                    {/* phone and cart 
                     */}

                    <div className="flex items-center justify-center gap-x-[10px] ">
                        {/* drop down  */}
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end ">
                            <label tabIndex={0} >
                                <div className="avatar online placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full  w-10">
                                        {user ? <img src={user?.photoURL} alt={user?.displayName} /> : <><FaRegUserCircle /></>}

                                    </div>
                                </div>

                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 dark:bg-white">
                                <li className="bg-black p-2 rounded">Hello, {user?.displayName}</li>
                                {
                                    user?.email && <li className="mt-4">
                                        <NavLink to={isAdmin ? '/dashboard/adminhome' : "/dashboard/userhome"
                                        } className='text-black text-lg dark:hover:text-gray-300'>Dashbord</NavLink></li>
                                }
                                <li className="mt-2">
                                    <div className=" text-black hover:scale-95 hover:bg-slate-400 dark:hover:bg-blue-400
                                    dark:hover:text-white
                                    ">
                                        {user?.email ?
                                            <button onClick={handleLogOut} className="text-xl ">Logout</button>
                                            :
                                            <Link className="text-xl" to='/login'> Login</Link>
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>


                        {/* cart icon  */}
                        <div onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer">
                            <FiShoppingBag size={30}></FiShoppingBag>

                            {/* amount  */}
                            {/* cart total  */}
                            <div className="bg-blue-400 absolute w-[18px] h-[18px] rounded-full top-3 -right-1 text-[14px] flex justify-center items-center font-bold tracking-[0.1em]">
                                {/* {itemsAmount} */}
                                {cart?.length || 0}
                            </div>
                        </div>

                        {/* cart  */}
                        <div className={`${isOpen ? 'right-0' : '-right-full'}  bg-black shadow-xl fixed top-0 bottom-0 w-full h-screen z-10 md:max-w-[500px] transition-all duration-300`}>
                            <Cart></Cart>
                        </div>

                    </div>
                </div>
                {/* search for mobile only  */}
                <div className=" lg:hidden">
                    <SearchForm></SearchForm>
                </div>
            </div >
        </header >
    );
};

export default Header;