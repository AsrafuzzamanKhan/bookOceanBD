import { FiSun, FiMoon, FiMonitor, FiCheck } from "react-icons/fi";
import useTheme from "../../../hooks/useTheme";

const OPTIONS = [
    { value: "light", label: "Light", icon: FiSun },
    { value: "dark", label: "Dark", icon: FiMoon },
    { value: "system", label: "System", icon: FiMonitor },
];

// Site-wide Light/Dark/System switch, next to the notification bell. Uses
// the same daisyUI dropdown pattern as the avatar menu and bell. The icon
// shown on the closed button reflects what's actually on screen right now
// (resolvedTheme), not the raw setting - so picking "System" on a dark OS
// shows the moon, not a generic monitor icon.
const ThemeToggle = () => {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const ClosedIcon = resolvedTheme === "dark" ? FiMoon : FiSun;

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label
                tabIndex={0}
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                aria-label="Change theme"
            >
                <ClosedIcon className="text-lg md:text-xl" />
            </label>

            <ul tabIndex={0} className="dropdown-content z-[1] mt-3 w-44 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-1.5">
                {OPTIONS.map(({ value, label, icon: Icon }) => (
                    <li key={value}>
                        <button
                            type="button"
                            onClick={() => setTheme(value)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 duration-150"
                        >
                            <Icon size={16} className="shrink-0" />
                            <span className="flex-1 text-left">{label}</span>
                            {theme === value && <FiCheck size={16} className="shrink-0 text-blue-500" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeToggle;
