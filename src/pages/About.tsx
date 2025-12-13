import { BookOpen, Users, Globe, Award, Heart, Target } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Sincerity', desc: 'Teaching with pure intentions for the sake of Allah' },
  { icon: Target, title: 'Excellence', desc: 'Striving for the highest quality in education' },
  { icon: Users, title: 'Community', desc: 'Building a global family of Quran learners' },
];

export const About = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Hero */}
    <section className="bg-gradient-to-br from-primary-700 to-primary-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Institute</h1>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">Dedicated to spreading the light of Quranic knowledge across the globe through modern technology and traditional teaching methods.</p>
      </div>
    </section>

    {/* Mission */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              At Quran Wisdom Academy, we believe that every Muslim deserves access to quality Quranic education regardless of their location. Our mission is to make learning the Quran accessible, engaging, and effective for students of all ages and backgrounds.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We combine traditional Islamic teaching methodologies with modern technology to create an immersive learning experience that respects the sanctity of the Quran while making it accessible to the digital generation.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-primary-600">10,000+</p>
                <p className="text-gray-600 dark:text-gray-400">Students Taught</p>
              </div>
              <div className="bg-gold-50 dark:bg-gold-900/20 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-gold-600">50+</p>
                <p className="text-gray-600 dark:text-gray-400">Qualified Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary-900/30 dark:to-gold-900/30 rounded-3xl p-8">
            <div className="text-center">
              <BookOpen className="w-20 h-20 text-primary-600 mx-auto mb-4" />
              <p className="font-arabic text-2xl text-primary-700 dark:text-primary-400 mb-4">
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic">"Read in the name of your Lord who created" - Surah Al-Alaq (96:1)</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div><Globe className="w-10 h-10 mx-auto mb-2 text-gold-500" /><p className="text-3xl font-bold">20+</p><p className="text-gray-200">Countries</p></div>
          <div><Users className="w-10 h-10 mx-auto mb-2 text-gold-500" /><p className="text-3xl font-bold">10K+</p><p className="text-gray-200">Students</p></div>
          <div><BookOpen className="w-10 h-10 mx-auto mb-2 text-gold-500" /><p className="text-3xl font-bold">15+</p><p className="text-gray-200">Courses</p></div>
          <div><Award className="w-10 h-10 mx-auto mb-2 text-gold-500" /><p className="text-3xl font-bold">98%</p><p className="text-gray-200">Satisfaction</p></div>
        </div>
      </div>
    </section>
  </div>
);
