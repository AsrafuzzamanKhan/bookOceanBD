import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import CategoryNav from "../../CategoryNav/CategoryNav";
import MainSlider from "../MainSlider/MainSlider";
import useBanner from "../../../hooks/useBanner";

const Hero = () => {
    const [bannerData] = useBanner();
    const promo = bannerData.filter(item => item.promo === 'promo');
    return (
        <section className="pt-[6rem] md:pt-28 lg:pt-24 pb-6 bg-gray-50 dark:bg-gray-950/60 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto">
                <div className="flex flex-col gap-y-3 lg:flex-row lg:gap-x-4 px-1 lg:px-0">
                    {/* sidebar  */}
                    <CategoryNav />

                    {/* hero slider  */}
                    <div className="flex flex-col lg:flex-row gap-3 w-full ">
                        <div className='w-full lg:w-[550px] xl:w-[800px] lg:h-[450px] mx-auto'>
                            <MainSlider></MainSlider>
                        </div>

                        {/* promo */}
                        <div className="hidden lg:block w-full lg:h-[450px] mx-auto overflow-hidden">
                            <div className='flex flex-col gap-3 h-full'>

                                {
                                    promo.map((item, i) =>
                                        <Link
                                            to={item.category ? `/books/${item.category}` : '/books'}
                                            key={i}
                                            className='flex-1 flex rounded-xl p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md justify-between items-center overflow-hidden group transition-shadow duration-300'
                                        >
                                            {/* text  */}
                                            <div className='flex-1 flex flex-col justify-center'>
                                                <div className='text-[11px] uppercase font-bold tracking-wider text-blue-500 mb-1.5'>Amazon Pre Order</div>
                                                <div className='text-sm font-bold uppercase leading-snug mb-1 text-orange-500'>Save {item.discount}%</div>
                                                <div className='text-base font-semibold leading-snug capitalize text-gray-900 dark:text-white line-clamp-2'>{item.name}</div>
                                                <span className='mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-500 group-hover:gap-2 transition-all duration-200'>
                                                    Shop now <FiArrowRight size={13} />
                                                </span>
                                            </div>

                                            <div className='flex-1 w-full flex justify-center items-center '>
                                                <img className='w-[110px] object-contain group-hover:scale-105 transition-transform duration-300' src={item.image} alt={item.name} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                                            </div>

                                        </Link>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
