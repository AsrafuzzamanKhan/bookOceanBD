import { useQuery } from "@tanstack/react-query";


const useBookData = () => {
  const { data: booksData = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['booksData'],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/books")
      return res.json()
    }
  })

  return [booksData, loading, refetch];
};

export default useBookData;

// const [booksData, setBooksData] = useState([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   fetch("http://localhost:5000/books")
//     .then((res) => res.json())
//     .then((data) => {
//       // console.log(data)
//       setBooksData(data);
//       setLoading(false);
//     });
// }, []);
