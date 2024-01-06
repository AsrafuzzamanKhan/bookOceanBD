import CategoryNav from "../../CategoryNav/CategoryNav";
import MainSlider from "../MainSlider/MainSlider";
import useBanner from "../../../hooks/useBanner";

const Hero = () => {
    const [bannerData] = useBanner();
    const promo = bannerData.filter(item => item.promo === 'promo');
    return (
        <section className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 ">
            <div className="container mx-auto">
                <div className="flex flex-col gap-y-[20px] lg:flex-row lg:gap-x-[15px] px-1 lg:px-0">
                    {/* sidebar  */}
                    <div className="bg-slate-300 text-black rounded-[7px]">
                        <CategoryNav></CategoryNav>
                    </div>
                    {/* hero slider  */}
                    <div className="flex flex-col lg:flex-row gap-3 w-full ">
                        <div className=' w-full lg:w-[780px] mx-auto shadow-2xl glass rounded-[4px] dark:text-white'>
                            <MainSlider></MainSlider>
                        </div>

                        {/* promo */}
                        <div className='flex flex-col gap-4 w-full  lg:h-[500px] mx-auto  overflow-hidden '>

                            {promo.map((item, i) =>
                                <div key={i} className='flex h-[240px] w-full rounded-[4px]  p-6 bg-slate-400 justify-between glass text-black overflow-hidden'>
                                    {/* text  */}
                                    <div className='flex flex-col h-full justify-center'>
                                        <div className='text-[16px] uppercase font-medium leading-snug mb-2'>Amazon Pre Order   </div>
                                        <div className='text-[16px] uppercase font-medium leading-snug mb-2'>Save {item.discount}%  </div>
                                        <div className='text-[20px] uppercase font-medium leading-snug mb-2'>{item.name} </div>
                                        {/* <a href="#" className='uppercase text-blue-400'>Shop now</a> */}
                                    </div>

                                    <img className=' ' src={item.image} alt="" />

                                </div>
                            )}
                        </div>
                    </div>

                    {/* </div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;