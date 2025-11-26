
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
}

const GradientButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "default",
  className = "",
  disabled = false
}: GradientButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
    secondary: "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700",
    success: "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600",
    danger: "bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 hover:from-red-500 hover:via-rose-600 hover:to-pink-600"
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="relative"
    >
      <Button
        onClick={onClick}
        size={size}
        disabled={disabled}
        className={`
          relative overflow-hidden text-white border-0 font-semibold
          ${variants[variant]}
          ${className}
        `}
      >
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10">{children}</span>
      </Button>
      {!disabled && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-20 blur-sm"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default GradientButton;
