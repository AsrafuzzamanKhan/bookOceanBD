
import { FaYoutube, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
const Footer = () => {
    return (
        <footer className='pt-16 bg-slate-300 text-black'>
            <div className="container mx-auto px-2">
                <div className='text-center text-black'>
                    <h2 className='h2 uppercase mb-6 font-semibold'>Subscribe to our newsletter</h2>
                    <p className=''>Be the first to get the latest news abour trends, promotions and much more!</p>
                </div>
                <form className='w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-5 my-8' >
                    <input type="email" placeholder="Your Email Address"
                        className="input bg-white  " />
                    <button className="btn bg-blue-400 hover:bg-black min-w-[150px] text-white outline-none border-0">Join</button>
                </form>
                {/* link  */}
                <div className='text-base flex gap-x-6 capitalize max-w-max mx-auto mb-5'>
                    <a href="#" className="hover:text-green-600 transition-all">Track your order</a>
                    <a href="#" className="hover:text-green-600 transition-all">Return Policy</a>
                    <a href="#" className="hover:text-green-600 transition-all">Shipping & delivery</a>
                </div>
                {/* social  */}
                <div className='text-xl text-blue-400 text-center mb-5'>Follow our social media platform</div>
                <div className=' flex max-w-max mx-auto gap-x-6 text-lg mb-5'>
                    {/* <a href="#" className="hover:text-green-600 transition-all">
                        <FaYoutube></FaYoutube> </a> */}
                    <a href="https://www.facebook.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all">
                        <FaFacebook size={30}></FaFacebook>
                    </a>
                    {/* <a href="#" className="hover:text-green-600 transition-all"><FaTwitter></FaTwitter></a> */}
                    <a href="https://www.instagram.com/bookoceanbd/" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-all"><FaInstagram size={30}></FaInstagram></a>
                </div>
            </div>
            {/* copy rigte  */}
            <div className='py-10 border-t border-t-black'>
                <div className='container mx-auto'>
                    <div className='text-center text-sm'>
                        Copyright &copy; Book Ocean BD 2023. All rights reserved
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;