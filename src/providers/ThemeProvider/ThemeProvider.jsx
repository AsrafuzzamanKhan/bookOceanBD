import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "boc-theme";
const VALID_THEMES = ["light", "dark", "system"];

const getSystemTheme = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readStoredTheme = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return VALID_THEMES.includes(stored) ? stored : "system";
    } catch {
        return "system"; // localStorage can throw in private-browsing/storage-blocked contexts
    }
};

// Applies the resolved theme to <html> - mirrors the inline script in
// index.html that runs before React hydrates (see that file for why: without
// it, the page flashes the wrong theme for a moment on every load).
const applyTheme = (resolved) => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.setAttribute("data-theme", resolved); // daisyUI's own theme switch - see tailwind.config.js
};

// Site-wide Light / Dark / System theme. "system" keeps following the OS
// preference (including live changes while the tab stays open); "light" and
// "dark" are explicit overrides, persisted to localStorage so they survive
// reloads. This is what actually drives dark mode now - tailwind.config.js's
// darkMode was switched from "media" (OS-only, no override) to "class" so
// this provider is the single source of truth for both Tailwind's `dark:`
// utilities and daisyUI's own theme (data-theme attribute).
const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(readStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState(() =>
        theme === "system" ? getSystemTheme() : theme
    );

    const setTheme = useCallback((next) => {
        if (!VALID_THEMES.includes(next)) return;
        setThemeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore - the choice just won't persist across reloads
        }
    }, []);

    useEffect(() => {
        const resolved = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(resolved);
        applyTheme(resolved);

        if (theme !== "system") return undefined;

        // system mode - keep following the OS if it changes while the tab is open
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            const next = e.matches ? "dark" : "light";
            setResolvedTheme(next);
            applyTheme(next);
        };
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, [theme]);

    const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export default ThemeProvider;
