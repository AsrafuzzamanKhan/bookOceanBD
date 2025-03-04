// import { useEffect, useState } from "react";
// import FadeIn from "../../Animation/FadeIn";
// import { motion, useAnimate, useAnimation, useScroll } from "framer-motion"
// import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import React from "react";


const BookCard = ({ book }) => {
    const { _id, name, author, price, image, available, newBook, category, cover } = book;
    const discount = price * 0.05;
    const discountPrice = parseInt(price - discount)
    // console.log(typeof (discountPrice));

    return (
        <div>
            {/* <Link to={`/book/${name.replace(/\s/g, "-")}`}> */}
            <Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`} target="_blank">
                <div className="dark:border-0 dark:bg-gray-800  dark:text-white  border w-full h-[350px] rounded-sm relative group overflow-hidden ">
                    {/* badge  */}
                    {newBook === 'true' && <div className="absolute bg-blue-400 text-primary text-[12px] font-bold uppercase top-4 right-4 rounded-full px-2 z-10">
                        new
                    </div>}
                    {/* image  */}
                    <React.Suspense fallback={<span className="loading loading-bars loading-lg"></span>}><div className="w-full h-[200px] flex items-center justify-center relative ">
                        <img
                            className="w-28  group-hover:scale-90 transition-all  px-[1vw] md:p-0"
                            src={image} alt={name} loading="lazy" />

                    </div>
                    </React.Suspense>
                    {/* <div className="w-full h-[200px] flex items-center justify-center relative ">
                        <img
                            className="w-28  group-hover:scale-90 transition-all  px-[1vw] md:p-0"
                            src={image} alt={name} loading="lazy" />
                    </div> */}

                    {/* text  */}
                    <div className="flex flex-col gap-y-2 md:gap-y-4 px-[2vw] lg:px-6 ">

                        <div className="">
                            {/* category  */}
                            <h4 className="text-sm text-blue-400 capitalize">{category}</h4>
                            {/* title  */}
                            {/* <h1 className="text-sm tooltip text-start" data-tip={name}>{name.substring(0, 35)}... </h1> */}
                            <h1 className="text-sm tooltip text-start line-clamp-1 hover:line-clamp-2" >
                                {name}
                            </h1>
                            <h3 className="capitalize text-sm ">({cover})</h3>
                            <p className="text-sm ">by <span className="text-blue-400">{author}</span></p>
                        </div>


                        <div className="flex justify-between items-center">
                            <div>
                                {
                                    available === 'false' ? <p className="text-lg text-orange-400 grow">Stock Out</p> :
                                        <div className="text-md ">
                                            <p className="line-through text-orange-400"> <span >&#x09F3;</span> {price}</p>
                                        </div>
                                }
                            </div>
                            <div className="text-md font-semibold">
                                {
                                    available === 'true' && <p><span className="">&#x09F3;</span> {discountPrice}</p>
                                }
                            </div>
                        </div>


                    </div>
                </div>
            </Link >
        </div >



    );
};
BookCard.propTypes = {
    book: PropTypes.object
}
export default BookCard;