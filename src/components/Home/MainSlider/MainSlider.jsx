import { Swiper, SwiperSlide } from 'swiper/react';
// import '../../../style/slider.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

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
            className=' h-full border dark:border-0 rounded-[4px] overflow-hidden drop-shadow-xl '
        >
            <>
                {
                    hero?.map((slide, i) => {

                        return <SwiperSlide key={i}>
                            <div className='w-full flex flex-col justify-center items-center gap-2 lg:flex-row h-full p-2 lg:p-8 dark:text-white'>

                                <div className='flex-1 '>
                                    {/* text  */}
                                    <div className='uppercase mb-3 text-center lg:text-left text-black dark:text-gray-100 '> Amazon Pre Order</div>
                                    <div className='flex flex-col gap-y-2 text-xl lg:text-2xl  font-semibold  leading-none text-center lg:text-left text-black dark:text-gray-100'>
                                        <div className='uppercase'>  {slide.discount}% Discount</div>
                                        <div className=' capitalize'> {slide.name}</div>
                                        <div className='text-md lg:text-2xl'>
                                            by <span className=''>{slide.author}</span></div>
                                    </div>

                                </div>

                                {/* <div className='flex-1 mx-auto p-2 md:p-0'>
                                    <img className='w-64 lg:w-96' src={slide.image} alt={slide.name} />
                                </div> */}

                                <React.Suspense fallback={
                                    <span className="loading loading-bars loading-lg"></span>
                                }>
                                    <div className='flex-1 mx-auto p-2 md:p-0'>
                                        <img className='w-64 lg:w-96' src={slide.image} alt={slide.name} />
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