import CategoryNav from "../../CategoryNav/CategoryNav";
import MainSlider from "../MainSlider/MainSlider";
import promo1 from '../../../assets/promo/hp1.jpg'
import promo2 from '../../../assets/promo/hp3.jpg'

const Hero = () => {
    return (
        <section className="mb-[30px] pt-36 md:pt-36 lg:pt-0 xl:pt-28 ">
            <div className="container mx-auto">
                <div className="flex flex-col gap-y-[20px] lg:flex-row lg:gap-x-[20px] px-1 lg:px-1">
                    {/* sidebar  */}
                    <div className="bg-slate-300 text-black rounded-[8px]">
                        <CategoryNav></CategoryNav>
                    </div>
                    {/* hero slider  */}
                    <div className="flex flex-col  lg:flex-row gap-4 w-full">
                        <div className='w-full lg:max-w-[734px] mx-auto shadow-2xl glass rounded-[8px]'>
                            <MainSlider></MainSlider>
                        </div>


                        <div className='flex flex-col gap-4 w-full  mx-auto lg:h-[500px] overflow-hidden'>
                            <div className='flex h-[240px] w-full rounded-[8px]  p-6 bg-slate-400 justify-between glass text-black'>
                                {/* text  */}
                                <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                    <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Book </div>
                                    <a href="#" className='uppercase text-blue-400'>Shop now</a>
                                </div>


                                <img className='flex ' src={promo1} alt="" />

                            </div>
                            {/* promo 2  */}
                            <div className='flex  w-full h-[240px] rounded-[8px]  p-6 bg-slate-400 justify-between glass text-black'>
                                {/* text  */}
                                <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                    <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Book </div>
                                    <a href="#" className='uppercase text-blue-400'>Shop now</a>
                                </div>


                                <img className='flex ' src={promo2} alt="" />

                            </div>
                        </div>
                    </div>

                    {/* </div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;