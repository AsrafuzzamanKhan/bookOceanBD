import { useQuery } from '@tanstack/react-query'

import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';


const useAllOrders = () => {
    const { user, loading } = useAuth()
    console.log(user.email)
    const [axiosSecure] = useAxiosSecure()
    const { data: allOrder = [], refetch, isLoading } = useQuery({
        queryKey: ['allOrder'],
        enabled: !loading,

        queryFn: async () => {
            const res = await axiosSecure(`/allOrders`)
            console.log('All order historey axios ', res)
            return res.data;
            // return res.json();
        },
    })
    return [allOrder, refetch, isLoading]
};

export default useAllOrders;