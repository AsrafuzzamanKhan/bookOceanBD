// import { useEffect, useState } from "react";
// import FadeIn from "../../Animation/FadeIn";
// import { motion, useAnimate, useAnimation, useScroll } from "framer-motion"
// import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const BookCard = ({ book }) => {
    const { _id, name, author, price, image, available, newBook, category, cover } = book;

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

        <Link to={`/book/${name}/${_id}`}>
            <div className=" dark:border-0 dark:bg-gray-800  dark:text-white  border shadow-xl w-full h-[400px]  rounded-[8px] overflow-hidden relative group">
                {/* badge  */}
                {newBook === 'true' && <div className="absolute bg-blue-400 text-primary text-[12px] font-extrabold uppercase top-4 right-4 rounded-full px-2 z-10">
                    new
                </div>}
                {/* image  */}
                <div className="w-full h-[230px] flex items-center justify-center relative">

                    <img
                        className=" w-32 group-hover:scale-90 transition-all"
                        src={image} alt={image} loading="lazy" />
                </div>
                {/* text  */}
                <div className="flex flex-col px-2 lg:px-6 text-[14px]">

                    {/* category  */}
                    <h4 className="text-sm text-blue-400">{category}</h4>
                    {/* title  */}
                    <h1 className="text-[15px] tooltip text-start" data-tip={name}>{name.substring(0, 35)}... </h1>
                    <span className="capitalize">({cover})</span>
                    <p className="text-[15px] ">by <span className="text-blue-400">{author}</span></p>
                    {
                        available === 'false' ? <p className="text-lg text-red-600">Stock Out</p> : <p className="text-lg text-blue-400">
                            <span>&#x09F3;</span> {price}
                        </p>

                    }

                    {/* <p className="text-lg text-blue-400">
                        <span>&#x09F3;</span> {price}
                    </p> */}
                </div>
            </div>
        </Link>

    );
};
BookCard.propTypes = {
    book: PropTypes.object
}
export default BookCard;