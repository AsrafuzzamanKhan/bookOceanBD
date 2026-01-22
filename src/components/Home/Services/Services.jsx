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
                setServices(data);
            })
    }, [])

    return (
        <div className="bg-gray-200 py-10 my-10 background-image hidden lg:block"
            style={{
                backgroundImage: `${serviceImg}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'cover'

            }}
        >
            <div className="container mx-auto px-[2vw] lg:px-0">

                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {services.map(service =>
                        <FadeIn delay={0.4} direction='down' key={service.id} >

                            <div className="w-full gap-4 bg-white items-center h-[9rem] px-2 rounded">
                                <div className="w-8 flex items-center justify-center mx-auto">
                                    <img className="w-full m-2" src={service.image} alt="image" />
                                </div>
                                <div className=" text-black">
                                    <h2 className="text-md xl:text-lg font-semibold text-blue-400">{service.heading}</h2>
                                    <p className="xl:text-md lg:text-sm leading-5">{service.subHeading}</p>
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