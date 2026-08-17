import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import PropTypes from 'prop-types';

// Consistent "title + optional subtitle + View all" header used above every
// book carousel on the Home page (Trending, LatestBook, RamadanSpecial) so
// the sections read as one system instead of each rolling its own heading.
const SectionHeader = ({ title, subtitle, viewAllTo }) => (
    <div className="flex items-end justify-between gap-4 mb-5">
        <div className="text-center xl:text-left w-full xl:w-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {viewAllTo && (
            <Link
                to={viewAllTo}
                className="hidden xl:inline-flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 shrink-0 whitespace-nowrap"
            >
                View all <FiArrowRight size={14} />
            </Link>
        )}
    </div>
);

SectionHeader.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    viewAllTo: PropTypes.string,
};

export default SectionHeader;
