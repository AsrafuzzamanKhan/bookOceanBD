import { Link, NavLink, Outlet } from "react-router-dom";
import useAdmin from "../../../hooks/useAdmin";
import { IoHomeSharp } from "react-icons/io5";
import { FaBook, FaUsers } from "react-icons/fa";
import { MdManageHistory, MdOutlineDevicesOther } from "react-icons/md";
import { TbDeviceDesktopStar } from "react-icons/tb";
import { ImBooks } from "react-icons/im";
import { RiFileHistoryFill } from "react-icons/ri";
import logo from '../../../assets/logo/book.png'

const DashBoardLayout2 = () => {
    const [isAdmin] = useAdmin()

    return (
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">
                {/* Navbar */}
                <div className="w-full navbar bg-black text-white py-3 lg:py-4 px-2 fixed xl:fixed top-0 z-40 lg:relative lg:mb-[30px]  ">
                    <div className="flex-none  ">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square bg-slate-800 text-white hover:text-black border-none ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-0">
                        {/* logo  */}
                        <Link to='/' className='flex mx-auto gap-x-2 items-center hover:scale-95 duration-300'>
                            <img src={logo}
                                className={`cursor-pointer duration-500 w-14 
                       `} alt="logo" />
                            <h2 className={`text-white uppercase font-semibold origin-left text-2xl duration-300`}>Book Ocean BD</h2>

                        </Link>

                    </div>

                </div>
                {/* Page content here */}
                <Outlet></Outlet>
            </div>
            <div className="drawer-side pt-20">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-black">
                    {/* Sidebar content here */}

                    <div className='text-white flex flex-col gap-y-4 mt-6'>

                        {
                            isAdmin ? <>
                                <NavLink to='/dashboard/adminhome' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <IoHomeSharp size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Admin home</span>
                                </NavLink>
                                <NavLink to='/dashboard/addBook' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <FaBook size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Add Book</span>
                                </NavLink>

                                <NavLink to='/dashboard/manageBooks' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <MdManageHistory size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Manage Books</span>
                                </NavLink>
                                <NavLink to='/dashboard/addBanner' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <MdOutlineDevicesOther size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Add Banner</span>
                                </NavLink>


                                <NavLink to='/dashboard/manageBanner' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <TbDeviceDesktopStar size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Manage Banner</span>
                                </NavLink>

                                <NavLink to='/dashboard/allUsers' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <FaUsers size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>All Users</span>
                                </NavLink>
                                <NavLink to='/dashboard/allOrders' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <ImBooks size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>All Orders</span>
                                </NavLink>

                            </> : <>
                                {/* <NavLink to='/dashboard/userhome' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <IoHomeSharp size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>Home</span>
                                </NavLink> */}

                                <NavLink to='/dashboard/orderHistory' className={`text-gray-300 text-xm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md duration-300`}>
                                    <RiFileHistoryFill size={30} />
                                    <span className={`${!open && 'hidden'} origin-left duration-200`}>All Orders</span>
                                </NavLink>
                            </>
                        }

                    </div>
                </ul>
            </div>
        </div>
    );
};

export default DashBoardLayout2;