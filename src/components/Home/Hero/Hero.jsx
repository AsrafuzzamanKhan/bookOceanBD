import CategoryNav from "../../CategoryNav/CategoryNav";
import MainSlider from "../MainSlider/MainSlider";
import useBanner from "../../../hooks/useBanner";

const Hero = () => {
    const [bannerData] = useBanner();
    const promo = bannerData.filter(item => item.promo === 'promo');
    return (
        <section className="mb-[30px] pt-28 md:pt-28 lg:pt-24  ">
            <div className="container mx-auto">
                <div className="flex flex-col gap-y-[20px] lg:flex-row lg:gap-x-[15px] px-1 lg:px-0">
                    {/* sidebar  */}
                    <div className="bg-slate-300 text-black rounded-[4px]">
                        <CategoryNav></CategoryNav>
                    </div>
                    {/* hero slider  */}
                    <div className="flex flex-col lg:flex-row gap-2 w-full ">
                        <div className=' w-full lg:w-[550px] xl:w-[850px]  mx-auto shadow-sm glass rounded-[4px] dark:text-white'>
                            <MainSlider></MainSlider>
                        </div>

                        {/* promo */}
                        <div className="hidden lg:block w-full  lg:h-[500px] mx-auto  overflow-hidden">
                            <div className='flex flex-col gap-4  '>

                                {
                                    promo.map((item, i) =>
                                        <div key={i} className='flex h-[240px] w-full rounded-[4px]  p-6 lg:p-2 bg-slate-400 justify-between glass text-black overflow-hidden'>
                                            {/* text  */}
                                            <div className='flex-1 flex flex-col  justify-center '>
                                                <div className='text-[16px] uppercase font-medium leading-snug mb-2'>Amazon Pre Order</div>
                                                <div className='text-[16px] uppercase font-medium leading-snug mb-2 text-slate-500'>Save {item.discount}%  </div>
                                                <div className='text-[20px] lg:text-[18px]  uppercase font-medium leading-snug mb-2'>{item.name} </div>
                                                {/* <a href="#" className='uppercase text-blue-400'>Shop now</a> */}
                                            </div>

                                            <div className=' flex-1 w-full flex justify-center items-center '>
                                                <img className='w-[140px] p-2 object-cover' src={item.image} alt={item.image} />
                                            </div>

                                        </div>
                                    )}
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