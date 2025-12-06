import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, Video, ChevronRight, RefreshCw } from 'lucide-react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { useAuthStore } from '../../store/authStore';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import type { Student, ClassSchedule } from '../../types';

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [nextClass, setNextClass] = useState<ClassSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: students } = await api.get('/students/me');
        setStudentData(students);
        
        const { data: schedules } = await api.get('/schedules/upcoming');
        if (schedules.length > 0) {
          setNextClass(schedules[0]);
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!nextClass) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const classTime = new Date(nextClass.dateTimeUTC).getTime();
      const diff = classTime - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextClass]);

  const generateSchedules = async () => {
    setGenerating(true);
    try {
      await api.post('/students/me/generate-schedules');
      toast.success('Class schedules generated!');
      // Refresh data
      const { data: schedules } = await api.get('/schedules/upcoming');
      if (schedules.length > 0) {
        setNextClass(schedules[0]);
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <StudentSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assalamu Alaikum, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome to your learning dashboard</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* Next Class Countdown */}
            {!nextClass && (studentData?.weeklySchedule?.length ?? 0) > 0 && (
              <div className="card p-6 mb-8 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">No Upcoming Classes</h2>
                    <p className="text-gold-100 mt-1">Generate your class schedule based on your weekly slots</p>
                  </div>
                  <Button onClick={generateSchedules} loading={generating} variant="primary">
                    <RefreshCw className="w-4 h-4" /> Generate Schedule
                  </Button>
                </div>
              </div>
            )}
            {nextClass && (
              <div className="card p-6 mb-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-primary-100 mb-1">Next Class</p>
                    <h2 className="text-2xl font-bold">{studentData?.courseId?.title || 'Your Course'}</h2>
                    <p className="text-primary-100 mt-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(nextClass.dateTimeUTC).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {[
                      { label: 'Days', value: countdown.days },
                      { label: 'Hours', value: countdown.hours },
                      { label: 'Minutes', value: countdown.minutes },
                      { label: 'Seconds', value: countdown.seconds },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold">{item.value.toString().padStart(2, '0')}</span>
                        </div>
                        <p className="text-xs mt-1 text-primary-100">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {nextClass.meetingLink && (
                  <a
                    href={nextClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
                  >
                    <Video className="w-5 h-5" /> Join Class
                  </a>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course Info */}
              <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Course</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{studentData?.courseId?.title || 'N/A'}</p>
                  </div>
                </div>
                <a href="/student/schedule" className="text-primary-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  View Schedule <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Weekly Schedule */}
              <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weekly Classes</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{studentData?.weeklySchedule?.length || 0} sessions/week</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {studentData?.weeklySchedule?.slice(0, 3).map((s, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-400">{s.day} at {s.time}</p>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Learning Since</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {studentData?.startDate ? new Date(studentData.startDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Islamic Quote */}
            <div className="mt-8 card p-6 bg-gradient-to-r from-gold-50 to-primary-50 dark:from-gold-900/20 dark:to-primary-900/20">
              <p className="font-arabic text-2xl text-center text-primary-700 dark:text-primary-400 mb-2">
                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 italic">
                "The best among you are those who learn the Quran and teach it." - Prophet Muhammad ﷺ
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
