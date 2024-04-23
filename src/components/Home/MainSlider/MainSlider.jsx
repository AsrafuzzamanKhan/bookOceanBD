import { Swiper, SwiperSlide } from 'swiper/react';
// import '../../../style/slider.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

import useBanner from '../../../hooks/useBanner';

const MainSlider = () => {
    const [bannerData] = useBanner()
    const hero = bannerData.filter(item => item.promo === 'hero');
    // console.log(hero.length)
    return (
        <Swiper
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}

            pagination={{
                clickable: true,
            }}
            className=' h-full border dark:border-0 rounded-[4px] overflow-hidden drop-shadow-2xl '
        >
            <>
                {
                    hero?.map((slide, i) => {

                        return <SwiperSlide key={i}>
                            <div className='w-full flex flex-col justify-center items-center gap-4 lg:flex-row h-full p-8 dark:text-white'>

                                <div className='flex-1 '>
                                    {/* text  */}
                                    <div className='uppercase mb-3 text-center lg:text-left text-black dark:text-gray-100 '> Amazon Pre Order</div>
                                    <div className='flex flex-col gap-y-2 text-2xl md:text-[30px] font-semibold  leading-none text-center lg:text-left text-black dark:text-gray-100'>
                                        <div className=' uppercase'>  {slide.discount}% Discount</div>
                                        <div className=' capitalize'> {slide.name}</div>
                                        <div className='text-xl'>
                                            by {slide.author}</div>

                                    </div>

                                </div>
                                <div className='flex-1 mx-auto'>
                                    <img className='w-96' src={slide.image} alt="" />

                                </div>
                            </div>
                        </SwiperSlide>
                    })
                }


            </>
        </Swiper >
    );
};

export default MainSlider;