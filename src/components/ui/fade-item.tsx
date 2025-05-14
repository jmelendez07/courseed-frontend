import { motion } from "motion/react";

interface FadeItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

function FadeItem({ children, className, onClick }: FadeItemProps) {
    return (
        <motion.div
            initial={{ y: 48, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
            className={className}
            onClick={() => onClick && onClick()} 
        >
            {children}
        </motion.div>
    );
}

export default FadeItem;