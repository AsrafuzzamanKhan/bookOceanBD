// import { useEffect, useState } from "react";
// import FadeIn from "../../Animation/FadeIn";
// import { motion, useAnimate, useAnimation, useScroll } from "framer-motion"
// import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';


const BookCard = ({ book }) => {
    const { _id, name, author, price, image, available, newBook, category, cover } = book;


    return (

        <div>

            {/* <Link to={`/book/${name.replace(/\s/g, "-")}`}> */}
            <Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`}>
                <div className=" dark:border-0 dark:bg-gray-800  dark:text-white  border shadow-md w-full md:h-[400px] h-full  rounded-[8px] relative group overflow-hidden">
                    {/* badge  */}
                    {newBook === 'true' && <div className="absolute bg-blue-400 text-primary text-[12px] font-extrabold uppercase top-4 right-4 rounded-full px-2 z-10">
                        new
                    </div>}
                    {/* image  */}
                    <div className="w-full h-[230px] flex items-center justify-center relative">

                        <img
                            className="w-32  group-hover:scale-90 transition-all  px-[1vw] md:p-0"
                            src={image} alt={name} loading="lazy" />
                    </div>
                    {/* text  */}
                    <div className="flex  flex-col px-[2vw] lg:px-6 my-4  ">

                        <div className="grow">
                            {/* category  */}
                            <h4 className="text-sm text-blue-400">{category}</h4>
                            {/* title  */}
                            <h1 className="text-[14px] tooltip text-start" data-tip={name}>{name.substring(0, 35)}... </h1>
                            <h3 className="capitalize text-[14px] ">({cover})</h3>
                            <p className="text-[14px] ">by <span className="text-blue-400">{author}</span></p>
                        </div>
                        <div className="mt-2 ">
                            {
                                available === 'false' ? <p className="text-lg text-red-600 grow">Stock Out</p> : <p className="text-lg text-blue-400 ">
                                    <span className="">&#x09F3;</span> {price}
                                </p>

                            }
                        </div>

                        {/* <p className="text-lg text-blue-400">
                        <span>&#x09F3;</span> {price}
                    </p> */}
                    </div>
                </div>
            </Link>
        </div>



    );
};
BookCard.propTypes = {
    book: PropTypes.object
}
export default BookCard;