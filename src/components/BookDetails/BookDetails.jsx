import './BookDetails.css'
import { Link, useNavigate, useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import Swal from "sweetalert2";
import { showSuccessToast } from "../../utils/toast";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer";
import { MdEdit } from "react-icons/md";
import facebook from '../../assets/social/facebook.png'
import instagram from '../../assets/social/instagram.png'
import { TbTruckDelivery } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { MdOutlineGppGood } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { FaAmazon } from "react-icons/fa";

import useAdmin from "../../hooks/useAdmin";
import BookDescription from "../BookDescription/BookDescription";
// import usePageSEO from "../../hooks/usePageSEO";
import { Helmet } from "react-helmet";

const BookDetails = () => {

    const { id } = useParams()
    const { user } = useAuth()
    const [isAdmin] = useAdmin()
    const [booksData] = useBookData()
    const navigate = useNavigate()
    const [, refetch] = useCart()
    const { setIsOpen, isOpen } = useContext(CartContext)

    const [fullImg, setFullImg] = useState(false);

    const sidebarRef = useRef(null);
    useEffect(() => {
        // Function to handle click outside of the sidebar
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setFullImg(false)
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setFullImg]);

    // animation 
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
                    type: 'spring', duration: 4, bounce: 0.3
                }
            })
        }
        if (!inView) {
            animation.start({ y: '-100vw' })
        }

    }, [animation, inView])


    const productDetails = booksData?.find(pd => pd._id === id)
    const discount = productDetails?.price * 0.05;
    // const discount = productDetails?.price * 0.15;
    const discountPrice = parseInt(productDetails?.price - discount)
    // usePageSEO(
    //     {
    //         title: `Buy ${productDetails?.name}`,
    //         description: ` ${productDetails?.description}`,
    //         keywords: ["Original Print Book", "Best Book shop in Bangladesh"],
    //         ogTitle: `${productDetails?.name}`,
    //         ogDescription: `${productDetails?.description}`,
    //         ogImage: `${productDetails?.image}`,
    //         ogUrl: "https://bookoceanbd.com/"
    //     }
    // )


    // console.log('product details', typeof (productDetails._id))
    // console.log('Id', typeof productDetails._id)
    // console.log(productDetails)

    if (!productDetails) {
        return <div className="container mx-auto flex text-center justify-center">Loading...
        </div>
    }

    const handleAddToCart = (item) => {

        const { category, name, image, _id, author } = item;
        // const { category, name, image, price, _id, author } = item;

        const cartItem = { bookId: _id, category, name, author, image, discountPrice, email: user?.email, quantity: 1 }
        console.log('cartItem', cartItem)
        // console.log(id)

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
                    if (data.insertedId || data.modifiedCount > 0 || data.matchedCount > 0) {
                        refetch()
                        setIsOpen(!isOpen)
                        // quantity is capped at current stock (see POST /carts) - let
                        // the customer know if adding another copy didn't actually
                        // do anything because they're already at the stock limit
                        if (data.existed && data.quantity >= data.maxQty) {
                            showSuccessToast(`Already ${data.quantity} in your cart`, "That's all we have in stock right now.")
                        } else if (data.existed) {
                            showSuccessToast('Added another copy', `${data.quantity} in your cart now.`)
                        } else {
                            showSuccessToast("Add to the cart")
                        }
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

    // const handleImgClose = () => {
    //     setFullImg(false)
    //     console.log(fullImg);
    // }
    // const handleFullImg = () => {
    //     setFullImg(true)
    //     console.log(fullImg);
    // }

    return (
        <section className="mb-4 pt-[7rem] md:pt-32 lg:pt-[5rem] " >
            <div className="container mx-auto min-h-screen " >
                <Helmet>
                    <title>Buy {productDetails?.name} by {productDetails?.author} | Book Ocean BD</title>
                    <meta name="description" content={productDetails?.description} />
                    <meta name="keywords" content="Original Print Book, Best Book shop in Bangladesh" />

                    {/* Open Graph - must use `property`, not `name`, or Facebook/
                        WhatsApp/Messenger crawlers ignore these entirely. Note:
                        this is a client-rendered SPA, so crawlers that don't run
                        JS (most of them) never see these - only index.html's
                        static defaults. See index.html for the full explanation. */}
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Book Ocean BD" />
                    <meta property="og:title" content={`${productDetails?.name} by ${productDetails?.author}`} />
                    <meta property="og:description" content={productDetails?.description} />
                    <meta property="og:image" content={productDetails?.image || 'https://i.ibb.co/yhDbPYf/logo2.jpg'} />
                    <meta property="og:url" content={`https://bookoceanbd.com/book/${productDetails?.name?.replace(/\s/g, "_")}/${productDetails?._id}`} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${productDetails?.name} by ${productDetails?.author}`} />
                    <meta name="twitter:description" content={productDetails?.description} />
                    <meta name="twitter:image" content={productDetails?.image || 'https://i.ibb.co/yhDbPYf/logo2.jpg'} />
                </Helmet>
                {/* TABS  */}
                {/* /book/:name/:id */}
                <div className="flex flex-wrap items-center justify-start gap-x-2 px-[2vw] py-0 md:py-2 md:px-0 mb-2">
                    <Link to='/' className=" hover:text-blue-900  duration-300 flex"><IoMdHome size={20} />

                    </Link>
                    <span> /</span>
                    <Link to={`/books/${productDetails?.category}`}>
                        <span className="text-blue-400 hover:text-blue-900 hover:underline duration-300 capitalize">
                            {productDetails?.category}

                        </span>
                    </Link>
                    <span> /</span>
                    <Link
                        to={`/authorbooks/${productDetails?.author}`}
                        author={productDetails?.author}>
                        <span
                            className="text-blue-400 hover:text-blue-900 hover:underline duration-300 ">
                            {productDetails?.author}
                        </span>
                    </Link>
                    <span> /</span>
                    <span className="">
                        {productDetails?.name}
                    </span>
                </div>



                {/* text  */}
                <div ref={ref} >
                    {/* <motion.div animate={animation} className="flex flex-col lg:flex-row lg:gap-[20px] gap-0 mb-[30px] items-center w-full bg-white dark:bg-[#1D232A] "> */}
                    <div className="flex flex-col md:flex-row overflow-x-hidden rounded-lg">
                        <div className="  flex-1  flex items-center justify-center ">
                            <div className="  flex items-center justify-center w-full h-full overflow-hidden dark:bg-[#131624] bg-local bg-no-repeat  " style={{ backgroundImage: 'url(/bg.png)' }}>
                                {/* 
                                {
                                    fullImg ? <div ref={sidebarRef} className='fullSlider absolute w-full h-full top-[56%] left-[50%] bg-gray-500 flex justify-center items-center bg-no-repeat ' >

                                        <img
                                            className="cursor-pointer w-[80%] h-[80%] object-contain"
                                            src={productDetails?.image}
                                            alt={productDetails?.name}
                                            loading="lazy"

                                        />

                                    </div> : <img
                                        className="w-48 lg:w-64 lg:p-0 p-4 cursor-pointer "
                                        src={productDetails?.image}
                                        alt={productDetails?.name}
                                        loading="lazy"
                                        onClick={handleFullImg}
                                    />}


                                {
                                    fullImg && <div className="absolute top-28 lg:top-20 right-0 text-white text-2xl lg:text-3xl font-bold p-2 cursor-pointer  hover:bg-black m-2 border-0 transition duration-800 rounded" onClick={handleImgClose}>
                                        X
                                    </div>
                                } */}




                                <img
                                    className="w-56 lg:w-72 shadow-2xl transition-transform hover:scale-105 duration-500"
                                    src={productDetails?.image}
                                    alt={productDetails?.name}
                                    loading="eager"
                                />


                            </div>
                        </div>

                        {/* <div className="flex-1 w-full h-full rounded-[4px] flex justify-center items-center bg-red-400  " >
                            <img src={productDetails?.image}
                                className="w-48 lg:w-64 lg:p-0 p-4 " loading="lazy"
                                alt={productDetails?.name} />
                        </div> */}

                        <div className="w-full flex-1 px-[2vw] lg:py-10 py-4 md:px-8   flex flex-col justify-center dark:bg-base-200 dark:text-white text-black  dark:border-none shadow-sm border md:rounded-r-2xl  ">
                            {/* book details  */}
                            <div className="flex flex-col gap-y-2">
                                <h4 className="capitalize tracking-wide text-blue-400 text-lg font-medium ">
                                    {productDetails?.category}
                                </h4>

                                {/* title  */}
                                <h1 className="text-xl lg:text-2xl">
                                    {productDetails?.name}
                                </h1>
                                <h2 className="">
                                    by <span
                                        className="text-blue-400">
                                        {productDetails?.author}
                                    </span>

                                </h2>

                            </div>



                            {/* price and btn   */}
                            <div className="flex items-center gap-x-8 my-2 lg:my-4">
                                {/* price  */}


                                <div className=" flex justify-center items-center gap-2 ">

                                    <div className="border rounded-[4px] shadow-sm flex flex-col text-center gap-[2px] px-2 py-2">
                                        < >
                                            {
                                                productDetails?.cover === 'hardcover' && <span className="text-[15px] font-medium tracking-wide"> Hardcover </span>
                                            }
                                            {
                                                productDetails?.cover == 'paperback' && <span className="text-[15px] font-medium tracking-wide "> Paperback </span>
                                            }
                                            {
                                                productDetails?.cover == 'leather bound' && <span className="text-[15px] font-medium tracking-wide "> Leather Bound </span>
                                            }
                                        </>

                                        <>
                                            {
                                                productDetails?.available === 'false' ?
                                                    <div className=" text-red-400"> --- </div>
                                                    :
                                                    <div className="flex gap-x-4">

                                                        <p className="text-md lg:text-lg font-semibold text-orange-400 line-through flex"><span>&#x09F3;</span> {productDetails?.price}</p>
                                                        <p className="text-md lg:text-lg font-semibold text-blue-400 flex"><span>&#x09F3;</span> {discountPrice}</p>


                                                    </div>

                                            }</>


                                    </div>



                                    {/* add to cart button  */}

                                    <div className="">
                                        {
                                            productDetails?.available === 'false' ? <h2 className="text-xl text-red-600">Stock Out</h2> : <div className="">
                                                <button
                                                    onClick={() => handleAddToCart(productDetails)}
                                                    className="px-2 py-2 font-semibold tracking-wide bg-blue-400 text-black hover:text-white hover:bg-black hover:duration-300 transition-all text-[12px] lg:text-[14px] border-0 rounded-[4px] uppercase">Add to cart
                                                </button>

                                            </div>

                                        }
                                    </div>

                                    {
                                        isAdmin && <div>
                                            <Link to={`/dashboard/updateBook/${productDetails?._id}`}>

                                                <div className="flex justify-center items-center gap-1 btn"><MdEdit></MdEdit><span>Edit</span></div>
                                            </Link>

                                        </div>
                                    }
                                </div>
                            </div>

                            {/* stock quantity  */}
                            {
                                productDetails?.available === 'true' && typeof productDetails?.quantity === 'number' &&
                                <p className={`text-sm font-medium mb-2 ${productDetails.quantity <= 5 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-300'}`}>
                                    {productDetails.quantity <= 5 ? `Only ${productDetails.quantity} left in stock` : `In stock: ${productDetails.quantity} available`}
                                </p>
                            }

                            {/* pre order  */}

                            <div className="flex">
                                {
                                    productDetails?.available === 'false' &&
                                    <div className="flex items-center justify-center gap-2 mt-1 border  dark:text-white p-4 text-[18px] rounded font-semibold shadow-lg hover:scale-95 hover:duration-300 transition-all">
                                        <FaAmazon />
                                        <a href="https://m.me/bookoceanbd" target="_blank" rel="noreferrer" className="  text-[#FF9900]">Pre-order Now</a>

                                    </div>

                                }
                            </div>




                            {/* original  */}
                            <div className="flex flex-col gap-y-2 my-4">
                                <div className="flex gap-x-2 items-center">
                                    <TbTruckDelivery className="w-7 h-7" />
                                    <p className="text-[14px] md:text-[16px] tracking-wide">Fast Shipping</p>
                                </div>
                                <div className="flex gap-x-2  items-center">
                                    <MdOutlineGppGood className="w-7 h-7" />
                                    <p className="text-[14px] md:text-[16px] tracking-wide">Get Premium Quality Original Books</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <MdPayment className="w-7 h-7" />
                                    <p className="text-[14px] md:text-[16px] tracking-wide">Cash On Delivery Service is Available</p>
                                </div>
                            </div>
                            <hr />
                            {/* social  */}
                            <div>
                                <h2 className='font-semibold my-4'>
                                    Follow Our Social Medias:
                                </h2>
                                <div className=' flex max-w-max gap-x-4 text-lg mb-5'>

                                    <a href="https://www.facebook.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:scale-95 duration-500">
                                        <img className='w-8' src={facebook} alt="" />
                                    </a>

                                    <a href="https://www.instagram.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:scale-95 duration-500">
                                        <img className='w-8' src={instagram} alt="" />
                                    </a>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* </motion.div> */}
                </div>
                {/* Description  */}
                <section>
                    {/* <FadeIn delay={0.4} direction='up' > */}
                    <BookDescription />
                    {/* </FadeIn> */}
                </section>
                {/* relatged  product  */}
                <section>
                    <RelatedBooks
                        categoryTitle={productDetails?.category}
                    ></RelatedBooks>
                </section>
            </div >
        </section >
    );
};

export default BookDetails;