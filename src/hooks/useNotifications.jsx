import { useQuery } from '@tanstack/react-query'

import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

// Powers the navbar notification bell (see Shared/NotificationBell). Polls
// every 30s so the unread badge stays roughly live without needing sockets -
// notifications are created server-side on order placed/approved/canceled/
// delivered (see index.js POST /orders and PATCH /orders/*-order/:id).
const useNotifications = () => {
    const { user, loading } = useAuth()
    const [axiosSecure] = useAxiosSecure()

    const { data: notifications = [], refetch, isLoading } = useQuery({
        queryKey: ['notifications', user?.email],
        enabled: !loading && !!user?.email,
        refetchInterval: 30000,
        queryFn: async () => {
            const res = await axiosSecure(`/notifications?email=${user.email}`)
            return res.data;
        },
    })

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = async (id) => {
        // optimistic-ish: the 30s poll will reconcile either way, but refetch
        // right away so the badge/dot update as soon as the user taps a row
        try {
            await axiosSecure.patch(`/notifications/${id}/read`)
        } finally {
            refetch()
        }
    }

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await axiosSecure.patch('/notifications/mark-all-read')
        } finally {
            refetch()
        }
    }

    return { notifications, unreadCount, isLoading, refetch, markAsRead, markAllAsRead }
};

export default useNotifications;
