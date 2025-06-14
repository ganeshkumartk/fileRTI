import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#composer", label: "Composer" },
    { href: "#templates", label: "Templates" },
    { href: "/help", label: "Help" }
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white">
                    <path
                      fill="currentColor"
                      d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z"
                      opacity="0.3"
                    />
                    <path
                      fill="currentColor"
                      d="M8 6h8v1H8V6zm0 3h8v1H8V9zm0 3h6v1H8v-1z"
                    />
                    <circle cx="15" cy="16" r="1.5" fill="currentColor" opacity="0.8"/>
                    <path
                      fill="currentColor"
                      d="M12 17h4v1h-4v-1z"
                      opacity="0.6"
                    />
                  </svg>
                </div>
                <div className="text-base sm:text-lg font-medium text-gray-900 tracking-tight">FileRTI</div>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-gray-50/80"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-gray-50/80"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-xl rounded-b-2xl overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div 
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
                  >
                    {item.href.startsWith('#') ? (
                      <a
                        href={item.href}
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 text-sm font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 text-sm font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 