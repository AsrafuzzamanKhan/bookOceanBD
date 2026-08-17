import ScrollTrigger from "react-scroll-trigger";
import useBookData from "../hooks/useBookData"
import CountUp from 'react-countup';
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const Counter = () => {
    const [booksData, ,] = useBookData()
    const [counterOnScroll, setCounterOnScroll] = useState(false)
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    const uniqueAuthors = [...new Set(booksData.map(item => item.author))];

    const stats = [
        { label: 'Categories', value: uniqueCategories.length },
        { label: 'Authors', value: uniqueAuthors.length },
        { label: 'Books', value: booksData.length },
    ];

    return (
        <section className="container mx-auto pb-10 px-4 lg:px-0">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4 px-6 py-8 md:py-10">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                            Explore Our Full Collection
                        </h1>
                        <p className="text-blue-100 mt-2 mb-4 text-sm md:text-base">
                            Thousands of original, verified titles across every genre.
                        </p>
                        <Link
                            to='/books'
                            className="inline-flex justify-center items-center gap-2 text-sm font-semibold bg-white text-blue-600 hover:bg-blue-50 rounded-full px-5 py-2.5 duration-200"
                        >
                            View All Books <FiArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="flex-1 w-full">
                        <ScrollTrigger onEnter={() => setCounterOnScroll(true)} onExit={() => setCounterOnScroll(false)}>
                            <div className="grid grid-cols-3 gap-3 md:gap-4">
                                {stats.map(({ label, value }) => (
                                    <div key={label} className="flex flex-col items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl py-5 md:py-7">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                                            {counterOnScroll && <CountUp start={0} end={value} duration={2.75}></CountUp>}+
                                        </h2>
                                        <p className="text-xs md:text-sm font-medium text-blue-100">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollTrigger>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Counter
