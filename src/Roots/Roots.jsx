import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../components/Shared/Header/Header";
import Footer from "../components/Shared/Footer/Footer";
import { Helmet } from "react-helmet-async";


const Roots = () => {
    const location = useLocation()

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup')
    return (
        <div>
            <Helmet>
                <title>Book Ocean BD || Home</title>
            </Helmet>
            {noHeaderFooter || <Header></Header>}
            <ScrollRestoration />
            <Outlet></Outlet>
            {noHeaderFooter || <Footer />}
        </div>
    );
};

export default Roots;