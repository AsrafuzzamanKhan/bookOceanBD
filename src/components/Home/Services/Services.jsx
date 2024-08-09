import { useEffect, useState } from "react";
import './services.css'

import serviceImg from '../../../assets/service/category.jpg'
import FadeIn from "../../../Animation/FadeIn";
const Services = () => {
    const [services, setServices] = useState([])
    useEffect(() => {
        fetch('services.json')
            .then(res => res.json())
            .then(data => {

                setServices(data)
            })
    }, [])
    return (
        <div className="bg-gray-200 py-10 my-10 background-image hidden md:block"
            style={{
                backgroundImage: `${serviceImg}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'cover'

            }}
        >
            <div className=" container mx-auto px-[2vw] lg:px-0">

                <div className=" grid md:grid-cols-3 xl:grid-cols-5 grid-cols-2 gap-4 lg:my-6 my-2 w-full">
                    {services.map(service =>
                        <FadeIn delay={0.4} direction='down' key={service.id} >
                            <div className="h-36 shadow-md bg-white rounded-[4px] flex justify-center lg:py-4 py-2 border-0 text-black outline-none overflow-y-auto" >
                                <div className="flex flex-col px-2">
                                    <h2 className="text-lg lg:text-xl lg:font-bold font-semibold text-center  mb-2 leading-none">{service.heading}</h2>
                                    <p className="lg:text-lg text-[16px] leading-snug ">{service.subHeading}</p>

                                </div>

                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;