import { useQuery } from '@tanstack/react-query'

import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';


const useUserOrder = () => {
    const { user, loading } = useAuth()
    const [axiosSecure] = useAxiosSecure()
    const { data: order = [], refetch, isLoading } = useQuery({
        queryKey: ['order', user?.email],
        // also requires a real user, not just "auth finished loading" - a bare
        // `!loading` would let this fire with user still null right after
        // logout (or before login resolves), which used to throw on the
        // unguarded `user.email` access below
        enabled: !loading && !!user?.email,

        queryFn: async () => {
            const res = await axiosSecure(`/orders?email=${user.email}`)
            return res.data;
        },
    })
    return [order, refetch, isLoading]
};

export default useUserOrder;