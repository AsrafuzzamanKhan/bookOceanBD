import { useEffect, useState } from "react";

const useBookData = () => {
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setBooksData(data);
        setLoading(false);
      });
  }, []);
  return [booksData, loading];
};

export default useBookData;
