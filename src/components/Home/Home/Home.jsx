import Hero from "../Hero/Hero";
import LatestBook from "../LatestBook/LatestBook";
import Services from "../Services/Services";
import Trending from "../Trending/Trending";


const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <Services></Services>
            <LatestBook></LatestBook>
            <Trending></Trending>
        </div>
    );
};

export default Home;