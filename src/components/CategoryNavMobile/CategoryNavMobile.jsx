import { FiX } from "react-icons/fi";
import useBookData from "../../hooks/useBookData";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";


const CategoryNavMobile = ({ setCatNavMobile }) => {
    const [booksData] = useBookData();
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];


    const sidebarRef = useRef(null);

    useEffect(() => {
        // Function to handle click outside of the sidebar
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setCatNavMobile(false);
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setCatNavMobile]);

    return (
        <nav className="w-full h-full bg-primary text-white flex flex-col" ref={sidebarRef} >
            {/* header  */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <h2 className="font-bold uppercase tracking-wide text-sm text-white/70">All Categories</h2>
                <button
                    onClick={() => setCatNavMobile(false)}
                    aria-label="Close categories"
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                >
                    <FiX className="text-xl" />
                </button>
            </div>
            <div className="flex flex-col px-2 py-3 overflow-y-auto scrollbar-webkit scrollbar-thin" >
                {
                    uniqueCategories?.map((category, i) => {
                        return <NavLink key={i} to={`/books/${category}`}
                            className={({ isActive }) => `capitalize font-medium duration-200 px-4 py-2.5 rounded-lg tracking-wide ${isActive ? 'bg-blue-500 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                            onClick={() => setCatNavMobile(false)}
                        >  {category} Books
                        </NavLink>

                    })
                }
            </div>

        </nav>
    );
};

export default CategoryNavMobile;