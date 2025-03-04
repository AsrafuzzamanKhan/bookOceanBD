import ScrollTrigger from "react-scroll-trigger";
import useBookData from "../hooks/useBookData"
import CountUp from 'react-countup';
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
const Counter = () => {
    const [booksData, ,] = useBookData()
    const [counterOnScroll, setCounterOnScroll] = useState(false)
    // Extract unique category types
    const uniqueCategories = [...new Set(booksData.map(item => item.category))];
    const uniqueAuthors = [...new Set(booksData.map(item => item.author))];
    // console.log(uniqueCategories)
    return (
        <section className="container mx-auto pb-8 px-[2vw] md:px-0">
            <div className=" rounded bg-[#b6cbd3] text-black">
                <div className="flex flex-col md:flex-row items-center gap-4 py-4 ">
                    <div className="flex-1 text-center ">
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold uppercase tracking-wider">
                            Available Books
                        </h1>

                        <div>
                            <Link to='/books' className="flex justify-center items-center text-lg hover:text-blue-800">View All Books <IoIosArrowRoundForward size={30} />
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ScrollTrigger onEnter={() => setCounterOnScroll(true)} onExit={() => setCounterOnScroll(false)}>
                            <div className="grid grid-cols-3 gap-4 text-center justify-items-center px-2">

                                <div className="w-24 h-24 md:w-[7rem]  lg:w-40 lg:h-32 flex flex-col items-center justify-center bg-white rounded-lg">
                                    <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
                                        {
                                            counterOnScroll && <CountUp start={0} end={uniqueCategories.length} duration={2.75}></CountUp>
                                        }+
                                    </h1>
                                    <p className="text-md  lg:text-2xl font-medium">Categories</p>
                                </div>
                                <div className="w-24 h-24 md:w-[7rem]  lg:w-40 lg:h-32 flex flex-col items-center justify-center bg-white rounded-lg">
                                    <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
                                        {
                                            counterOnScroll && <CountUp start={0} end={uniqueAuthors.length} duration={2.75}></CountUp>
                                        }+
                                    </h1>
                                    <p className="text-md  lg:text-2xl font-medium">Authors</p>
                                </div>
                                <div className="w-24 h-24 md:w-[7rem]   lg:w-40 lg:h-32 flex flex-col items-center justify-center bg-white rounded-lg">
                                    <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
                                        {
                                            counterOnScroll && <CountUp start={0} end={booksData.length} duration={2.75}></CountUp>
                                        }+
                                    </h1>
                                    <p className="text-md  lg:text-2xl font-medium">Books</p>
                                </div>



                            </div>
                        </ScrollTrigger>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Counter