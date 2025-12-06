import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How do I book a free demo class?', a: 'Simply visit our Courses page, select a course you\'re interested in, and click "Book Free Demo". Fill out the form with your details and preferred time slot, and our team will contact you to confirm.' },
  { q: 'What do I need for online classes?', a: 'You need a stable internet connection, a device with a camera and microphone (computer, tablet, or smartphone), and a quiet learning environment. We use Zoom or Google Meet for our classes.' },
  { q: 'What are the class timings?', a: 'We offer flexible scheduling to accommodate students from different time zones. Classes are available from 9 AM to 9 PM (your local time). You can choose slots that work best for you.' },
  { q: 'How long is each class session?', a: 'Standard class sessions are 30-45 minutes for children and 45-60 minutes for adults. The duration can be adjusted based on the student\'s age and attention span.' },
  { q: 'Do you provide female teachers?', a: 'Yes, we have both male and female qualified teachers. You can request a teacher of your preferred gender when enrolling.' },
  { q: 'What courses do you offer?', a: 'We offer Quran Reading (Noorani Qaida), Quran Recitation with Tajweed, Quran Memorization (Hifz), Islamic Studies, and Arabic Language courses for all levels.' },
  { q: 'How much do the courses cost?', a: 'Our pricing varies based on the course and number of classes per week. Please visit our Courses page for detailed pricing or contact us for a custom quote.' },
  { q: 'Can I reschedule a class?', a: 'Yes, you can reschedule classes with at least 24 hours notice. Simply contact your teacher or our support team to arrange a new time.' },
  { q: 'Do you provide certificates?', a: 'Yes, we provide completion certificates for all our courses. Students who complete the Hifz program receive a special Ijazah certificate.' },
  { q: 'What is your refund policy?', a: 'We offer a full refund within 7 days of enrollment if you\'re not satisfied with our services. After that, refunds are prorated based on classes attended.' },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-700 to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 text-gold-500" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">Find answers to common questions about our Quran learning programs.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
            <a href="/contact" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
