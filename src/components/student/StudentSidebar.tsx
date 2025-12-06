import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/schedule', icon: Calendar, label: 'My Schedule' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

export const StudentSidebar = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};
