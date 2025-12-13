import { LayoutDashboard, User, Calendar } from 'lucide-react';
import { ResponsiveSidebar } from '../ui/ResponsiveSidebar';

const menuItems = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/schedule', icon: Calendar, label: 'My Schedule' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

export const StudentSidebar = () => <ResponsiveSidebar menuItems={menuItems} title="Student Portal" />;
