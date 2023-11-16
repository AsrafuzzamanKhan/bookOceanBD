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
                    <div className="bg-slate-300 rounded-[8px]">
                        <CategoryNav></CategoryNav>
                    </div>
                    {/* <div className=" w-full max-w-lg  lg:max-w-[734px] mx-auto  "> */}
                    {/* main slider  */}
                    {/* <div className="shadow-xl border  max-w-xl lg:max-w-3xl   mx-auto rounded-[8px]">
                            <MainSlider></MainSlider>
                        </div> */}


                    <div className='w-full max-w-lg  lg:max-w-[734px] mx-auto shadow-xl border'>
                        <MainSlider></MainSlider>
                    </div>

                    {/* promo part  */}
                    {/* <div className='flex flex-col gap-y-[20px] mx-auto w-full   max-w-lg  h-[500px] overflow-hidden '> */}
                    <div className='flex flex-col gap-y-[30px] w-full max-w-lg mx-auto h-[500px] overflow-hidden'>
                        <div className='flex h-[240px] w-full rounded-[8px]  p-6 bg-slate-300 justify-between'>
                            {/* text  */}
                            <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Book </div>
                                <a href="#" className='uppercase text-blue-400'>Shop now</a>
                            </div>


                            <img className='flex ' src={promo1} alt="" />

                        </div>
                        {/* promo 2  */}
                        <div className='flex  w-full h-[240px] rounded-[8px]  p-6 bg-slate-300 justify-between '>
                            {/* text  */}
                            <div className='flex flex-col max-w-[144px] h-full justify-center'>
                                <div className='text-[20px] uppercase font-medium leading-snug'>Save 30% all Book </div>
                                <a href="#" className='uppercase text-blue-400'>Shop now</a>
                            </div>


                            <img className='flex ' src={promo2} alt="" />

                        </div>
                    </div>

                    {/* </div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;