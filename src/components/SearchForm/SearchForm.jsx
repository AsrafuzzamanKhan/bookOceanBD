import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const SearchForm = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimating(false)
        }, 1000);
        // clear time out 
        return () => clearTimeout(timeout)
    }, [])

    const handleSeachInput = e => {
        // console.log(e.target.value)
        setSearchTerm(e.target.value)
    }
    const handleSubmit = e => {
        e.preventDefault()
        // console.log(searchTerm)

        if (searchTerm.length > 0) {
            setSearchTerm('')
            navigate(`/search?query=${searchTerm}`)
            document.querySelector('input').value = '';


        } else {
            // if input is empty set animation to true
            setIsAnimating(true)

        }

    }
    return (
        <form
            onSubmit={handleSubmit}
            className={`${isAnimating ? 'animate-shake' : 'animate-none'} w-full relative`} >
            <input
                onChange={handleSeachInput}
                className="input dark:bg-white" type="text" placeholder="Type book name or author name ..." />
            <button className="btn bg-blue-400 absolute top-0 right-0 rounded-tl-none rounded-bl-none border-0">
                <FiSearch className="text-xl  dark:text-white"></FiSearch>
            </button>
        </form>
    );
};

export default SearchForm;