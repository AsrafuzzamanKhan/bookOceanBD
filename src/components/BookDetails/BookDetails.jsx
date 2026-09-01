import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import Swal from "sweetalert2";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { MdEdit, MdPayment, MdOutlineGppGood, MdClose, MdZoomIn } from "react-icons/md";
import facebook from '../../assets/social/facebook.png'
import instagram from '../../assets/social/instagram.png'
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdHome } from "react-icons/io";
import { FaAmazon, FaShoppingCart, FaShareAlt, FaRegCheckCircle } from "react-icons/fa";

import useAdmin from "../../hooks/useAdmin";
import BookDescription from "../BookDescription/BookDescription";
import { Helmet } from "react-helmet";
import { trackPixelEvent } from "../../utils/fbPixel";

const coverLabels = {
    hardcover: 'Hardcover',
    paperback: 'Paperback',
    'leather bound': 'Leather Bound',
};

const trustBadges = [
    { icon: TbTruckDelivery, label: 'Fast Shipping' },
    { icon: MdOutlineGppGood, label: 'Premium Quality Original Books' },
    { icon: MdPayment, label: 'Cash On Delivery Available' },
];

const BookDetails = () => {

    const { id } = useParams()
    const { user } = useAuth()
    const [isAdmin] = useAdmin()
    const navigate = useNavigate()
    const [, refetch] = useCart()
    const [axiosSecure] = useAxiosSecure()
    const { setIsOpen, isOpen } = useContext(CartContext)

    // click-to-zoom lightbox for the cover image
    const [fullImg, setFullImg] = useState(false);
    const lightboxRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (lightboxRef.current && !lightboxRef.current.contains(event.target)) {
                setFullImg(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Esc closes the lightbox too
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') setFullImg(false)
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Fetched by id directly (full document, description included) rather
    // than filtered out of the shared all-books list - that list deliberately
    // excludes description now (see GET /books on the server) since it's
    // the single largest field on every book and isn't used anywhere else
    // that list feeds; only this page needs it.
    const { data: productDetails } = useQuery({
        queryKey: ['book', id],
        queryFn: async () => {
            const res = await fetch(`https://book-ocean-bd-server.vercel.app/books/${id}`)
            if (!res.ok) return null
            return res.json()
        },
        enabled: !!id,
    })
    const discount = productDetails?.price * 0.05;
    const discountPrice = parseInt(productDetails?.price - discount)
    const discountPercent = productDetails?.price ? Math.round((discount / productDetails.price) * 100) : 0;

    // sticky mobile add-to-cart bar - only shows once the main card (with
    // its own, already-visible Add to Cart button) has scrolled out of view,
    // so it's never showing two of the same button on screen at once
    const [showStickyBar, setShowStickyBar] = useState(false);
    const mainCardRef = useRef(null);
    useEffect(() => {
        const node = mainCardRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyBar(!entry.isIntersecting),
            { rootMargin: '-64px 0px 0px 0px' }
        );
        observer.observe(node);
        return () => observer.disconnect();
        // productDetails is the real dependency: this component returns an
        // early "Loading..." placeholder (see below) until it arrives, so
        // mainCardRef.current is still null on the very first mount - an
        // empty dependency array here would attach to nothing and never
        // run again once the real, ref'd card actually exists
    }, [productDetails]);

    // real ViewContent - fired once per book actually viewed, not on every
    // page load site-wide (see src/utils/fbPixel.js)
    useEffect(() => {
        if (!productDetails) return;
        trackPixelEvent('ViewContent', {
            content_ids: [productDetails._id],
            content_name: productDetails.name,
            content_type: 'product',
            value: productDetails.price,
            currency: 'BDT',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productDetails?._id]);

    if (!productDetails) {
        return <div className="container mx-auto flex text-center justify-center">Loading...
        </div>
    }

    const handleAddToCart = (item) => {

        const { category, name, image, _id, author } = item;

        const cartItem = { bookId: _id, category, name, author, image, discountPrice, email: user?.email, quantity: 1 }

        if (user) {
            // was a bare fetch() with no auth header; the server route now
            // requires login and always files the item under the caller's
            // own email (the `email` sent here is now ignored server-side)
            axiosSecure.post('/carts', cartItem)
                .then(res => {
                    const data = res.data
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
                .catch(err => showErrorToast('Could not add to cart', err.response?.data?.message || err.message))
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

    // share THIS book specifically - distinct from the static Facebook/
    // Instagram icons further down, which link to the store's own pages
    const handleShare = async () => {
        const url = `https://bookoceanbd.com/book/${productDetails.name.replace(/\s/g, "_")}/${productDetails._id}`;
        const shareData = { title: productDetails.name, text: `${productDetails.name} by ${productDetails.author} - Book Ocean BD`, url };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch { /* user canceled the share sheet - not an error */ }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            showSuccessToast('Link copied', 'Paste it anywhere to share this book.');
        } catch {
            showErrorToast('Could not copy link', 'Please copy the page URL manually.');
        }
    }

    const isAvailable = productDetails?.available === 'true';

    return (
        <section className="mb-4 pt-[7rem] md:pt-32 lg:pt-[5rem]" >
            <div className="container mx-auto min-h-screen" >
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

                {/* breadcrumb  */}
                <div className="flex flex-wrap items-center justify-start gap-x-2 px-[2vw] py-0 md:py-2 md:px-0 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <Link to='/' className="hover:text-blue-500 duration-200 flex">
                        <IoMdHome size={18} />
                    </Link>
                    <span>/</span>
                    <Link to={`/books/${productDetails?.category}`}>
                        <span className="text-blue-500 hover:text-blue-600 hover:underline duration-200 capitalize">
                            {productDetails?.category}
                        </span>
                    </Link>
                    <span>/</span>
                    <Link to={`/authorbooks/${productDetails?.author}`}>
                        <span className="text-blue-500 hover:text-blue-600 hover:underline duration-200">
                            {productDetails?.author}
                        </span>
                    </Link>
                    <span>/</span>
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-1 capitalize">
                        {productDetails?.name}
                    </span>
                </div>

                {/* main card  */}
                <div ref={mainCardRef} className="flex flex-col md:flex-row bg-white dark:bg-gray-800 border border-gray-100 dark:border-0 rounded-2xl shadow-sm overflow-hidden">

                    {/* cover  */}
                    <div className="md:w-[42%] flex items-center justify-center p-8 md:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-900/60 relative">
                        {productDetails?.newBook === 'true' && (
                            <span className="absolute top-4 left-4 md:top-6 md:left-6 bg-blue-500 text-white text-[11px] font-bold uppercase rounded-full px-2.5 py-1 shadow-sm z-10">
                                New
                            </span>
                        )}
                        {isAvailable && discountPercent > 0 && (
                            <span className="absolute top-4 right-4 md:top-6 md:right-6 bg-orange-400 text-white text-[11px] font-bold uppercase rounded-full px-2.5 py-1 shadow-sm z-10">
                                {discountPercent}% off
                            </span>
                        )}
                        <button
                            onClick={() => setFullImg(true)}
                            className="group relative cursor-zoom-in"
                            aria-label="Zoom into cover image">
                            <img
                                className="w-56 md:w-72 lg:w-80 shadow-2xl rounded transition-transform duration-500 group-hover:scale-105"
                                src={productDetails?.image}
                                alt={productDetails?.name}
                                loading="eager"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 duration-200 rounded">
                                <MdZoomIn className="text-white text-3xl opacity-0 group-hover:opacity-100 duration-200 drop-shadow" />
                            </span>
                        </button>
                    </div>

                    {/* details  */}
                    <div className="w-full md:w-[58%] px-6 md:px-8 py-6 md:py-10 flex flex-col justify-center text-black dark:text-white border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700">

                        <div className="flex items-start justify-between gap-3">
                            <h4 className="capitalize tracking-wide text-blue-500 text-sm font-bold">
                                {productDetails?.category}
                            </h4>
                            <button
                                onClick={handleShare}
                                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                                aria-label="Share this book"
                            >
                                <FaShareAlt size={12} /> Share
                            </button>
                        </div>

                        <h1 className="text-2xl lg:text-3xl font-bold mt-1 leading-snug capitalize">
                            {productDetails?.name}
                        </h1>
                        <p className="mt-1.5 text-gray-600 dark:text-gray-300">
                            by <Link to={`/authorbooks/${productDetails?.author}`} className="text-blue-500 hover:underline font-medium">{productDetails?.author}</Link>
                        </p>

                        {coverLabels[productDetails?.cover] && (
                            <span className="mt-3 inline-block w-fit text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1">
                                {coverLabels[productDetails.cover]}
                            </span>
                        )}

                        {/* price  */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            {isAvailable ? (
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">৳{discountPrice}</span>
                                    <span className="text-base line-through text-gray-400">৳{productDetails?.price}</span>
                                    {discountPercent > 0 && (
                                        <span className="text-xs font-bold text-white bg-orange-400 rounded px-2 py-0.5">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xl font-bold text-red-500">Stock Out</p>
                            )}

                            {/* stock quantity  */}
                            {isAvailable && typeof productDetails?.quantity === 'number' && (
                                <p className={`flex items-center gap-1.5 text-sm font-medium mt-2 ${productDetails.quantity <= 5 ? 'text-orange-500' : 'text-green-600 dark:text-green-400'}`}>
                                    <FaRegCheckCircle size={13} />
                                    {productDetails.quantity <= 5 ? `Only ${productDetails.quantity} left in stock - order soon` : `In stock: ${productDetails.quantity} available`}
                                </p>
                            )}
                        </div>

                        {/* CTA  */}
                        <div className="flex items-center gap-3 mt-5 flex-wrap">
                            {isAvailable ? (
                                <button
                                    onClick={() => handleAddToCart(productDetails)}
                                    className="flex items-center gap-2 px-6 py-3 font-semibold tracking-wide bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm rounded-lg shadow-sm">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 border dark:border-gray-600 px-5 py-3 text-sm rounded-lg font-semibold shadow-sm">
                                    <FaAmazon className="text-[#FF9900]" />
                                    <a
                                        href="https://m.me/bookoceanbd"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#FF9900] hover:underline"
                                        onClick={() => trackPixelEvent('Lead', { content_name: productDetails.name, content_category: 'pre-order' })}
                                    >Pre-order Now</a>
                                </div>
                            )}

                            {isAdmin && (
                                <Link to={`/dashboard/updateBook/${productDetails?._id}`}>
                                    <div className="flex items-center gap-1.5 px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <MdEdit /> <span>Edit</span>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* trust badges  */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            {trustBadges.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex sm:flex-col items-center sm:text-center gap-x-3 gap-y-2">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                                        <Icon size={18} />
                                    </span>
                                    <p className="text-sm tracking-wide text-gray-700 dark:text-gray-300">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* social  */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h2 className='font-semibold mb-3 text-sm text-gray-700 dark:text-gray-300'>
                                Follow Our Social Medias:
                            </h2>
                            <div className='flex max-w-max gap-x-4'>
                                <a href="https://www.facebook.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:scale-95 duration-300">
                                    <img className='w-8' src={facebook} alt="Book Ocean BD on Facebook" />
                                </a>
                                <a href="https://www.instagram.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:scale-95 duration-300">
                                    <img className='w-8' src={instagram} alt="Book Ocean BD on Instagram" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description  */}
                <section>
                    <BookDescription book={productDetails} />
                </section>
                {/* related products  */}
                <section>
                    <RelatedBooks
                        categoryTitle={productDetails?.category}
                    ></RelatedBooks>
                </section>
            </div>

            {/* sticky mobile add-to-cart bar - appears once the main card
                (which already has its own Add to Cart button) scrolls out
                of view, so the CTA stays reachable while reading the
                description/related books further down */}
            {showStickyBar && (
                <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3">
                    <img src={productDetails?.image} alt="" className="w-10 h-14 object-contain rounded shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate capitalize">{productDetails?.name}</p>
                        {isAvailable ? (
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">৳{discountPrice}</p>
                        ) : (
                            <p className="text-sm font-bold text-red-500">Stock Out</p>
                        )}
                    </div>
                    {isAvailable ? (
                        <button
                            onClick={() => handleAddToCart(productDetails)}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm rounded-lg shadow-sm">
                            <FaShoppingCart size={14} /> Add
                        </button>
                    ) : (
                        <a
                            href="https://m.me/bookoceanbd"
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 px-4 py-2.5 font-semibold text-white bg-[#FF9900] rounded-lg text-sm"
                            onClick={() => trackPixelEvent('Lead', { content_name: productDetails.name, content_category: 'pre-order' })}
                        >
                            Pre-order
                        </a>
                    )}
                </div>
            )}

            {/* zoomed cover lightbox  */}
            {fullImg && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
                    <div ref={lightboxRef} className="relative max-w-[90vw] max-h-[85vh]">
                        <button
                            onClick={() => setFullImg(false)}
                            aria-label="Close"
                            className="absolute -top-10 right-0 md:-right-10 md:top-0 text-white text-3xl p-1 hover:text-gray-300 transition-colors">
                            <MdClose />
                        </button>
                        <img
                            src={productDetails?.image}
                            alt={productDetails?.name}
                            className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </section >
    );
};

export default BookDetails;
