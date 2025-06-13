import { motion } from "framer-motion";
import { Scale, Twitter, Linkedin, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-soft flex items-center justify-center">
                <Scale className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">RTI Platform</span>
                <div className="text-xs text-gray-400 -mt-1">AI-Powered Legal Tech</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering Indian citizens with AI-powered tools to exercise their Right to Information effectively and efficiently.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-soft flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-soft flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-soft flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <div className="space-y-3">
              <a href="#composer" className="block hover:text-white transition-colors">RTI Composer</a>
              <a href="#" className="block hover:text-white transition-colors">Voice Input</a>
              <a href="#templates" className="block hover:text-white transition-colors">Templates</a>
              <a href="#" className="block hover:text-white transition-colors">Export Tools</a>
              <a href="#" className="block hover:text-white transition-colors">Multi-language</a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <div className="space-y-3">
              <a href="#" className="block hover:text-white transition-colors">RTI Act 2005 Guide</a>
              <a href="#" className="block hover:text-white transition-colors">Government Directories</a>
              <a href="#" className="block hover:text-white transition-colors">Sample Applications</a>
              <a href="#" className="block hover:text-white transition-colors">Video Tutorials</a>
              <a href="#" className="block hover:text-white transition-colors">FAQ</a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <div className="space-y-3">
              <a href="#" className="block hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block hover:text-white transition-colors">API Documentation</a>
            </div>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 RTI Platform. All rights reserved. Built for Indian citizens.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
            <span className="text-gray-500">Made with</span>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-400">in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
