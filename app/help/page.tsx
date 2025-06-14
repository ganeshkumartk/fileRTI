"use client"

import { Navigation, Footer } from "@/components/core"
import { motion } from "framer-motion"
import { Book, FileText, MessageCircle, Phone, Mail, ExternalLink } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <Navigation />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get help with filing RTI applications, understanding the process, and making the most of our platform.
            </p>
          </motion.div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Book className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">RTI Guidelines</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Learn about the Right to Information Act, your rights, and how to effectively file RTI applications.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Understanding RTI Act 2005
                </li>
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Who can file RTI applications
                </li>
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Fee structure and exemptions
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Platform Guide</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Learn how to use our AI-powered RTI composer and get the most out of our platform features.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Using the AI Composer
                </li>
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Expert Templates Guide
                </li>
                <li className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voice Input Features
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Need More Help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-3">Get instant help from our support team</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Start Chat</button>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">Send us your questions and we'll respond within 24 hours</p>
                <a href="mailto:support@filerti.com" className="text-green-600 hover:text-green-700 font-medium text-sm">
                  support@filerti.com
                </a>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-3">Call us for urgent assistance</p>
                <a href="tel:+911800123456" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  1800-123-456
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 