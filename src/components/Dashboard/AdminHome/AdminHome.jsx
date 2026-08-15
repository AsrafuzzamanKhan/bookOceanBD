import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaBook, FaUsers, FaShoppingCart, FaMoneyBillWave, FaPlus, FaListUl } from 'react-icons/fa';
import { MdManageHistory, MdOutlineDevicesOther } from 'react-icons/md';

const statMeta = [
    { key: 'products', label: 'Total Books', icon: FaBook, color: 'text-blue-500' },
    { key: 'users', label: 'Total Users', icon: FaUsers, color: 'text-green-500' },
    { key: 'orders', label: 'Total Orders', icon: FaShoppingCart, color: 'text-orange-500' },
    { key: 'revenue', label: 'Total Revenue', icon: FaMoneyBillWave, color: 'text-emerald-500', isCurrency: true },
];

const quickLinks = [
    { to: '/dashboard/addBook', label: 'Add Book', icon: FaPlus },
    { to: '/dashboard/manageBooks', label: 'Manage Books', icon: MdManageHistory },
    { to: '/dashboard/addBanner', label: 'Add Banner', icon: MdOutlineDevicesOther },
    { to: '/dashboard/allOrders', label: 'All Orders', icon: FaListUl },
    { to: '/dashboard/allUsers', label: 'All Users', icon: FaUsers },
];

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    approve: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    canceled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const AdminHome = () => {
    const [axiosSecure] = useAxiosSecure();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        },
    });

    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ['adminHomeRecentOrders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/allOrders');
            return res.data;
        },
    });

    const recentOrders = orders.slice().reverse().slice(0, 5);

    return (
        <div className='container mx-auto'>
            <Helmet>
                <title>Book Ocean BD || Admin Home</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen px-2 lg:px-0">
                <div className='text-center mb-8'>
                    <h1 className='bg-slate-800 text-white px-8 py-3 rounded inline-block'>Admin Home</h1>
                </div>

                {/* stat cards */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    {statMeta.map((meta) => {
                        const Icon = meta.icon;
                        return (
                            <div key={meta.key} className='border dark:border-0 dark:bg-gray-800 rounded-[8px] p-5 shadow-sm hover:shadow-md duration-300'>
                                <Icon size={26} className={`${meta.color} mb-2`} />
                                <p className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400'>{meta.label}</p>
                                <p className='text-2xl font-bold dark:text-white'>
                                    {statsLoading
                                        ? <span className='loading loading-spinner loading-sm'></span>
                                        : meta.isCurrency
                                            ? `৳${Number(stats?.[meta.key] || 0).toLocaleString()}`
                                            : Number(stats?.[meta.key] || 0).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* quick actions */}
                <div className='mb-8'>
                    <h2 className='text-lg font-semibold mb-3 dark:text-white'>Quick Actions</h2>
                    <div className='flex flex-wrap gap-3'>
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className='flex items-center gap-2 px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 duration-300'
                                >
                                    <Icon /> {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* recent orders */}
                <div>
                    <div className='flex justify-between items-center mb-3'>
                        <h2 className='text-lg font-semibold dark:text-white'>Recent Orders</h2>
                        <Link to='/dashboard/allOrders' className='text-blue-500 hover:underline text-sm'>View all</Link>
                    </div>

                    {ordersLoading ? (
                        <div className='text-center py-8'>
                            <span className='loading loading-spinner loading-md'></span>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <p className='dark:text-white border dark:border-0 dark:bg-gray-800 rounded-[8px] p-5'>No orders yet.</p>
                    ) : (
                        <div className='overflow-x-auto border dark:border-0 dark:bg-gray-800 rounded-[8px]'>
                            <table className='table w-full'>
                                <thead>
                                    <tr className='dark:text-white'>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className='dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 duration-300'>
                                            <td>{order.data?.name}</td>
                                            <td>{order.date}</td>
                                            <td>{order.orderQuantity}</td>
                                            <td>৳{order.totalAmount}</td>
                                            <td>
                                                <span className={`capitalize px-2 py-1 rounded text-xs font-semibold ${statusStyles[order.status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
