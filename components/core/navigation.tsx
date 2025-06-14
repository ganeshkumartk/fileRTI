import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/core/logo";

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
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="small" />
              <div className="text-xl font-semibold text-gray-900">FileRTI</div>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                {item.href.startsWith('#') ? (
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.href}>
                    {item.href.startsWith('#') ? (
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 