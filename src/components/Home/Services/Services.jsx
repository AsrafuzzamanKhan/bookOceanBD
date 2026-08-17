import { useEffect, useState } from "react";
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
        <div className="bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {services.map((service, i) =>
                        <FadeIn delay={0.08 * i} direction='up' key={service.id} >
                            <div className="flex flex-col items-center text-center gap-2 h-full px-4 py-6 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                                    <img className="w-7 h-7 object-contain" src={service.image} alt="" loading="lazy" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{service.heading}</h2>
                                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">{service.subHeading}</p>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
