import { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Shared input for the Login / SignUp forms - leading icon, optional trailing
 * slot (e.g. the show/hide password button), consistent focus + error states.
 * Forwards its ref to the underlying <input> so both plain refs (Login) and
 * react-hook-form's register() (SignUp) work unchanged.
 */
const AuthInput = forwardRef(({ icon: Icon, error, rightElement, className = "", ...rest }, ref) => {
    return (
        <div className="relative">
            {Icon && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon size={18} />
                </span>
            )}
            <input
                ref={ref}
                className={`h-12 w-full rounded-xl border bg-gray-50 dark:bg-gray-700/40 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${error ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"}
                    ${Icon ? "pl-11" : "pl-4"}
                    ${rightElement ? "pr-11" : "pr-4"}
                    ${className}`}
                {...rest}
            />
            {rightElement && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
            )}
        </div>
    );
});

AuthInput.displayName = "AuthInput";

AuthInput.propTypes = {
    icon: PropTypes.elementType,
    error: PropTypes.bool,
    rightElement: PropTypes.node,
    className: PropTypes.string,
};

export default AuthInput;
