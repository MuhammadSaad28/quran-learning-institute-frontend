import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Trash2 } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import type { Course } from '../../types';

export const AdminAddStudent = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    courseId: '',
    notes: '',
    weeklySchedule: [{ day: 'Monday', time: '10:00' }],
  });

  useEffect(() => {
    api.get('/courses').then(({ data }) => setCourses(data));
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addScheduleSlot = () => {
    setForm({ ...form, weeklySchedule: [...form.weeklySchedule, { day: 'Monday', time: '10:00' }] });
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'time', value: string) => {
    const newSchedule = [...form.weeklySchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setForm({ ...form, weeklySchedule: newSchedule });
  };

  const removeScheduleSlot = (index: number) => {
    setForm({ ...form, weeklySchedule: form.weeklySchedule.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.courseId) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/students', form);
      toast.success('Student created! Credentials sent via email.');
      navigate('/admin/students');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-primary-500" />
              Add New Student
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create a student account directly without demo request</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Student name" required />
              <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@email.com" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1234567890" />
              <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Course *</label>
                <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="input" required>
                  <option value="">Select a course</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              <Input label="Timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} placeholder="UTC" />
            </div>

            <div>
              <label className="label">Weekly Schedule</label>
              {form.weeklySchedule.map((slot, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select value={slot.day} onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)} className="input flex-1">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="time" value={slot.time} onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)} className="input w-32" />
                  {form.weeklySchedule.length > 1 && (
                    <button type="button" onClick={() => removeScheduleSlot(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addScheduleSlot} className="text-primary-500 text-sm font-medium">+ Add another slot</button>
            </div>

            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about the student..." />

            <Button type="submit" loading={loading} className="w-full">Create Student Account</Button>
          </form>
        </div>
      </main>
    </div>
  );
};
