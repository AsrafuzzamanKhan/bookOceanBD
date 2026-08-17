import { FiCheckCircle, FiClock, FiTruck, FiXCircle } from "react-icons/fi";
import { parse } from "date-fns";

// Shared label/color/icon for every order status shown across the dashboard
// (admin's AllOrders, the customer's OrderHistory) - one place to keep them
// matching instead of each page defining its own palette.
export const STATUS_META = {
    pending: { label: 'Pending', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: FiClock },
    approve: { label: 'Approved', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: FiCheckCircle },
    delivered: { label: 'Delivered', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: FiTruck },
    canceled: { label: 'Canceled', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: FiXCircle },
};

// order.date is stored as 'yyyy-MM-dd HH:mm:ss' (see Checkout.jsx) - parsed
// explicitly with that exact format rather than `new Date(str)`, which some
// browsers parse inconsistently for a non-ISO string like this.
export const orderDateValue = (order) => parse(order.date, 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
