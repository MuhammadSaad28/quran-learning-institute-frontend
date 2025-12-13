import { LayoutDashboard, Users, BookOpen, Calendar, Settings, UserPlus, CalendarCheck } from 'lucide-react';
import { ResponsiveSidebar } from '../ui/ResponsiveSidebar';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/demo-requests', icon: Calendar, label: 'Demo Requests' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/add-student', icon: UserPlus, label: 'Add Student' },
  { to: '/admin/schedules', icon: CalendarCheck, label: 'Schedules' },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminSidebar = () => <ResponsiveSidebar menuItems={menuItems} title="Admin Panel" />;
