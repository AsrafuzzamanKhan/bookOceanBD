import { Swiper, SwiperSlide } from 'swiper/react';
// import '../../../style/slider.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import useBanner from '../../../hooks/useBanner';
import React from 'react';

const MainSlider = () => {
    const [bannerData] = useBanner()
    const hero = bannerData.filter(item => item.promo === 'hero');
    // console.log(hero.length)
    return (
        <Swiper
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}

            pagination={{
                clickable: true,
            }}
            className='hero-slider h-full rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700'
        >
            <>
                {
                    hero?.map((slide, i) => {

                        return <SwiperSlide key={i}>
                            <div className='w-full h-full flex flex-col justify-center items-center gap-2 lg:flex-row bg-gradient-to-br from-blue-50 via-white to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 lg:p-10'>

                                <div className='flex-1 text-center lg:text-left'>
                                    {/* text  */}
                                    <span className='inline-block uppercase text-xs font-bold tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full mb-3'>
                                        Amazon Pre Order
                                    </span>
                                    <div className='flex flex-col gap-y-1.5'>
                                        <div className='uppercase text-sm font-bold text-orange-500'>{slide.discount}% Discount</div>
                                        <div className='capitalize text-xl lg:text-3xl font-bold leading-tight text-gray-900 dark:text-white'>
                                            {slide.name}
                                        </div>
                                        <div className='text-sm lg:text-base text-gray-500 dark:text-gray-400'>
                                            by <span className='font-medium text-gray-700 dark:text-gray-300'>{slide.author}</span>
                                        </div>
                                    </div>

                                    {slide.category && (
                                        <Link
                                            to={`/books/${slide.category}`}
                                            className='mt-5 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200'
                                        >
                                            Shop Now <FiArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>

                                <React.Suspense fallback={
                                    <span className="loading loading-bars loading-lg"></span>
                                }>
                                    <div className='flex-1 mx-auto p-2 md:p-0'>
                                        <img className='w-52 lg:w-72 drop-shadow-xl' src={slide.image} alt={slide.name} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                                    </div>
                                </React.Suspense>
                            </div>
                        </SwiperSlide>
                    })
                }


            </>
        </Swiper >
    );
};

export default MainSlider;
