import { Link } from "react-router-dom";


const BookCard = ({ book }) => {
    const { _id, name, author, price, image, description, isNew, category, isPaperback, isHardcover } = book;
    // console.log('book', book)
    return (
        <Link to={`/book/${_id}`}>
            <div className=" border shadow-md w-full h-[400px] rounded-[8px] overflow-hidden relative group">
                {/* badge  */}
                {isNew === true && <div className="absolute bg-blue-400 text-primary text-[12px] font-extrabold uppercase top-4 right-4 rounded-full px-2 z-10">
                    new
                </div>}
                {/* image  */}
                <div className="w-full h-[250px] flex items-center justify-center relative">

                    <img
                        className=" w-32 group-hover:scale-90 transition-all"
                        src={image} alt="books" />
                </div>
                {/* text  */}
                <div className="flex flex-col px-6 ">
                    {/* category  */}
                    <div className="text-sm text-blue-400">{category}</div>
                    {/* title  */}
                    <div className="text-[15px] ">{name}</div>
                    <div className="text-[15px] ">{author}</div>


                    <div className="text-lg text-blue-400">
                        <span>&#x09F3;</span> {price}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;