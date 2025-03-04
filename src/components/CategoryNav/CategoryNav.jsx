import { NavLink } from "react-router-dom";
import useBookData from "../../hooks/useBookData";

const CategoryNav = () => {
    const [booksData] = useBookData()

    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    // console.log(uniqueCategories)
    return (
        <aside className="hidden lg:block ">
            <nav className="flex flex-col w-[200px] h-[450px] rounded-[4px] overflow-hidden bg-slate-300 dark:bg-gray-800 dark:text-white ">
                <h1 className="py-4 font-semibold flex items-center justify-center capitalize bg-black text-white tracking-wide">All Categories</h1>
                <div className="flex flex-col gap-y-2 pt-3 px-4 font-medium overflow-y-scroll scrollbar-webkit scrollbar-thin pb-12">
                    {
                        uniqueCategories.map((category, i) =>

                            <NavLink className="dark:hover:text-gray-400 hover:text-blue-500 rounded capitalize px-2 tracking-wide"
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

export default CategoryNav;