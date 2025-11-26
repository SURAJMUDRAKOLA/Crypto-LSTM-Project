
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassmorphismCard = ({ children, className = "", hover = true }: GlassmorphismCardProps) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl 
        bg-white/10 dark:bg-white/5
        backdrop-blur-md border border-white/20 dark:border-white/10
        shadow-xl shadow-black/5 dark:shadow-black/20
        ${className}
      `}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.3)"
      } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphismCard;
