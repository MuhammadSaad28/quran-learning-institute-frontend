import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Award, Star, ChevronRight, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  { icon: BookOpen, title: 'Expert Teachers', desc: 'Learn from certified Quran teachers with years of experience' },
  { icon: Users, title: 'One-on-One Classes', desc: 'Personalized attention for effective learning' },
  { icon: Clock, title: 'Flexible Timing', desc: 'Schedule classes according to your convenience' },
  { icon: Award, title: 'Certified Courses', desc: 'Receive certificates upon course completion' },
];

const testimonials = [
  { name: 'Ahmed Khan', location: 'USA', text: 'The best online Quran learning experience. My children have improved tremendously.', rating: 5 },
  { name: 'Fatima Ali', location: 'UK', text: 'Excellent teachers and flexible scheduling. Highly recommended!', rating: 5 },
  { name: 'Omar Hassan', location: 'Canada', text: 'Professional and patient instructors. Great for beginners.', rating: 5 },
];

export const Home = () => (
  <div className="bg-islamic-pattern">
    {/* Hero Section */}
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-gold-500" />
              <span className="text-sm">Trusted by 10,000+ Students Worldwide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Begin Your Journey of <span className="text-gold-500">Quranic</span> Enlightenment
            </h1>
            <p className="text-xl text-gray-200">
              Learn to read, understand, and memorize the Holy Quran with expert teachers from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses"><Button variant="gold" size="lg">Book Free Demo <ChevronRight className="w-5 h-5" /></Button></Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-700">
                <Play className="w-5 h-5" /> Watch Video
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div><p className="text-3xl font-bold text-gold-500">10K+</p><p className="text-gray-300">Students</p></div>
              <div><p className="text-3xl font-bold text-gold-500">50+</p><p className="text-gray-300">Teachers</p></div>
              <div><p className="text-3xl font-bold text-gold-500">20+</p><p className="text-gray-300">Countries</p></div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-full absolute -top-10 -right-10 blur-3xl" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <p className="font-arabic text-4xl text-center text-gold-500 leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-center text-white mt-4">In the name of Allah, the Most Gracious, the Most Merciful</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We provide the best online Quran learning experience with qualified teachers and modern teaching methods.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="card p-6 text-center group hover:border-gold-500 border-2 border-transparent transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-r from-gold-500 to-gold-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Free Trial Today</h2>
        <p className="text-white/90 text-lg mb-8">Experience our teaching methodology with a complimentary demo class. No commitment required.</p>
        <Link to="/courses"><Button variant="primary" size="lg">Book Your Free Demo Now</Button></Link>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Students Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-5 h-5 text-gold-500 fill-gold-500" />)}</div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">{t.name[0]}</div>
                <div><p className="font-semibold text-gray-900 dark:text-white">{t.name}</p><p className="text-sm text-gray-500">{t.location}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
