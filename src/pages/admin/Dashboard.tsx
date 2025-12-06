import { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { CardSkeleton } from '../../components/ui/Skeleton';
import api from '../../lib/axios';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  pendingDemos: number;
  todayClasses: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDemos, setRecentDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, demosRes] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
          api.get('/demo-requests'),
        ]);
        setStats({
          totalStudents: studentsRes.data.length,
          totalCourses: coursesRes.data.length,
          pendingDemos: demosRes.data.filter((d: any) => d.status === 'pending').length,
          todayClasses: 0,
        });
        setRecentDemos(demosRes.data.slice(0, 5));
      } catch {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Students', value: stats?.totalStudents || 0, color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Active Courses', value: stats?.totalCourses || 0, color: 'bg-green-500' },
    { icon: Calendar, label: 'Pending Demos', value: stats?.pendingDemos || 0, color: 'bg-yellow-500' },
    { icon: Clock, label: "Today's Classes", value: stats?.todayClasses || 0, color: 'bg-purple-500' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Demo Requests</h2>
                  <a href="/admin/demo-requests" className="text-primary-500 hover:text-primary-600 text-sm font-medium">View All</a>
                </div>
                {recentDemos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No demo requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentDemos.map((demo) => (
                      <div key={demo._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{demo.name}</p>
                          <p className="text-sm text-gray-500">{demo.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          demo.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          demo.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {demo.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/admin/demo-requests" className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                    <Calendar className="w-8 h-8 text-primary-500 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">Manage Demos</p>
                  </a>
                  <a href="/admin/students" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Users className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">View Students</p>
                  </a>
                  <a href="/admin/courses" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">Manage Courses</p>
                  </a>
                  <a href="/admin/settings" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
