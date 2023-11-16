import { Link } from "react-router-dom";
import useBookData from "../../hooks/useBookData";

const CategoryNav = () => {
    const [booksData] = useBookData()
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    console.log(uniqueCategories)
    return (
        <aside className="hidden lg:block">
            <div className="flex flex-col w-[200px] h-[500px] rounded-[8px] overflow-hidden bg-slate-300">
                <div className="py-4 font-semibold flex items-center justify-center uppercase bg-black text-white">Browse Categories</div>
                <div className="flex flex-col gap-y-2 p-6 font-semibold">
                    {
                        uniqueCategories.map(category =>
                            <Link
                                to={`/books/${category}`}
                                key={category._id}>
                                {category}
                            </Link>)
                    }
                </div>
            </div>
        </aside>
    );
};

export default CategoryNav;