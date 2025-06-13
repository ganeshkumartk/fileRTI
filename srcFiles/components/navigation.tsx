import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Logo from "./logo";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-slate-950/70"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/85 to-slate-950/90"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-8 lg:px-12 relative z-10">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Logo size="medium" />
            <div className="space-y-1">
              <div className="text-2xl font-light text-white tracking-wide">FileRTI</div>
              <div className="text-xs text-gray-400 font-light tracking-widest uppercase">Transparency Redefined</div>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              <motion.a 
                href="#composer" 
                className="text-gray-300 hover:text-white transition-all duration-300 font-light text-sm tracking-wide relative group"
                whileHover={{ y: -1 }}
              >
                Composer
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#templates" 
                className="text-gray-300 hover:text-white transition-all duration-300 font-light text-sm tracking-wide relative group"
                whileHover={{ y: -1 }}
              >
                Templates
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#help" 
                className="text-gray-300 hover:text-white transition-all duration-300 font-light text-sm tracking-wide relative group"
                whileHover={{ y: -1 }}
              >
                Help
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
            </div>
            
            <div className="flex items-center space-x-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-700/50">
              <span className="text-xs text-gray-400 font-light tracking-wider">हिंदी</span>
              <motion.button 
                onClick={() => setIsHindi(!isHindi)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-500 border",
                  isHindi ? "bg-gradient-to-r from-primary-500 to-purple-500 border-primary-400/50" : "bg-gray-700 border-gray-600"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg"
                  animate={{ x: isHindi ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 700, damping: 40 }}
                />
              </motion.button>
              <span className="text-xs text-gray-400 font-light tracking-wider">EN</span>
            </div>
          </div>
          
          <motion.button 
            className="md:hidden text-gray-300 hover:text-white transition-all duration-300 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </motion.button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:hidden border-t border-white/10 mt-6 pt-6"
          >
            <div className="space-y-6">
              <motion.a 
                href="#composer" 
                className="block text-gray-300 hover:text-white transition-all duration-300 font-light text-lg tracking-wide relative group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Composer
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-1/3 transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#templates" 
                className="block text-gray-300 hover:text-white transition-all duration-300 font-light text-lg tracking-wide relative group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Templates
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-1/3 transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#help" 
                className="block text-gray-300 hover:text-white transition-all duration-300 font-light text-lg tracking-wide relative group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Help
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 group-hover:w-1/3 transition-all duration-300"></div>
              </motion.a>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/50">
                  <span className="text-xs text-gray-400 font-light tracking-wider">Language</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400 font-light">हिंदी</span>
                    <motion.button 
                      onClick={() => setIsHindi(!isHindi)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-all duration-500 border",
                        isHindi ? "bg-gradient-to-r from-primary-500 to-purple-500 border-primary-400/50" : "bg-gray-700 border-gray-600"
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="w-3 h-3 bg-white rounded-full absolute top-1 shadow-lg"
                        animate={{ x: isHindi ? 24 : 4 }}
                        transition={{ type: "spring", stiffness: 700, damping: 40 }}
                      />
                    </motion.button>
                    <span className="text-xs text-gray-400 font-light">EN</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
