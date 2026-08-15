import { motion, useReducedMotion } from "framer-motion";

// Fades content in (with an optional directional slide) once it scrolls into
// view. Uses framer-motion's built-in whileInView/viewport - simpler and
// actually correct, unlike the previous manual useInView + useAnimation +
// useEffect version, which had a bug where both branches of an if/else did
// the same thing, so it always animated on mount regardless of scroll
// position. viewport={{ once: true }} means it plays once, not every time
// the section scrolls in and out.
//
// Respects prefers-reduced-motion - skips the animation entirely for users
// who've asked their OS/browser for less motion.
const FadeIn = ({ children, delay = 0, direction }) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: direction === 'right' ? -40 : direction === 'left' ? 40 : 0,
                y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
