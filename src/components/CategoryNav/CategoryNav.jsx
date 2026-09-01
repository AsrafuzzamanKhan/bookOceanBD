import { NavLink } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import useBookData from "../../hooks/useBookData";
import PropTypes from "prop-types";

// sticky: keeps the sidebar in view while the book grid next to it scrolls -
// wanted on the category/listing pages (Books, Book, SearchBook) but not on
// the Home page, where it sits inside the short hero section and doesn't
// need to follow the scroll.
const CategoryNav = ({ sticky = false }) => {
    const [booksData] = useBookData()

    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    // console.log(uniqueCategories)
    return (
        <aside className={`hidden lg:block w-[220px] shrink-0 ${sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}`}>
            <nav className="flex flex-col h-[450px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h1 className="py-4 px-5 font-bold flex items-center gap-2 bg-black text-white tracking-wide text-xs uppercase">
                    <FiGrid size={15} /> All Categories
                </h1>
                <div className="flex flex-col gap-y-0.5 py-2 px-2 overflow-y-auto scrollbar-webkit scrollbar-thin">
                    {
                        uniqueCategories.map((category, i) =>

                            <NavLink
                                className={({ isActive }) => `capitalize text-sm px-3 py-2 rounded-lg tracking-wide duration-200 ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'}`}
                                to={`/books/${category}`}
                                key={i}>
                                {category} Books
                            </NavLink>)
                    }

                </div>
            </nav>
        </aside>
    );
};

CategoryNav.propTypes = {
    sticky: PropTypes.bool,
};

export default CategoryNav;
