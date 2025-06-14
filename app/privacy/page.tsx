"use client"

import { Navigation, Footer } from "@/components/core"
import { motion } from "framer-motion"

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2025
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-8 prose prose-gray max-w-none"
          >
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, use our RTI composer, or contact us for support. This may include:
            </p>
            <ul>
              <li>Personal information (name, email address, phone number)</li>
              <li>RTI application details and documents</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our RTI filing services</li>
              <li>Generate AI-powered RTI applications</li>
              <li>Communicate with you about your applications</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience on our platform. You can control cookie preferences through your browser settings.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at privacy@filerti.com or through our contact page.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 