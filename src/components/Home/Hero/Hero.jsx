import CategoryNav from "../../CategoryNav/CategoryNav";
import MainSlider from "../MainSlider/MainSlider";
import promo1 from '../../../assets/promo/hp1.jpg'
import promo2 from '../../../assets/promo/hp3.jpg'

const Hero = () => {
    return (
        <section className="mb-[30px] pt-36 ">
            <div className="container mx-auto">
                <div className="flex flex-col gap-y-[20px] lg:flex-row lg:gap-x-[20px]">
                    {/* sidebar  */}
                    <div className="bg-slate-300 rounded-[8px]">
                        <CategoryNav></CategoryNav>
                    </div>
                    {/* main slider  */}
                    <div className="shadow-xl border w-full max-w-lg lg:max-w-[700px] mx-auto rounded-[8px]">
                        <MainSlider></MainSlider>
                    </div>

                    {/* promo part  */}
                    <div className='flex flex-col gap-y-[20px] w-full max-w-lg mx-auto h-[500px] overflow-hidden'>
                        <div className='flex h-[240px] rounded-[8px]  p-6 bg-slate-300 justify-between '>
                            {/* text  */}
                            <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Bicycle </div>
                                <a href="#" className='uppercase text-blue-400'>Shop now</a>
                            </div>


                            <img className='flex ' src={promo1} alt="" />

                        </div>
                        {/* promo 2  */}
                        <div className='flex h-[240px] rounded-[8px]  p-6 bg-slate-300 justify-between '>
                            {/* text  */}
                            <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Bicycle </div>
                                <a href="#" className='uppercase text-blue-400'>Shop now</a>
                            </div>


                            <img className='flex ' src={promo2} alt="" />

                        </div>



                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;