import { useEffect, useState } from 'react';
import { Calendar, Clock, Video, ChevronLeft, ChevronRight, List, Grid } from 'lucide-react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import api from '../../lib/axios';
import type { ClassSchedule, Student } from '../../types';

type ViewMode = 'month' | 'week' | 'list';

export const StudentSchedule = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, studentRes] = await Promise.all([
          api.get('/schedules/my'),
          api.get('/students/me'),
        ]);
        setSchedules(schedulesRes.data);
        setStudentData(studentRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((s) => {
      const scheduleDate = new Date(s.dateTimeUTC);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else {
      newDate.setDate(currentDate.getDate() + direction * 7);
    }
    setCurrentDate(newDate);
  };

  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const upcomingClasses = schedules
    .filter(s => new Date(s.dateTimeUTC) > today && s.status === 'scheduled')
    .sort((a, b) => new Date(a.dateTimeUTC).getTime() - new Date(b.dateTimeUTC).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">View your class schedule and upcoming sessions</p>
          </div>
          <div className="flex gap-2">
            {(['month', 'week', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  viewMode === mode ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {mode === 'list' ? <List className="w-4 h-4" /> : mode === 'week' ? <Grid className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {viewMode === 'week' 
                      ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
                      : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg">
                      Today
                    </button>
                    <button onClick={() => navigate(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {viewMode === 'list' ? (
                  /* List View */
                  <div className="space-y-3">
                    {schedules.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No scheduled classes</p>
                    ) : (
                      schedules
                        .sort((a, b) => new Date(a.dateTimeUTC).getTime() - new Date(b.dateTimeUTC).getTime())
                        .map((schedule) => (
                          <div key={schedule._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Date(schedule.dateTimeUTC).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(schedule.dateTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                                {schedule.status}
                              </span>
                              {schedule.meetingLink && schedule.status === 'scheduled' && (
                                <a href={schedule.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm"><Video className="w-4 h-4" /> Join</Button>
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                ) : viewMode === 'week' ? (
                  /* Week View */
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">{day}</div>
                    ))}
                    {getWeekDays(currentDate).map((date) => {
                      const daySchedules = getSchedulesForDate(date);
                      const isToday = date.toDateString() === today.toDateString();
                      return (
                        <div
                          key={date.toISOString()}
                          className={`min-h-[120px] p-2 border rounded-xl ${
                            isToday ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {daySchedules.map((s) => (
                              <div key={s._id} className={`text-xs p-2 rounded ${getStatusColor(s.status)}`}>
                                <p className="font-medium">{new Date(s.dateTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {s.meetingLink && s.status === 'scheduled' && (
                                  <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Join
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Month View */
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">{day}</div>
                    ))}
                    {getDaysInMonth(currentDate).map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                      const daySchedules = getSchedulesForDate(date);
                      const isToday = date.toDateString() === today.toDateString();
                      const isPast = date < today && !isToday;
                      return (
                        <div
                          key={date.toISOString()}
                          className={`aspect-square p-1 border rounded-lg ${
                            isToday ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700'
                          } ${isPast ? 'opacity-50' : ''}`}
                        >
                          <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">{date.getDate()}</div>
                          {daySchedules.slice(0, 2).map((s) => (
                            <div key={s._id} className={`text-xs p-1 rounded truncate mb-1 ${getStatusColor(s.status)}`}>
                              {new Date(s.dateTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          ))}
                          {daySchedules.length > 2 && (
                            <div className="text-xs text-gray-400">+{daySchedules.length - 2} more</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weekly Schedule */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" /> Weekly Schedule
                </h3>
                {studentData?.weeklySchedule?.length ? (
                  <div className="space-y-3">
                    {studentData.weeklySchedule.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="font-medium text-gray-900 dark:text-white">{s.day}</span>
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {s.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No schedule set</p>
                )}
              </div>

              {/* Upcoming Classes */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-500" /> Upcoming Classes
                </h3>
                {upcomingClasses.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingClasses.slice(0, 5).map((s) => (
                      <div key={s._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(s.dateTimeUTC).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(s.dateTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {s.meetingLink && (
                          <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600">
                            <Video className="w-4 h-4" /> Join
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming classes</p>
                )}
              </div>

              {/* Legend */}
              <div className="card p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Legend</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
