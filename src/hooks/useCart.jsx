import { useQuery } from '@tanstack/react-query'

import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';


const useCart = () => {
    const { user, loading } = useAuth()

    const [axiosSecure] = useAxiosSecure()
    const { data: cart = [], refetch, isLoading } = useQuery({
        queryKey: ['cart', user?.email],
        // also requires a real user, not just "auth finished loading" - a bare
        // `!loading` would let this fire with user still null (logged-out, or
        // right before login resolves), which throws on the unguarded
        // `user.email` access below
        enabled: !loading && !!user?.email,

        queryFn: async () => {
            const res = await axiosSecure(`/carts?email=${user.email}`)
            return res.data;
        },
    })
    return [cart, refetch, isLoading]
};

export default useCart;