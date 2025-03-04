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
        <nav className="w-full h-full bg-primary p-8 " ref={sidebarRef} >
            {/* close icon  */}
            <div onClick={() => setCatNavMobile(false)}
                className=" flex justify-end mb-6 cursor-pointer">
                <FiX className="text-3xl" />
            </div>
            <div className="flex flex-col gap-y-4 pb-12 overflow-x-hidden h-[80vh] " >
                {
                    uniqueCategories?.map((category, i) => {
                        return <NavLink key={i} to={`/books/${category}`} className='capitalize font-medium hover:text-green-600 duration-300 px-2 rounded tracking-wide'
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