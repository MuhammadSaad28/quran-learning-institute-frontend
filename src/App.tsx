import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { FAQ } from './pages/FAQ';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminDemoRequests } from './pages/admin/DemoRequests';
import { AdminStudents } from './pages/admin/Students';
import { AdminCourses } from './pages/admin/Courses';
import { AdminSettings } from './pages/admin/Settings';
import { StudentDashboard } from './pages/student/Dashboard';
import { StudentProfile } from './pages/student/Profile';
import { StudentSchedule } from './pages/student/Schedule';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/courses" element={<Layout><Courses /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><Layout hideFooter><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/demo-requests" element={<ProtectedRoute role="admin"><Layout hideFooter><AdminDemoRequests /></Layout></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><Layout hideFooter><AdminStudents /></Layout></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute role="admin"><Layout hideFooter><AdminCourses /></Layout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Layout hideFooter><AdminSettings /></Layout></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><Layout hideFooter><StudentDashboard /></Layout></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><Layout hideFooter><StudentProfile /></Layout></ProtectedRoute>} />
        <Route path="/student/schedule" element={<ProtectedRoute role="student"><Layout hideFooter><StudentSchedule /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
