export default {
  plugins: {
    // Must run before tailwindcss - swiper 12's bundled CSS (swiper/css,
    // swiper/css/pagination, swiper/css/navigation) uses native CSS nesting
    // (e.g. "&.swiper-pagination-hidden { ... }"), which Tailwind's own
    // PostCSS plugin doesn't unwrap on its own. Without this, PostCSS just
    // warns and leaves those rules broken - Tailwind's docs call this out
    // directly: https://tailwindcss.com/docs/using-with-preprocessors#nesting
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
