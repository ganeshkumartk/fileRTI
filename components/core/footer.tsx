import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative pb-6 sm:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 overflow-hidden"
        >
          {/* Main Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 gap-8 sm:gap-10">
              
              {/* Brand Section */}
              <div className="text-left">
                <motion.div 
                  className="flex items-center space-x-3 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
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
                  <div>
                    <div className="text-lg font-medium text-gray-900 tracking-tight">FileRTI</div>
                    <div className="text-xs text-gray-500 font-light uppercase tracking-wider">RTI Simplified</div>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-gray-600 text-sm leading-relaxed max-w-md mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Empowering citizens to file RTI applications with intelligent assistance.
                </motion.p>
              </div>

              {/* Links Section - 2 columns on mobile */}
              <motion.div 
                className="grid grid-cols-2 gap-8 sm:gap-12"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Platform Links */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-4 text-sm tracking-tight">Platform</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#composer" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        AI Composer
                      </a>
                    </li>
                    <li>
                      <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Templates
                      </a>
                    </li>
                    <li>
                      <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Voice Input
                      </Link>
                    </li>
                    <li>
                      <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Compliance
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-4 text-sm tracking-tight">Support</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Guidelines
                      </Link>
                    </li>
                    <li>
                      <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Resources
                      </Link>
                    </li>
                    <li>
                      <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Directory
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-gray-200/50 px-6 sm:px-8 py-6 bg-gray-50/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              <div className="text-gray-500 text-sm font-light text-center sm:text-left">
                © 2025 FileRTI. All rights reserved.
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center space-x-6">
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-light">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-light">
                    Terms
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-light text-xs">System operational</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
} 