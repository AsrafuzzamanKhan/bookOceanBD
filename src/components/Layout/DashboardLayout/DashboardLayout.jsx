import { useContext, useState } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../../../assets/logo/book.png'
import useAuth from '../../../hooks/useAuth';
import { FaBook, FaCalendarAlt, FaHome, FaShoppingCart, FaSitemap, FaUsers, FaUtensils, FaWallet, FaWindowClose } from 'react-icons/fa';

import useAdmin from '../../../hooks/useAdmin';
const DashboardLayout = () => {
    const [open, setOpen] = useState(true)
    const { user } = useAuth()
    const [isAdmin] = useAdmin()
    // const isAdmin = true

    return (
        <div className='flex'>
            <div className='fixed'>
                <div className={`${open ? 'w-72' : 'w-20'} duration-300 h-screen bg-[#081A51] relative p-5 pt-8  `}>
                    <div
                        onClick={() => setOpen(!open)}
                        className={`absolute cursor-pointer -right-3 top-9 w-7 bg-white border-[#081A51] rounded-full ${!open && 'rotate-180  '}`}>
                        <BsArrowLeftCircle size={30} bg-white></BsArrowLeftCircle>
                    </div>
                    {/* logo  */}
                    <Link to='/' className='flex gap-x-4 items-center'>
                        <img src={logo} className={`cursor-pointer duration-500 w-14`} alt="logo" />
                        <h2 className={`text-white origin-left font-medium text-2xl duration-300 ${(!open) && 'scale-0'}`}>Book Ocaen BD</h2>
                    </Link>
                    <div className='mt-10 max-w-full'>
                        <hr />
                    </div>
                    {/* menu  */}
                    <div className='text-white flex flex-col gap-y-4 mt-6'>

                        {
                            isAdmin ? <>
                                <NavLink to='/dashboard/addBook'>Add Book</NavLink>
                                <NavLink to='/dashboard/manageBooks'>Manage Books</NavLink>
                                <NavLink to='/dashboard/allUsers'>All Users</NavLink>
                            </> : <>
                                <NavLink to='/dashboard/orderHistory'>Order History</NavLink>
                            </>
                        }

                    </div>


                </div>
            </div>
            <div className={`${(open) ? 'pl-80' : 'pl-32'} w-full flex-1 h-screen duration-500`}>
                <div>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>

        // copppp 
        // <div className="flex">

        //     <div className="className={`${open ? 'w-72' : 'w-20'} duration-300 h-screen bg-[#081A51] relative p-5 pt-8 `}">

        //         <div className="my-2">
        //             <label htmlFor="my-drawer-2" className=" lg:hidden">
        //                 <FaWindowClose className=" hover:scale-110 cursor-pointer duration-300" size={30}></FaWindowClose>
        //             </label>
        //         </div>
        //         <div className="px-4 my-4">
        //             <Outlet></Outlet>
        //         </div>
        //     </div>

        //     <div className="drawer-side ">
        //         <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        //         <div className='text-white flex flex-col gap-y-4 mt-6'>
        //             <ul className="menu p-4 w-80 min-h-full bg-[#D1A054] text-base-content">

        //                 <label htmlFor="my-drawer-2" className=" lg:hidden"><FaWindowClose className="text-3xl hover:scale-110 cursor-pointer duration-300"></FaWindowClose></label>


        //                 <li>
        //                     <NavLink to='/dashboard/adminhome'><FaHome /> Admin Home
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink to='/dashboard/addBooks'> <FaUtensils></FaUtensils> Add Books</NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink to='/dashboard/manageItems'> <FaSitemap></FaSitemap>
        //                         Manage Items
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink>
        //                         <FaBook></FaBook> Manage Bookings
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink to='/dashboard/allusers'>
        //                         <FaUsers></FaUsers> Manage All USers
        //                     </NavLink>
        //                 </li>
        //                 <li><NavLink to='/dashboard/mycart'> <FaShoppingCart />Cart
        //                     <div className="badge badge-secondary">

        //                         + {cart?.length || 0}
        //                     </div>

        //                 </NavLink></li>


        //                 <li><NavLink to='/dashboard/userhome'><FaHome /> User Home</NavLink></li>
        //                 <li><NavLink to='/dashboard/reservations'> <FaCalendarAlt></FaCalendarAlt> Reservation </NavLink></li>
        //                 <li><NavLink to='/dashboard/history'> <FaWallet></FaWallet>Payment </NavLink></li>
        //                 <li><NavLink to='/dashboard/mycart'> <FaShoppingCart />Cart
        //                     <div className="badge badge-secondary">

        //                         +{cart?.length || 0}
        //                     </div>

        //                 </NavLink></li>





        //                 <div className="divider"></div>

        //                 <li><NavLink to='/'> <FaHome />Home</NavLink></li>
        //                 <li><NavLink to='/menu'>Menu</NavLink></li>
        //                 <li><NavLink to='/order/salad'>Order</NavLink></li>


        //             </ul>
        //         </div>

        //     </div>
        // </div>

    );
};

export default DashboardLayout;