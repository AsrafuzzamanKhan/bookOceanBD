import { Swiper, SwiperSlide } from 'swiper/react';
// import '../../../style/slider.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import BookCard from '../BookCard/BookCard';
const BookSlider = ({ data }) => {
    return (
        <Swiper
            autoplay={{
                delay: 6000,

            }}
            pagination={{
                clickable: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}

            loop={false}
            navigation={true}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                    spaceBetween: 30
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30
                },
                1440: {
                    slidesPerView: 5,
                    spaceBetween: 30
                },

            }}
            className='productSlider  w-full mx-auto'
        // className='productSlider  w-full mx-auto max-w-[360px] md:max-w-lg xl:max-w-[1410px]'
        >
            <>
                {data?.map(book => {
                    return <SwiperSlide className='mb-12' key={book._id}>
                        <BookCard book={book}></BookCard>
                    </SwiperSlide>
                })}
            </>
        </Swiper >
    );
};

export default BookSlider;