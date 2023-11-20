import { Swiper, SwiperSlide } from 'swiper/react';
// import '../../../style/slider.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import book1 from '../../../assets/hero/book1.png'
import book2 from '../../../assets/hero/book2.png'
import book3 from '../../../assets/hero/book3.png'
const sliderData = [
    {
        img: book1,
        preTitle: 'Special Offer',
        titlePart1: 'Save 20%',
        titlePart2: 'On Your',
        titlePart3: 'first order',
        btnText: 'Shop now'
    },
    {
        img: book2,
        preTitle: 'Special Offer',
        titlePart1: 'Save 20%',
        titlePart2: 'On Your',
        titlePart3: 'first order',
        btnText: 'Shop now'
    },
    {
        img: book3,
        preTitle: 'Special Offer',
        titlePart1: 'Save 20%',
        titlePart2: 'On Your',
        titlePart3: 'first order',
        btnText: 'Shop now'
    }
]

const MainSlider = () => {
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
            className=' h-full xl:mainSlider xl:bg-no-repeat max-w-lg lg:max-w-none rounded-[8px] overflow-hidden drop-shadow-2xl'
        >
            <>
                {
                    sliderData.map((slide, i) => {
                        return <SwiperSlide key={i}>
                            <div className='flex flex-col lg:flex-row h-full p-[20px] md:p-[60px]'>

                                <div className='w-full lg:flex-1'>
                                    {/* text  */}
                                    <div className='uppercase mb-1 text-center lg:text-left text-black'> {slide.preTitle}</div>
                                    <div className='text-3xl md:text-[46px] font-semibold uppercase leading-none text-center lg:text-left mb-8 xl:mb-20 text-black'>
                                        {slide.titlePart1} <br />
                                        {slide.titlePart2}<br />
                                        {slide.titlePart3}<br />
                                    </div>
                                    {/* <button className='btn bg-blue-400  border-none  flex mx-auto lg:mx-0 hover:bg-black hover:text-white dark:text-white '>Shop Now</button> */}
                                </div>
                                <div className='flex-1'>
                                    <img className='xl:absolute  w-[400px] xl:right-10 xl:bottom-6' src={slide.img} alt="" />
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