import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import React from "react";
import { useState } from "react";


const BookCard = ({ book }) => {
    const { _id, name, author, price, image, available, newBook, category, cover } = book;

    // 1. State to track image loading
    const [isLoaded, setIsLoaded] = useState(false);
    // const discount = price * 0.05;
    const discount = price * 0.15;
    const discountPrice = parseInt(price - discount)
    // console.log(typeof (discountPrice));

    return (
        // <div>
        //     {/* <Link to={`/book/${name.replace(/\s/g, "-")}`}> */}
        //     <Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`} >
        //         <div className="dark:border-0 dark:bg-gray-800  dark:text-white  border w-full h-[350px] rounded-sm relative group overflow-hidden ">
        //             {/* badge  */}
        //             {newBook === 'true' && <div className="absolute bg-blue-400 text-primary text-[12px] font-bold uppercase top-4 right-4 rounded-full px-2 z-10">
        //                 new
        //             </div>}
        //             {/* image  */}
        //             <React.Suspense fallback={<span className="loading loading-bars loading-lg"></span>}><div className="w-full h-[200px] flex items-center justify-center relative ">
        //                 <img
        //                     className="w-28  group-hover:scale-90 transition-all  px-[1vw] md:p-0"
        //                     src={image} alt={name} loading="lazy" />

        //             </div>
        //             </React.Suspense>
                    

        //             {/* text  */}
        //             <div className="flex flex-col gap-y-2 md:gap-y-4 px-[2vw] lg:px-6 ">

        //                 <div className="">
        //                     {/* category  */}
        //                     <h4 className="text-sm text-blue-400 capitalize">{category}</h4>
        //                     {/* title  */}
                            
        //                     <h1 className="text-sm tooltip text-start line-clamp-1 hover:line-clamp-2" >
        //                         {name}
        //                     </h1>
        //                     <h3 className="capitalize text-sm ">({cover})</h3>
        //                     <p className="text-sm ">by <span className="text-blue-400">{author}</span></p>
        //                 </div>


        //                 <div className="flex justify-between items-center">
        //                     <div>
        //                         {
        //                             available === 'false' ? <p className="text-lg text-orange-400 grow">Stock Out</p> :
        //                                 <div className="text-md ">
        //                                     <p className="line-through text-orange-400"> <span >&#x09F3;</span> {price}</p>
        //                                 </div>
        //                         }
        //                     </div>
        //                     <div className="text-md font-semibold">
        //                         {
        //                             available === 'true' && <p><span className="">&#x09F3;</span> {discountPrice}</p>
        //                         }
        //                     </div>
        //                 </div>


        //             </div>
        //         </div>
        //     </Link >
        // </div >
        <div className="h-full">
            <Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`} >
                <div className="dark:border-0 dark:bg-gray-800 dark:text-white border w-full h-[380px] rounded-sm relative group overflow-hidden flex flex-col">

                    {/* Badge */}
                    {newBook === 'true' && (
                        <div className="absolute bg-blue-500 text-white text-[10px] font-bold uppercase top-3 right-3 rounded-full px-2 py-0.5 z-10 shadow-sm">
                            new
                        </div>
                    )}

                    {/* Image Section */}
                    <div className="w-full h-[200px] flex items-center justify-center relative bg-gray-50 dark:bg-gray-900/50">

                        {/* 3. Real Loading UI (replaces Suspense) */}
                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
                                <span className="loading loading-spinner loading-md text-blue-400"></span>
                            </div>
                        )}

                        <img
                            className={`w-28 object-contain transition-all duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            src={image}
                            alt={name}
                            loading="lazy"
                            onLoad={() => setIsLoaded(true)}
                        />
                    </div>

                    {/* Text Details Section */}
                    <div className="flex flex-col flex-grow gap-y-2 p-4">
                        <div className="flex-grow">
                            <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{category}</h4>
                            <h1 className="text-sm font-semibold line-clamp-2 mt-1 leading-snug group-hover:text-blue-500 transition-colors" title={name}>
                                {name}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                {cover} • by <span className="text-blue-400 not-italic">{author}</span>
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="mt-auto border-t pt-3 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                {available === 'false' ? (
                                    <p className="text-sm font-bold text-orange-400 uppercase">Out of Stock</p>
                                ) : (
                                    <>
                                        <div className="flex flex-col">
                                                <span className="text-[11px] line-through text-orange-400">৳{price}</span>
                                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{discountPrice}</span>
                                        </div>
                                       
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link >
        </div >


    );
};
// BookCard.propTypes = {
//     book: PropTypes.object
// }
BookCard.propTypes = {
    book: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.number,
        image: PropTypes.string,
        available: PropTypes.string,
        newBook: PropTypes.string,
        category: PropTypes.string,
        cover: PropTypes.string
    })
};
export default BookCard;