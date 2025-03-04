import React from 'react'
import Counter from "../../../Counter/Counter";

import Hero from "../Hero/Hero";
import LatestBook from "../LatestBook/LatestBook";
import Services from "../Services/Services";
import Trending from "../Trending/Trending";
import RamadanSpecial from '../RamadanSpecial/RamdanSpecial';


const Home = () => {
    return (
        <>
            <React.Suspense fallback={
                <span className="loading loading-bars loading-lg"></span>
            }><Hero />
            </React.Suspense>

            <Services></Services>
            <Counter />
            <RamadanSpecial />
            <Trending></Trending>
            <LatestBook></LatestBook>


        </>
    );
};

export default Home;