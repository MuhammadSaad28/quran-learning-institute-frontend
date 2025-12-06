import { FileText, CheckCircle, XCircle, AlertTriangle, CreditCard } from 'lucide-react';

export const Terms = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <section className="bg-gradient-to-br from-primary-700 to-primary-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <FileText className="w-16 h-16 mx-auto mb-6 text-gold-500" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-200">Last updated: December 2024</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing and using our Quran Learning Institute services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services Provided</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Online Quran reading and recitation classes</li>
              <li>Tajweed (proper pronunciation) instruction</li>
              <li>Quran memorization (Hifz) programs</li>
              <li>Islamic studies and Arabic language courses</li>
              <li>One-on-one personalized learning sessions</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Terms</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Monthly fees are due at the beginning of each month</li>
              <li>Free demo classes are provided without obligation</li>
              <li>Refunds are available within 7 days of enrollment</li>
              <li>Class packages are non-transferable</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Responsibilities</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Attend scheduled classes on time</li>
              <li>Notify us at least 24 hours in advance for cancellations</li>
              <li>Maintain a respectful learning environment</li>
              <li>Complete assigned homework and practice regularly</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cancellation Policy</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Classes cancelled with less than 24 hours notice may be forfeited. We reserve the right to reschedule classes due to unforeseen circumstances. Students will be notified promptly of any changes.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
