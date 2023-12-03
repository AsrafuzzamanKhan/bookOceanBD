import { FiX } from "react-icons/fi";
import useBookData from "../../hooks/useBookData";
import { Link } from "react-router-dom";


const CategoryNavMobile = ({ setCatNavMobile }) => {
    const [booksData] = useBookData();
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];

    return (
        <div className="w-full h-full bg-primary p-8" >
            {/* close icon  */}
            <div onClick={() => setCatNavMobile(false)}
                className=" flex justify-end mb-8 cursor-pointer">
                <FiX className="text-3xl" />
            </div>
            <div className="flex flex-col gap-y-4  pb-12" >
                {
                    uniqueCategories?.map((category, i) => {
                        return <Link key={i} to={`/books/${category}`} className='uppercase font-medium hover:text-green-600 duration-300 '
                            onClick={() => setCatNavMobile(false)}
                        >  {category} Book
                        </Link>

                    })
                }
            </div>

        </div>
    );
};

export default CategoryNavMobile;