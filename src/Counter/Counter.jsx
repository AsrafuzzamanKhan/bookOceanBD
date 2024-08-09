import ScrollTrigger from "react-scroll-trigger";
import useBookData from "../hooks/useBookData"
import CountUp from 'react-countup';
import { useState } from "react";
const Counter = () => {
    const [booksData, ,] = useBookData()
    const [counterOnScroll, setCounterOnScroll] = useState(false)
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    const uniqueAuthors = [...new Set(booksData.map(item => item.author))];
    // console.log(uniqueCategories)
    return (
        <section className="container mx-auto pb-8 px-[2vw] md:px-0">
            <div className=" rounded bg-[#D0E1E7] text-black">
                <ScrollTrigger onEnter={() => setCounterOnScroll(true)} onExit={() => setCounterOnScroll(false)}>
                    <div className="grid grid-cols-3 text-center justify-items-center">

                        <div className="p-12 ">
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {
                                    counterOnScroll && <CountUp start={0} end={uniqueCategories.length} duration={2.75}></CountUp>
                                }+
                            </h1>
                            <p className="text-lg md:text-xl font-medium">Categories</p>
                        </div>
                        <div className="p-12">
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {
                                    counterOnScroll && <CountUp start={0} end={uniqueAuthors.length} duration={2.75}></CountUp>
                                }+
                            </h1>
                            <p className="text-lg md:text-xl font-medium">Authors</p>
                        </div>
                        <div className="p-12">
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {
                                    counterOnScroll && <CountUp start={0} end={booksData.length} duration={2.75}></CountUp>
                                }+
                            </h1>
                            <p className="text-lg md:text-xl font-medium">Books</p>
                        </div>



                    </div>
                </ScrollTrigger>
            </div>
        </section>
    )
}

export default Counter