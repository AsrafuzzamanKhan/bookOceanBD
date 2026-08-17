import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import useBookData from "../../hooks/useBookData";

const SearchForm = () => {
    // const [booksData] = useBookData()
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimating(false)
        }, 1000);
        // clear time out 
        return () => clearTimeout(timeout)
    }, [])




    const handleSearchInput = e => {
        // console.log(e.target.value)
        setSearchTerm(e.target.value)
        // console.log('search:', searchTerm);
        // const filteredResults = booksData.filter((item) =>
        //     item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));
        // console.log(filteredResults);
    }

    const handleSubmit = e => {
        e.preventDefault()
        // console.log(searchTerm)

        if (searchTerm.length > 0) {
            setSearchTerm('');
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
            // scoped to this form's own input via ref - a bare
            // document.querySelector('input') here would grab whichever
            // <input> happens to be first in the whole document (e.g. the
            // header renders a desktop AND a mobile SearchForm at once),
            // clearing the wrong one instead of this one
            if (inputRef.current) inputRef.current.value = '';

        } else {
            // if input is empty set animation to true
            setIsAnimating(true)

        }

    }
    return (
        <form
            onSubmit={handleSubmit}
            className={`${isAnimating ? 'animate-shake' : 'animate-none'} w-full relative `} >
            <input
                ref={inputRef}
                onChange={handleSearchInput}
                type="text"
                placeholder="Search by book name or author..."
                className="w-full h-11 rounded-full bg-white/10 focus:bg-white text-white focus:text-gray-900 placeholder:text-white/50 focus:placeholder:text-gray-400 pl-5 pr-12 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
                <FiSearch size={16} />
            </button>
        </form>
    );
};

export default SearchForm;