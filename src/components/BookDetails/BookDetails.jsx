import { useNavigate, useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import FadeIn from "../../Animation/FadeIn";
import { motion, useAnimate, useAnimation, useScroll } from "framer-motion"
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";


const BookDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const [booksData] = useBookData()
    const navigate = useNavigate()
    const [, refetch] = useCart()
    const [cart, setCart] = useState([])
    const [amount, setAmount] = useState(0)
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
                    type: 'spring', duration: 4, bounce: 0.3
                }
            })
        }
        if (!inView) {
            animation.start({ y: '-100vw' })
        }

    }, [animation, inView])
    const productDetails = booksData.find(pd => pd._id == id)

    // console.log('product details', productDetails)

    if (!productDetails) {
        return <div className="container mx-auto">loading....</div>
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


                        setCart([...cart, cartItem])
                        const allCartItem = cart.find(item => item.bookId === _id)
                        if (allCartItem) {
                            const newCart = cart.map(item => {
                                if (item.bookId === _id) {
                                    setAmount(allCartItem.amount + 1)
                                    return { ...item, amount: allCartItem.amount + 1 }
                                }
                                else { return item }
                            }
                            );
                            setCart(newCart)
                        }
                        else {
                            setCart([...cart, cartItem])
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
    return (
        <div className="mb-16 pt-36 lg:pt-[30px] xl:pt-36">
            <div className="container mx-auto px-2">
                <Helmet>
                    <title>Book Ocean BD || Book Details</title>
                </Helmet>
                {/* text  */}
                <div ref={ref} className="flex flex-col lg:flex-row lg:gap-[30px] gap-0 mb-[30px]  items-center">
                    <motion.div

                        animate={animation}

                        className="flex-1 max-w-[40%] lg:h-[550px]  lg:shadow-xl shadow-none rounded-lg flex justify-center items-center dark:border-0 dark:bg-gary-800" >
                        {/* <div className="flex-1 lg:max-w-[40%] lg:h-[550px] border shadow-2xl rounded-lg flex justify-center items-center dark:border-0 dark:bg-gary-800"> */}

                        <img src={productDetails.image}
                            className=" max-w-[65%] max-h-96 py-4"
                            alt="image" />
                        {/* </div> */}
                    </motion.div>
                    <motion.div
                        animate={animation}
                        className="flex-1 py-12 px-4 xl:p-20 flex flex-col justify-center dark:bg-base-200 dark:text-white text-black rounded-[8px] shadow-lg">
                        {/* category  */}
                        <div className="uppercase text-blue-400 text-lg font-medium mb-2"> {productDetails.category}  </div>
                        {/* title  */}
                        <h2 className="h2 mb-2"> {productDetails.name}</h2>
                        <div className="mb-6">
                            by <span className="text-blue-400 ">{productDetails.author}</span>
                        </div>


                        {/* price and btn   */}
                        <div className="flex items-center gap-x-8 mb-10">
                            {/* price  */}


                            <div className=" flex justify-center items-center gap-4">

                                <div className="border rounded-[8px] shadow-md flex flex-col h-auto p-2">
                                    <div >
                                        {
                                            productDetails.cover === 'hardcover' && <span className="text-[15px] "> Hardcover </span>
                                        }
                                        {
                                            productDetails.cover == 'paperback' && <span className="text-[15px] "> Paperback </span>
                                        }
                                    </div>
                                    <div className="text-xl font-semibold text-blue-400"><span>&#x09F3;</span> {productDetails.price}</div>
                                </div>


                                {/* add to cart button  */}
                                <div className="">
                                    <button
                                        onClick={() => handleAddToCart(productDetails)}
                                        className="btn bg-blue-400 text-white hover:bg-black transition-all">Add to cart
                                    </button>

                                </div>
                            </div>


                        </div>
                        {/* description  */}
                        <p className="mb-5">{productDetails.description}</p>

                    </motion.div>
                </div>
                {/* relatged  product  */}
                <FadeIn delay={0.4} direction='up' >
                    <RelatedBooks
                        categoryTitle={productDetails.category}
                    ></RelatedBooks>
                </FadeIn>
            </div>
        </div>
    );
};

export default BookDetails;