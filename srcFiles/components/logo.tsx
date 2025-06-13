import { motion } from "framer-motion";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizes = {
    small: "w-9 h-9",
    medium: "w-11 h-11", 
    large: "w-14 h-14"
  };

  return (
    <motion.div 
      className={`${sizes[size]} ${className} relative flex items-center justify-center`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg shadow-lg"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-blue-600/90 to-cyan-600/90 rounded-lg backdrop-blur-sm"></div>
      <div className="relative flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 32 32" className="w-6 h-6 text-white">
          <path
            fill="currentColor"
            d="M8 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6z"
            opacity="0.3"
          />
          <path
            fill="currentColor"
            d="M10 8h12v2H10V8zm0 4h12v2H10v-2zm0 4h8v2h-8v-2z"
          />
          <circle cx="21" cy="20" r="2" fill="currentColor" opacity="0.8"/>
          <path
            fill="currentColor"
            d="M16 22h6v2h-6v-2z"
            opacity="0.6"
          />
        </svg>
      </div>
    </motion.div>
  );
}