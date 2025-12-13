import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, BookOpen, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-arabic text-xl font-bold text-primary-700 dark:text-primary-400">Quran Wisdom Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-gold-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={user?.role === 'admin' ? '/admin' : '/student'} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-500">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/courses"><Button size="sm">Book Demo</Button></Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-4">
          <div className="px-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500">
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t dark:border-gray-800 space-y-3">
              <div className="flex items-center gap-4">
                <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  {isDark ? <Sun className="w-5 h-5 text-gold-500" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link 
                    to={user?.role === 'admin' ? '/admin' : '/student'} 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard ({user?.name})</span>
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }} 
                    className="flex items-center gap-2 py-2 text-red-500 hover:text-red-600 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="ghost" size="sm">Login</Button></Link>
                  <Link to="/courses" onClick={() => setIsOpen(false)}><Button size="sm">Book Demo</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
