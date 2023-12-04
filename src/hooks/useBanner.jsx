import { useQuery } from "@tanstack/react-query";


const useBanner = () => {
    const { data: bannerData = [], isLoading: loading, refetch } = useQuery({
        queryKey: ['bannerData'],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/banners")
            return res.json()
        }
    })

    return [bannerData, loading, refetch];
};

export default useBanner;