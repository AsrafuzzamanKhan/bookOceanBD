import { useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import useUserOrder from "../../../hooks/useUserOrder";

import { FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";

import Swal from "sweetalert2";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import { Link } from "react-router-dom";
import { STATUS_META, orderDateValue } from "../../../utils/orderStatus";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const OrderHistory = () => {
    const { user } = useAuth()
    const [order, refetch] = useUserOrder()
    const [axiosSecure] = useAxiosSecure()
    const [statusFilter, setStatusFilter] = useState('all')

    const approve = order.filter(pd => pd.status === 'approve');
    const pending = order.filter(pd => pd.status === 'pending');
    const cancel = order.filter(pd => pd.status === 'canceled');
    const deliver = order.filter(pd => pd.status === 'delivered');

    // most recent order first
    const sortedOrders = [...order].sort((a, b) => orderDateValue(b) - orderDateValue(a));
    const visibleOrders = statusFilter === 'all'
        ? sortedOrders
        : sortedOrders.filter(o => o.status === statusFilter);

    // counts always reflect the full list, not the active filter - so
    // switching filters doesn't make the other tabs' numbers disappear
    const filters = [
        { key: 'all', label: 'All', count: order.length },
        { key: 'delivered', label: 'Delivered', count: deliver.length },
        { key: 'approve', label: 'Approved', count: approve.length },
        { key: 'pending', label: 'Pending', count: pending.length },
        { key: 'canceled', label: 'Canceled', count: cancel.length },
    ];

    const handleCancelOrder = item => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // was a bare fetch() with no auth header; the server route
                // now requires login + that the order actually belongs to you
                axiosSecure.delete(`/orders/${item._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch()
                            showSuccessToast("Canceled!", "Your Order has been Canceled and Removed from History.")
                        }
                    })
                    .catch(err => showErrorToast('Could not cancel order', err.response?.data?.message || err.message))
            }
        });
    }



    return (
        <div className="pt-32 md:pt-32 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-950/40 min-h-screen">
            <Helmet>
                <title>Book Ocean BD | Order History</title>
            </Helmet>
            <div className="container mx-auto px-4 lg:px-0">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {user?.displayName ? `${user.displayName}'s Order History` : 'Order History'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track every order you&apos;ve placed, newest first.</p>
                </div>

                {/* status filter - also doubles as the at-a-glance counts  */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {filters.map(({ key, label, count }) => {
                        const isActive = statusFilter === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setStatusFilter(key)}
                                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${isActive
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-400'}`}
                            >
                                {label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* orders  */}
                {order.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiClock className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No orders yet</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Your placed orders will show up here.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                        >
                            Browse books
                        </Link>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiClock className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No {STATUS_META[statusFilter]?.label.toLowerCase()} orders</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Try a different filter.</p>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                        >
                            Show all orders
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto flex flex-col gap-4">
                        {visibleOrders.map((singleOrder) => {
                            const meta = STATUS_META[singleOrder.status] || STATUS_META.pending;
                            const StatusIcon = meta.icon;
                            return (
                                <div key={singleOrder._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                                    {/* header  */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${meta.badge}`}>
                                            <StatusIcon size={13} /> {meta.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">৳{singleOrder.totalAmount}</span>
                                    </div>

                                    <div className="p-5 flex flex-col md:flex-row gap-5">
                                        {/* delivery info  */}
                                        <div className="md:w-56 shrink-0 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-2"><FiCalendar className="text-blue-400 shrink-0" size={14} /> {singleOrder.date}</div>
                                            <div className="flex items-center gap-2"><FaUser className="text-blue-400 shrink-0" size={13} /> {singleOrder.data?.name}</div>
                                            <div className="flex items-center gap-2"><FaPhone className="text-blue-400 shrink-0" size={13} /> {singleOrder.data?.phone}</div>
                                            <div className="flex items-start gap-2"><FaMapMarkerAlt className="text-blue-400 shrink-0 mt-0.5" size={13} /> <span>{singleOrder.data?.address}</span></div>

                                            <div className="mt-2">
                                                {singleOrder.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(singleOrder)}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 transition-colors duration-200"
                                                    >
                                                        Cancel order
                                                    </button>
                                                )}
                                                {singleOrder.status === 'canceled' && <span className="text-xs text-red-400">This order was canceled.</span>}
                                                {singleOrder.status === 'approve' && <span className="text-xs text-blue-500 dark:text-blue-400">The parcel is ready for delivery.</span>}
                                                {singleOrder.status === 'delivered' && <span className="text-xs text-green-600 dark:text-green-400">Thank you for purchasing.</span>}
                                            </div>
                                        </div>

                                        {/* books  */}
                                        <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
                                            {singleOrder.cart.map((book, i) => (
                                                <Link
                                                    key={i}
                                                    to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                    className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                                                >
                                                    <div className="w-10 h-14 shrink-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                                        <img className="w-full h-full object-cover" src={book.image} alt={book.name} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{book.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">by {book.author}</p>
                                                    </div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">৳{book.discountPrice}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
};

export default OrderHistory;
