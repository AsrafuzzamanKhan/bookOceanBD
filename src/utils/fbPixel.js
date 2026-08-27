// Thin wrapper around the Meta (Facebook) Pixel's global `fbq` function.
//
// The pixel script (index.html) only fires `init` + `PageView` on load now -
// every other standard event is fired here, at the moment it actually
// happens, so Meta's ad-optimization algorithm gets real signal instead of
// every visitor being counted as a Lead/Search/ViewContent on every page.
//
// Guarded because `window.fbq` may not exist yet (script still loading) or
// ever (ad blockers, privacy extensions) - a tracking call must never be
// able to break the app.
export const trackPixelEvent = (eventName, params) => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    try {
        window.fbq('track', eventName, params);
    } catch {
        // tracking must never break the app
    }
};
