import { useQuery } from "@tanstack/react-query";



const useBookData = () => {

  const { data: booksData = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['booksData'],
    queryFn: async () => {
      const res = await fetch("https://book-ocean-bd-server.vercel.app/books")
      return res.json()

    }
  })

  return [booksData, loading, refetch];
};

export default useBookData;

// const [booksData, setBooksData] = useState([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   fetch("https://book-ocean-bd-server.vercel.app/books")
//     .then((res) => res.json())
//     .then((data) => {
//       // console.log(data)
//       setBooksData(data);
//       setLoading(false);
//     });
// }, []);
