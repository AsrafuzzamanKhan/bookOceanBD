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
import useBanner from '../../../hooks/useBanner';

const MainSlider = () => {
    const [bannerData] = useBanner()
    const hero = bannerData.filter(item => item.promo === 'hero');
    console.log(hero.length)
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
            className=' h-full border rounded-[8px] overflow-hidden drop-shadow-2xl '
        >
            <>
                {
                    hero?.map((slide, i) => {

                        return <SwiperSlide key={i}>
                            <div className='w-full flex flex-col justify-center items-center gap-4 lg:flex-row h-full p-8'>

                                <div className='flex-1 '>
                                    {/* text  */}
                                    <div className='uppercase mb-1 text-center lg:text-left text-black'> Amazon Pre Order</div>
                                    <div className='text-3xl md:text-[34px] font-semibold uppercase leading-none text-center lg:text-left mb-8 xl:mb-20 text-black'>
                                        <div className='mb-4'>  {slide.discount}% Discount</div>
                                        <div className='mb-4'> {slide.name}</div>
                                        <div>
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