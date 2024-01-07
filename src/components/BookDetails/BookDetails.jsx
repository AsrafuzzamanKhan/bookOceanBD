import { Link, useNavigate, useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import FadeIn from "../../Animation/FadeIn";
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { MdEdit } from "react-icons/md";
import facebook from '../../assets/social/facebook.png'
import instagram from '../../assets/social/instagram.png'
import { TbTruckDelivery } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { MdOutlineGppGood } from "react-icons/md";

import useAdmin from "../../hooks/useAdmin";

const BookDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const [isAdmin] = useAdmin()
    const [booksData] = useBookData()
    const navigate = useNavigate()
    const [, refetch] = useCart()
    const { setIsOpen, isOpen } = useContext(CartContext)

    const { ref, inView } = useInView({
        threshold: 0.1
    });
    const animation = useAnimation()

    useEffect(() => {
        console.log('isview', inView)
        if (inView) {
            animation.start({
                y: 0,
                transition: {
                    type: 'spring', duration: 3, bounce: 0.3
                }
            })
        }
        if (!inView) {
            animation.start({ y: '-100vw' })
        }

    }, [animation, inView])


    const productDetails = booksData?.find(pd => pd._id == id)

    // console.log('product details', productDetails)

    if (!productDetails) {
        return (<div className="container mx-auto text-center">loading...</div>)
    }

    const handleAddToCart = (item) => {

        const { category, name, image, price, _id, author } = item;

        const cartItem = { bookId: _id, category, name, author, image, price, email: user?.email, quantity: 1 }
        console.log('cartItem', cartItem)
        console.log(id)
        // phh -------
        if (user) {
            fetch('https://book-ocean-bd-server.vercel.app/carts', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.insertedId) {
                        refetch()
                        setIsOpen(!isOpen)
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Add to the cart",
                            showConfirmButton: false,
                            timer: 1500
                        });

                    }
                })
        } else {
            Swal.fire({
                title: "Please Login",
                text: "You won't be able to Add to cart!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Login now"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')

                }
            });


        }
    }
    return (
        <div className="mb-16 pt-32 lg:pt-[30px] xl:pt-24">
            <div className="container mx-auto px-1 lg:px-0">
                <Helmet>
                    <title>Book Ocean BD || Book Details</title>
                </Helmet>
                {/* text  */}
                <div ref={ref} className="flex flex-col lg:flex-row lg:gap-[20px] gap-0 mb-[30px] items-center w-full  ">
                    <motion.div
                        animate={animation}

                        className="flex-1 w-full h-full rounded-[4px] flex justify-center items-center " >


                        <img src={productDetails?.image}
                            className=" lg:max-w-[65%] max-h-96  h-full lg:p-0 p-4 "
                            alt={productDetails?.image} />
                        {/* </div> */}
                    </motion.div>
                    <motion.div
                        animate={animation}
                        className="  w-full flex-1 lg:py-10 py-4 px-8  flex flex-col justify-center dark:bg-base-200 dark:text-white text-black  rounded-[4px]  dark:border-none shadow-md ">
                        {/* category  */}
                        <Link to={`/books/${productDetails?.category}`}>
                            <h4 className="uppercase text-blue-400 text-lg font-medium mb-2 hover:text-green-600 duration-300">
                                {productDetails?.category}
                            </h4>
                        </Link>
                        {/* title  */}
                        <h1 className="text-xl lg:text-2xl mb-2">
                            {productDetails?.name}
                        </h1>
                        <div className="mb-6">
                            by <Link
                                to={`/authorbooks/${productDetails?.author}`}
                                author={productDetails?.author}>
                                <span
                                    className="text-blue-400 hover:text-blue-900 hover:underline duration-300 ">
                                    {productDetails?.author}
                                </span>
                            </Link>
                        </div>


                        {/* price and btn   */}
                        <div className="flex items-center gap-x-8 mb-10">
                            {/* price  */}


                            <div className=" flex justify-center items-center gap-4 ">

                                <div className="border rounded-[8px] shadow-md flex flex-col text-center h-auto p-2">
                                    <div >
                                        {
                                            productDetails?.cover === 'hardcover' && <span className="text-[15px] "> Hardcover </span>
                                        }
                                        {
                                            productDetails?.cover == 'paperback' && <span className="text-[15px] "> Paperback </span>
                                        }
                                        {
                                            productDetails?.cover == 'leather bound' && <span className="text-[15px] "> Leather Bound </span>
                                        }
                                    </div>

                                    {
                                        productDetails?.available === 'false' ? <div className=" text-red-600">---</div> : <div className="text-xl font-semibold text-blue-400"><span>&#x09F3;</span> {productDetails?.price}</div>

                                    }

                                </div>


                                {/* add to cart button  */}

                                {
                                    productDetails?.available === 'false' ? <div className="text-xl text-red-600">Stock Out</div> : <div className="">
                                        <button
                                            onClick={() => handleAddToCart(productDetails)}
                                            className="btn bg-blue-400 text-black hover:text-white hover:bg-black transition-all text-[12px] lg:text-[16px]  ">Add to cart
                                        </button>

                                    </div>

                                }

                                {
                                    isAdmin ? <div>
                                        <Link to={`/dashboard/updateBook/${productDetails._id}`}>

                                            <div className="flex justify-center items-center gap-1 btn"><MdEdit></MdEdit><span>Edit</span></div>
                                        </Link>

                                    </div> : ''
                                }

                            </div>


                        </div>
                        {/* original  */}
                        <div className="flex flex-col gap-y-2 mb-4">
                            <div className="flex gap-2 items-center">
                                <TbTruckDelivery size={25} />
                                <p>Fast Shipping</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <MdOutlineGppGood size={25} />
                                <p> Get Premium Quality Original Books</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <MdPayment size={25} />
                                <p>Cash On Delivery Service is Available</p></div>
                        </div>
                        <hr />
                        {/* social  */}
                        <div>
                            <h2 className='font-semibold my-4'>
                                Follow Our Social Medias:
                            </h2>
                            <div className=' flex max-w-max gap-x-4 text-lg mb-5'>

                                <a href="https://www.facebook.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all">
                                    <img className='w-8' src={facebook} alt="" />
                                </a>

                                <a href="https://www.instagram.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all">
                                    <img className='w-8' src={instagram} alt="" />
                                </a>
                            </div>
                        </div>
                        {/* description  */}
                        {/* <div tabIndex={0} className="collapse collapse-arrow border border-base-300  ">
                            <div className="collapse-title text-xl font-medium">
                                Description
                            </div>
                            <div className="collapse-content">
                                <p>{productDetails.description}</p>
                            </div>
                        </div> */}
                        {/* 
                        <p className="mb-5">{productDetails.description}</p> */}

                    </motion.div>


                </div>
                {/* Description  */}
                <FadeIn delay={0.4} direction='up' >
                    <div className="px-4 lg:px-0 dark:text-gray-300">
                        <h3 className="text-xl my-2 font-semibold">Description</h3>
                        <hr className="mb-4" />

                        <p className="mb-5">{productDetails?.description}</p>
                    </div>
                </FadeIn>
                {/* relatged  product  */}
                <FadeIn delay={0.4} direction='up' >
                    <RelatedBooks
                        categoryTitle={productDetails?.category}
                    ></RelatedBooks>
                </FadeIn>
            </div>
        </div>
    );
};

export default BookDetails;