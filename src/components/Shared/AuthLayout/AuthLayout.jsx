import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { HiCheckCircle } from "react-icons/hi";
import navlogo from "../../../assets/logo/navlogo.png";
import readingIllustration from "../../../assets/log.jpg";

const perks = [
    "10,000+ original, verified titles",
    "Nationwide home delivery",
    "100% secure checkout",
];

/**
 * Shared shell for /login and /signup: branded panel on the left (hidden on
 * small screens), form card on the right. `children` renders the page's own
 * form + social login + footer link.
 */
const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-10 sm:py-16">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-900/5 dark:shadow-black/40 ring-1 ring-gray-900/5 dark:ring-white/10 grid lg:grid-cols-2">

                {/* Brand panel */}
                <div className="hidden lg:flex relative flex-col justify-between bg-black p-10 xl:p-12">
                    <Link to="/" className="w-fit">
                        <img src={navlogo} alt="Book Ocean BD" className="h-8 w-auto" />
                    </Link>

                    <div className="flex justify-center py-6">
                        <div className="rounded-2xl bg-white p-4 shadow-2xl max-w-sm">
                            <img
                                src={readingIllustration}
                                alt="Person reading a book surrounded by shelves"
                                className="rounded-xl"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Bangladesh&rsquo;s trusted online bookstore
                        </h2>
                        <ul className="mt-4 space-y-2.5">
                            {perks.map((perk) => (
                                <li key={perk} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <HiCheckCircle className="shrink-0 text-blue-400" size={18} />
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                    <Link to="/" className="mb-8 w-fit lg:hidden">
                        <img src={navlogo} alt="Book Ocean BD" className="h-7 w-auto rounded-md" />
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                    )}

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    children: PropTypes.node,
};

export default AuthLayout;
