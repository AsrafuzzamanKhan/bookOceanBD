import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { HiOutlineShoppingBag, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTruck, HiOutlineExclamationCircle } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import useNotifications from "../../../hooks/useNotifications";
import { playNewOrderSound } from "../../../utils/notificationSound";

// Per-customer types (see index.js's createNotification calls in the order
// routes) and per-admin types (notifyAdmins calls: new order + low/out of
// stock, from order placement, manual book edits, and the Google Sheet sync).
const TYPE_META = {
    order_placed: { icon: HiOutlineShoppingBag, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30" },
    order_approved: { icon: HiOutlineCheckCircle, color: "text-green-500 bg-green-50 dark:bg-green-900/30" },
    order_canceled: { icon: HiOutlineXCircle, color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
    order_delivered: { icon: HiOutlineTruck, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/30" },
    admin_new_order: { icon: HiOutlineShoppingBag, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30" },
    book_low_stock: { icon: HiOutlineExclamationCircle, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/30" },
    book_out_of_stock: { icon: HiOutlineExclamationCircle, color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
};

// Per-user notification bell for the navbar. Sits next to the cart icon in
// Header.jsx, only rendered when a user is logged in. Data comes from
// useNotifications (react-query, polls every 30s) - see index.js's
// /notifications routes for where these get created and read.
const NotificationBell = () => {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

    // Sound alert - "new order" only, not every notification type (that
    // would get noisy on a 30s poll). null until the first successful fetch
    // establishes a baseline, so it never fires for orders that already
    // existed when the page loaded - only for ones that show up afterwards.
    const seenIdsRef = useRef(null);
    useEffect(() => {
        if (isLoading) return;
        const currentIds = new Set(notifications.map((n) => n._id));

        if (seenIdsRef.current) {
            const hasNewOrder = notifications.some(
                (n) => n.type === "admin_new_order" && !n.read && !seenIdsRef.current.has(n._id)
            );
            if (hasNewOrder) playNewOrderSound();
        }

        seenIdsRef.current = currentIds;
    }, [notifications, isLoading]);

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label
                tabIndex={0}
                className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
            >
                <FiBell className="text-lg md:text-xl" />
                {unreadCount > 0 && (
                    <div className="flex justify-center items-center bg-red-500 text-white absolute w-[18px] h-[18px] rounded-full top-0.5 right-0.5 text-[11px] font-semibold ring-2 ring-black">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                )}
            </label>

            <div tabIndex={0} className="dropdown-content z-[1] mt-3 w-80 max-w-[90vw] rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-webkit">
                    {isLoading && (
                        <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                    )}
                    {!isLoading && notifications.length === 0 && (
                        <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No notifications yet
                        </p>
                    )}
                    {notifications.map((n) => {
                        const meta = TYPE_META[n.type] || TYPE_META.order_placed;
                        const Icon = meta.icon;
                        return (
                            <Link
                                key={n._id}
                                to={n.link || "/dashboard/orderHistory"}
                                onClick={() => !n.read && markAsRead(n._id)}
                                className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 duration-150 ${!n.read ? "bg-blue-50/60 dark:bg-blue-900/10" : ""}`}
                            >
                                <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full ${meta.color}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
