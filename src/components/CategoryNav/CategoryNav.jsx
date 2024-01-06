import { NavLink } from "react-router-dom";
import useBookData from "../../hooks/useBookData";

const CategoryNav = () => {
    const [booksData] = useBookData()
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];

    // console.log(uniqueCategories)
    return (
        <aside className="hidden lg:block ">
            <div className="flex flex-col w-[200px] h-[500px] rounded-[6px] overflow-hidden bg-slate-300 dark:bg-gray-800 dark:text-white ">
                <h1 className="py-4 font-semibold flex items-center justify-center uppercase bg-black text-white">Browse Categories</h1>
                <div className="flex flex-col gap-y-2 pt-3 px-4 font-semibold overflow-y-auto pb-12">
                    {
                        uniqueCategories.map((category, i) =>
                            <NavLink className="dark:hover:text-gray-400 px-2 rounded "
                                to={`/books/${category}`}
                                key={i}>
                                {category}
                            </NavLink>)
                    }

                </div>
            </div>
        </aside>
    );
};

export default CategoryNav;