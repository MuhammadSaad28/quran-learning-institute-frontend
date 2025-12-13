import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-primary-700 dark:bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-arabic text-xl font-bold">Quran Wisdom Academy</span>
          </div>
          <p className="text-gray-300 text-sm">Illuminating hearts with divine knowledge through authentic Quranic education.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold-500 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-gold-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-gold-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-gold-500 transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4 text-gold-500">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4 text-gold-500">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4 text-gold-500">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4" /> quranwisdomacademy5@gmail.com</li>
            <li className="flex items-center gap-2 text-gray-300"><Phone className="w-4 h-4" /> +92 334 731 8922</li>
            <li className="flex items-center gap-2 text-gray-300"><MapPin className="w-4 h-4" /> Online Worldwide</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-primary-600 dark:border-gray-800 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Quran Wisdom Academy. All rights reserved.</p>
        <p className="mt-2 font-arabic text-gold-500">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      </div>
    </div>
  </footer>
);
