import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Shared/Header/Header";
import Footer from "../components/Shared/Footer/Footer";


const Roots = () => {
    const location = useLocation()

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup')
    return (
        <div>
            {noHeaderFooter || <Header></Header>}

            <Outlet></Outlet>
            {noHeaderFooter || <Footer />}
        </div>
    );
};

export default Roots;