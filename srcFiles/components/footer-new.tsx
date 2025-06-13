
import { motion } from "framer-motion";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 relative">
      <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12 relative">
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Logo size="medium" />
              <div>
                <div className="text-lg font-medium text-gray-900">FileRTI</div>
                <div className="text-xs text-gray-500 font-light uppercase tracking-wider">Transparency Redefined</div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-gray-600 text-sm leading-relaxed max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Empowering citizens to file RTI applications with intelligent assistance.
            </motion.p>
          </div>

          {/* Platform Links */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-gray-900 font-medium mb-4 text-sm">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#composer" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  AI Composer
                </a>
              </li>
              <li>
                <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Voice Input
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Compliance
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-gray-900 font-medium mb-4 text-sm">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Directory
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 InfoClaim. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Terms
            </a>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>System operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
