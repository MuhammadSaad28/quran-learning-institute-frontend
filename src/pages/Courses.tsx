import { useEffect, useState } from 'react';
import { Clock, DollarSign, BookOpen, ChevronRight } from 'lucide-react';
import api from '../lib/axios';
import type { Course } from '../types';
import { Button } from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { DemoBookingForm } from '../components/DemoBookingForm';

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    api.get('/courses?active=true').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  }, []);

  const levelColors = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Choose from our comprehensive range of Quranic courses designed for all levels.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="card overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-20 h-20 text-white/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${course.price}/mo</span>
                  </div>
                  {course.features?.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {course.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-primary-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button onClick={() => setSelectedCourse(course)} className="w-full">Book Free Demo</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses available at the moment.</p>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title="Book Free Demo Class" size="lg">
        {selectedCourse && <DemoBookingForm course={selectedCourse} onSuccess={() => setSelectedCourse(null)} />}
      </Modal>
    </div>
  );
};
