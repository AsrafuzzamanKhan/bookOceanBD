import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animation/FadeIn";
import { motion, useAnimate, useAnimation, useScroll } from "framer-motion"
import { useInView } from "react-intersection-observer";

const BookCard = ({ book }) => {
    const { _id, name, author, price, image, description, newBook, category, cover } = book;

    // console.log('book', book)


    // const { ref, inView } = useInView({
    //     threshold: 0.1
    // });
    // const animation = useAnimation()

    // useEffect(() => {
    //     console.log('isview', inView)
    //     if (inView) {
    //         animation.start({
    //             y: 0,
    //             transition: {
    //                 type: 'tween', duration: 4
    //             }
    //         })
    //     }
    //     if (!inView) {
    //         animation.start({ y: '-100vw' })
    //     }

    // }, [animation, inView])


    return (

        <Link to={`/book/${_id}`}>
            <div className=" dark:border-0 dark:bg-gray-800  dark:text-white  border shadow-xl w-full h-[400px] rounded-[8px] overflow-hidden relative group">
                {/* badge  */}
                {newBook === 'true' && <div className="absolute bg-blue-400 text-primary text-[12px] font-extrabold uppercase top-4 right-4 rounded-full px-2 z-10">
                    new
                </div>}
                {/* image  */}
                <div className="w-full h-[250px] flex items-center justify-center relative">

                    <img
                        className=" w-32 group-hover:scale-90 transition-all"
                        src={image} alt="books" />
                </div>
                {/* text  */}
                <div className="flex flex-col px-2 lg:px-6 ">

                    {/* category  */}
                    <div className="text-sm text-blue-400">{category}</div>
                    {/* title  */}
                    <div className="text-[15px] tooltip text-start" data-tip={name}>{name.substring(0, 35)}... </div>
                    <span className="capitalize">({cover})</span>
                    <div className="text-[15px] ">by <span className="text-blue-400">{author}</span></div>

                    <div className="text-lg text-blue-400">
                        <span>&#x09F3;</span> {price}
                    </div>
                </div>
            </div>
        </Link>

    );
};

export default BookCard;