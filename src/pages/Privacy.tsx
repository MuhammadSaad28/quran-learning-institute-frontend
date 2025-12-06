import { Shield, Lock, Eye, Database, Mail, Globe } from 'lucide-react';

export const Privacy = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <section className="bg-gradient-to-br from-primary-700 to-primary-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Shield className="w-16 h-16 mx-auto mb-6 text-gold-500" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-200">Last updated: December 2024</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Country and timezone information</li>
              <li>Course preferences and learning progress</li>
              <li>Communication records with our team</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>To provide and improve our educational services</li>
              <li>To communicate with you about classes and schedules</li>
              <li>To send class reminders and important updates</li>
              <li>To respond to your inquiries and support requests</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Security</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest. We use industry-standard security protocols to ensure your information remains safe.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We may use third-party services for video conferencing (Zoom/Google Meet) and email communications. These services have their own privacy policies governing the use of your information.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about this Privacy Policy, please contact us at privacy@quranlearning.com
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
