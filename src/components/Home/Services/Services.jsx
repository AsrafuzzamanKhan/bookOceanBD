import { useEffect, useState } from "react";
import './services.css'

import serviceImg from '../../../assets/service/category.webp'
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
        <div className="bg-gray-200 py-10 my-10 background-image "
            style={{
                backgroundImage: `${serviceImg}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'cover'

            }}
        >
            <div className="container mx-auto px-2 ">

                <div className=" grid md:grid-cols-3 xl:grid-cols-5 grid-cols-2 gap-4 my-12">
                    {services.map(service =>
                        <FadeIn delay={0.4} direction='down' key={service.id} >
                            <div className=" h-32 shadow-xl bg-white rounded-[8px] flex justify-center items-center text-black" >
                                <div className="flex flex-col px-2">
                                    <h2 className="lg:text-xl font-bold text-center text-lg">{service.heading}</h2>
                                    <p className="lg:text-lg text-xm ">{service.subHeading}</p>

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