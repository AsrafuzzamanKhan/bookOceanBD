import './Footer.css'
import facebook from '../../../assets/social/facebook.png'
import instagram from '../../../assets/social/instagram.png'
const Footer = () => {

    return (
        <footer className='pt-16 bg-slate-950 text-white/[.8]  '>

            <div className="container mx-auto px-2">
                <div className='text-center text-white/[.8]'>
                    <h2 className='h2 uppercase mb-6 font-semibold'>Subscribe to our newsletter</h2>
                    <p className=''>Be the first to get the latest news abour trends, promotions and much more!</p>
                </div>
                <form className='w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-5 my-8' >
                    <input type="email" placeholder="Your Email Address"
                        className="input bg-white  " />
                    <button className="btn bg-blue-400 hover:bg-black min-w-[150px] text-white outline-none border-0">Join</button>
                </form>
                {/* link  */}
                <div className='text-base flex lg:flex-row flex-col gap-x-6 gap-y-4 max-w-max mx-auto mb-5  justify-between'>
                    <div className='lg:w-1/4 w-full'>
                        Welcome to <strong>Book Ocean BD</strong>, your premier destination for importing <strong>authentic and original print</strong> books in Bangladesh! Immerse yourself in the joy of reading with our extensive collection of carefully curated titles, spanning genres from fiction to non-fiction, mystery to romance, and everything in between.

                        <div className='mt-6'>
                            <div className='font-semibold mb-2'>
                                <h1> Why choose Book Ocean BD?</h1>
                            </div>
                            <p>We take pride in delivering the literary treasures you love, right to your doorstep, anywhere in Bangladesh. Our commitment to quality ensures that every book you order is an authentic, high-quality print edition, promising you an unparalleled reading experience.</p>
                        </div>

                    </div>
                    <div className='lg:w-2/5 w-full hidden lg:block'>

                        <div>
                            <p>
                                Experience the convenience of pre-ordering your desired books with us. Stay ahead of the literary curve by securing your copy in advance, and {"we'll"} make sure it reaches you promptly. No more waiting in anticipation – we prioritize your love for reading by making pre-orders a seamless and efficient process.
                            </p>
                        </div>

                        <div className='font-semibold mt-2'>
                            <h1>{"Here's"} what sets us apart:</h1>
                        </div>
                        <div className='my-2'>
                            <div>
                                <span className='font-semibold me-2'> Authenticity Guarantee:</span> Every book we offer is an original print edition, promising you the genuine joy of holding a physical book in your hands.
                            </div>


                            <div>
                                <span className='font-semibold me-2'>Nationwide Delivery:</span>
                                No matter where you are in Bangladesh, {"we'll"} bring the world of literature to your doorstep. Our reliable delivery service ensures a smooth and secure transit for your books.
                            </div>

                            <div>
                                <span className='font-semibold me-2'>Effortless Pre-Ordering:</span>
                                Be the first to get your hands on the latest releases or secure your favorite titles before they hit the shelves. Our pre-ordering system is designed to be quick and hassle-free.
                            </div>

                            <div>
                                <span className='font-semibold me-2'>Diverse Collection:</span>
                                Explore a diverse range of genres and authors, carefully selected to cater to every reading taste. From bestsellers to hidden gems, we have something for everyone.
                            </div>
                        </div>







                    </div>
                    <div className='lg:w-1/4 w-full'>
                        <div className='text-lg mb-4 font-semibold'>
                            Need help?
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <div>
                                Call us: <span className='mx-2'><a href="tel:+8801851718980" target="_blank" rel="noreferrer" className=" hover:text-blue-600 hover:underline hover:duration-300 transition-all">+88-01851718980</a></span>
                            </div>
                            <div>

                                E-mail us: <span className='mx-2'><a href="mailto:info@bookoceanbd.com" target="_blank" rel="noreferrer" className=" hover:text-blue-600 hover:underline hover:duration-300 transition-all">info@bookoceanbd.com</a></span>
                            </div>
                            <div>
                                Join our Messenger: <span className='mx-2'><a href="https://m.me/bookoceanbd" target="_blank" rel="noreferrer" className=" hover:text-blue-600 hover:underline hover:duration-300 transition-all">m.me/bookoceanbd</a></span>
                            </div>
                            {/* socila  */}
                            <div>
                                <div className='font-semibold my-4'>
                                    Our presence in Social Medias:
                                </div>
                                <div className=' flex max-w-max gap-x-4 text-lg mb-5'>

                                    <a href="https://www.facebook.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all">
                                        <img className='w-10' src={facebook} alt="" />
                                    </a>

                                    <a href="https://www.instagram.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all">
                                        <img className='w-10' src={instagram} alt="" />
                                    </a>
                                </div>
                            </div>

                        </div>
                        <div className="my-2 text-gray-500">
                            <hr className="border-gray-500 dark:border-white" />


                        </div>
                        <div>
                            Discover the joy of reading with <strong>Book Ocean BD</strong>. Order your favorite books today and embark on a literary journey that transcends boundaries, delivered to your doorstep with care and precision.
                        </div>
                    </div>
                </div>


            </div>
            {/* copy rigte  */}
            <div className='py-10 border-t border-white/[0.2]'>
                <div className='container mx-auto'>
                    <div className='text-center text-sm px-[2vw]'>
                        Copyright &copy; Book Ocean BD 2024. All rights reserved
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;