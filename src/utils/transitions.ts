import { Variants } from "framer-motion";

export const grid_trans = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.5,
            duration: 0.3
        }
    }
};

export const grid_item_trans = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const anim = (variants: Variants) => {
    return {
        initial: "hidden",
        animate: "visible",
        // exit: "exit",
        variants,
    };
};