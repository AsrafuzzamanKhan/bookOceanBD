import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { showSuccessToast } from "../../../utils/toast";
import { Helmet } from "react-helmet-async";
import { STATUS_META, orderDateValue } from "../../../utils/orderStatus";

import { IoMdPricetags } from "react-icons/io";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

// today's date as 'yyyy-MM-dd' in the browser's local timezone - used for
// the "Today" quick filter and as the max on the date pickers
const todayLocal = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const AllOrders = () => {
    const [axiosSecure] = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/allOrders')
            return res.data;

        }
    });

    const handleApproved = order => {
        axiosSecure.patch(`/orders/approve-order/${order._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    showSuccessToast(`Order approved`)
                }
            })
    }
    const handleCanceled = order => {
        axiosSecure.patch(`/orders/cancel-order/${order._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    showSuccessToast(`Order canceled`)
                }
            })
    }
    const handleDelivery = order => {
        axiosSecure.patch(`/orders/delivery-order/${order._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    showSuccessToast(`Marked as delivered`)
                }
            })
    }

    // newest first - was `.slice().reverse()`, which only happened to work
    // because Mongo's natural find() order is usually (not guaranteedly)
    // insertion order. Sorting by the order's own date is actually correct.
    const sortedOrders = useMemo(
        () => [...orders].sort((a, b) => orderDateValue(b) - orderDateValue(a)),
        [orders]
    );

    const counts = useMemo(() => ({
        pending: orders.filter(o => o.status === 'pending').length,
        approve: orders.filter(o => o.status === 'approve').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        canceled: orders.filter(o => o.status === 'canceled').length,
    }), [orders]);

    const filters = [
        { key: 'all', label: 'All', count: orders.length },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'approve', label: 'Approved', count: counts.approve },
        { key: 'delivered', label: 'Delivered', count: counts.delivered },
        { key: 'canceled', label: 'Canceled', count: counts.canceled },
    ];

    const searchTerm = search.trim().toLowerCase();
    const visibleOrders = sortedOrders
        .filter(o => statusFilter === 'all' || o.status === statusFilter)
        .filter(o => {
            if (!searchTerm) return true;
            const haystack = [o.data?.name, o.email, o.data?.phone, o._id].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(searchTerm);
        })
        .filter(o => {
            if (!dateFrom && !dateTo) return true;
            // order.date is 'yyyy-MM-dd HH:mm:ss' (see Checkout.jsx) - that
            // format sorts/compares correctly as a plain string, so no need
            // to parse it just to bound it against two 'yyyy-MM-dd' inputs
            const orderDay = (o.date || '').slice(0, 10);
            if (dateFrom && orderDay < dateFrom) return false;
            if (dateTo && orderDay > dateTo) return false;
            return true;
        });

    const hasActiveFilters = statusFilter !== 'all' || !!search || !!dateFrom || !!dateTo;
    const clearAllFilters = () => {
        setStatusFilter('all');
        setSearch('');
        setDateFrom('');
        setDateTo('');
    };

    return (
        <div className="pt-32 md:pt-32 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-950/40 min-h-screen">
            <Helmet>
                <title>Book Ocean BD | All Orders</title>
            </Helmet>
            <div className="container mx-auto px-4 lg:px-0">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">All Orders</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{orders.length} total &middot; manage and fulfill every order placed on the site.</p>
                </div>

                {/* status filter  */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
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

                {/* search  */}
                <div className="max-w-sm mx-auto mb-4 relative">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer, email, phone, or order id..."
                        className="w-full h-11 pl-10 pr-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* date range  */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar size={14} />
                        From
                        <input
                            type="date"
                            value={dateFrom}
                            max={dateTo || todayLocal()}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="h-9 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        To
                        <input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            max={todayLocal()}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="h-9 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => { setDateFrom(todayLocal()); setDateTo(todayLocal()); }}
                        className="h-9 px-3 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Today
                    </button>
                    {(dateFrom || dateTo) && (
                        <button
                            type="button"
                            onClick={() => { setDateFrom(''); setDateTo(''); }}
                            className="text-sm font-medium text-blue-500 hover:underline"
                        >
                            Clear dates
                        </button>
                    )}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* orders  */}
                {orders.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiClock className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No orders yet</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Placed orders will show up here.</p>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiSearch className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No matching orders</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Try a different filter or search term.</p>
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">
                        {visibleOrders.map((order) => {
                            const meta = STATUS_META[order.status] || STATUS_META.pending;
                            const StatusIcon = meta.icon;
                            return (
                                <div key={order._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                                    {/* header  */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${meta.badge}`}>
                                            <StatusIcon size={13} /> {meta.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">৳{order.totalAmount}</span>
                                    </div>

                                    <div className="p-5 flex flex-col md:flex-row gap-5">
                                        {/* customer + delivery info  */}
                                        <div className="md:w-64 shrink-0 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-2"><FiCalendar className="text-blue-400 shrink-0" size={14} /> {order.date}</div>
                                            <div className="flex items-center gap-2"><FaUser className="text-blue-400 shrink-0" size={13} /> {order.data?.name}</div>
                                            <div className="flex items-center gap-2"><FaEnvelope className="text-blue-400 shrink-0" size={13} /> <span className="truncate">{order.email}</span></div>
                                            <div className="flex items-center gap-2"><FaPhone className="text-blue-400 shrink-0" size={13} /> {order.data?.phone}</div>
                                            <div className="flex items-start gap-2"><FaMapMarkerAlt className="text-blue-400 shrink-0 mt-0.5" size={13} /> <span>{order.data?.address}</span></div>

                                            {/* actions - matches the previous permission rules exactly:
                                                pending -> approve or cancel; approve -> mark delivered;
                                                delivered/canceled are terminal, no action */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproved(order)}
                                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 transition-colors duration-200"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleCanceled(order)}
                                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'approve' && (
                                                    <button
                                                        onClick={() => handleDelivery(order)}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300 transition-colors duration-200"
                                                    >
                                                        Mark delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* books  */}
                                        <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
                                            {order.cart.map((book, i) => (
                                                <Link
                                                    key={i}
                                                    to={`/book/${book.name.replace(/\s/g, "_")}/${book.bookId}`}
                                                    className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                                                >
                                                    <div className="w-10 h-14 shrink-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                                        <img className="w-full h-full object-cover" src={book.image} alt={book.name} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 capitalize">{book.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">by {book.author}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                                                        <IoMdPricetags className="text-gray-400" size={13} />৳{book.discountPrice}
                                                    </div>
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
        </div>
    );
};

export default AllOrders;
