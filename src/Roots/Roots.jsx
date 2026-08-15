import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../components/Shared/Header/Header";
import Footer from "../components/Shared/Footer/Footer";
import VerifyEmailBanner from "../components/Shared/VerifyEmailBanner/VerifyEmailBanner";
import { Helmet } from "react-helmet";


const Roots = () => {
    const location = useLocation()

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup')

    return (
        <div>
            <Helmet>
                <title>Buy Original Books Online in Bangladesh | Book Ocean BD</title>
                <meta name="description" content="Shop authentic books from various genres at Book Ocean BD. Nationwide delivery, pre-ordering available. Enjoy original print editions at competitive prices. Order now!" />
            </Helmet>
            {noHeaderFooter || <Header></Header>}
            <ScrollRestoration />
            <Outlet></Outlet>
            {noHeaderFooter || <Footer />}
            <VerifyEmailBanner />
        </div>
    );
};

export default Roots;