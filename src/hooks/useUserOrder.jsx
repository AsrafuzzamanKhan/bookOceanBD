import { useQuery } from '@tanstack/react-query'

import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';


const useUserOrder = () => {
    const { user, loading } = useAuth()

    const [axiosSecure] = useAxiosSecure()
    const { data: order = [], refetch, isLoading } = useQuery({
        queryKey: ['order', user?.email],
        enabled: !loading,

        queryFn: async () => {
            const res = await axiosSecure(`/orders?email=${user.email}`)
            console.log('order historey axios ', res)
            return res.data;
            // return res.json();
        },
    })
    return [order, refetch, isLoading]
};

export default useUserOrder;