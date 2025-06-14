"use client"

import { Navigation, Footer } from "@/components/core"
import { motion } from "framer-motion"

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
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
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using FileRTI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              FileRTI is a platform that assists users in creating and filing Right to Information (RTI) applications in India. Our AI-powered composer helps generate compliant RTI applications based on user input.
            </p>

            <h2>3. User Responsibilities</h2>
            <p>Users are responsible for:</p>
            <ul>
              <li>Providing accurate and truthful information</li>
              <li>Ensuring RTI applications comply with applicable laws</li>
              <li>Respecting the RTI Act and its provisions</li>
              <li>Not using the service for illegal purposes</li>
              <li>Maintaining the confidentiality of their account</li>
            </ul>

            <h2>4. Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any local, state, national, or international law</li>
              <li>To impersonate or attempt to impersonate the company or employees</li>
              <li>To harass, abuse, insult, harm, or defame any person</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2>5. Intellectual Property Rights</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of FileRTI and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>

            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The information on this platform is provided on an "as is" basis. FileRTI disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              FileRTI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, even if we have been advised of the possibility of such damages.
            </p>

            <h2>8. Legal Compliance</h2>
            <p>
              Users are solely responsible for ensuring their RTI applications comply with the RTI Act 2005 and all applicable laws. FileRTI provides tools to assist but does not guarantee legal compliance.
            </p>

            <h2>9. Account Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including breach of the Terms.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at legal@filerti.com or through our contact page.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 