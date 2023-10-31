import { useContext, useState } from "react";
import SearchForm from "../../SearchForm/SearchForm";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import { FiMenu, FiShoppingBag } from 'react-icons/fi'
import CategoryNavMobile from "../../CategoryNavMobile/CategoryNavMobile";
import { Link } from "react-router-dom";
import Cart from "../../Cart/Cart";

const Header = () => {
    const { isOpen, setIsOpen, itemsAmount } = useContext(CartContext)
    const [catNavMobile, setCatNavMobile] = useState(false)
    return (
        <header className="bg-black text-white py-6 px-2 fixed xl:fixed w-full top-0 z-40 lg:relative lg:mb-[30px] ">
            <div className="container mx-auto  ">
                <div className="flex flex-row gap-4 lg:items-center justify-between mb-4   xl:mb-0">
                    {/* menu  */}
                    <div
                        onClick={() => setCatNavMobile(true)}
                        className="text-3xl lg:hidden cursor-pointer"
                    >
                        <FiMenu></FiMenu>
                    </div>
                    {/* category mobile nav  */}
                    <div className={`${catNavMobile ? 'left-0' : '-left-full'} fixed top-0 bottom-0 z-30 bg-slate-700 "w-2/3 h-screen transition-all duration-200 `}>
                        <CategoryNavMobile
                            setCatNavMobile={setCatNavMobile}
                        ></CategoryNavMobile>
                    </div>

                    {/* logo  */}
                    <Link to={'/'} className="text-2xl font-bold"> BOOK OCEAN BD</Link>

                    {/* search in dextop  */}
                    <div className="hidden lg:flex lg:max-w-[738px] rounded-lg w-full ">
                        <SearchForm></SearchForm>
                    </div>
                    {/* phone and cart 
                     */}
                    <div className="flex items-center gap-x-[10px]">
                        <Link to='/login'> Login</Link>

                        {/* cart icon  */}
                        <div onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer">
                            <FiShoppingBag className="text-2xl"></FiShoppingBag>

                            {/* amount  */}

                            <div className="bg-blue-400 absolute w-[18px] h-[18px] rounded-full top-3 -right-1 text-[14px] flex justify-center items-center font-bold tracking-[0.1em]">
                                {itemsAmount}
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
            </div>
        </header>
    );
};

export default Header;