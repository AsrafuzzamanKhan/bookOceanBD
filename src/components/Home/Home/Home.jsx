import Counter from "../../../Counter/Counter";
import Hero from "../Hero/Hero";
import LatestBook from "../LatestBook/LatestBook";
import Services from "../Services/Services";
import Trending from "../Trending/Trending";


const Home = () => {
    return (
        <>
            <Hero></Hero>
            <Services></Services>
            <Counter />
            <LatestBook></LatestBook>
            <Trending></Trending>
        </>
    );
};

export default Home;