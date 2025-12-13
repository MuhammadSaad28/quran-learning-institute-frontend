import { useState } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import type { Course } from '../types';

const countries = [
  { value: 'US', label: 'United States' }, { value: 'UK', label: 'United Kingdom' }, { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }, { value: 'AE', label: 'UAE' }, { value: 'SA', label: 'Saudi Arabia' },
  { value: 'PK', label: 'Pakistan' }, { value: 'IN', label: 'India' }, { value: 'BD', label: 'Bangladesh' },
  { value: 'MY', label: 'Malaysia' }, { value: 'ID', label: 'Indonesia' }, { value: 'OTHER', label: 'Other' },
];

const timeSlots = [
  { value: '00:00', label: '12:00 AM' }, { value: '01:00', label: '1:00 AM' }, { value: '02:00', label: '2:00 AM' },
  { value: '03:00', label: '3:00 AM' }, { value: '04:00', label: '4:00 AM' }, { value: '05:00', label: '5:00 AM' },
  { value: '06:00', label: '6:00 AM' }, { value: '07:00', label: '7:00 AM' }, { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' }, { value: '10:00', label: '10:00 AM' }, { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' }, { value: '13:00', label: '1:00 PM' }, { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' }, { value: '16:00', label: '4:00 PM' }, { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' }, { value: '19:00', label: '7:00 PM' }, { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' }, { value: '22:00', label: '10:00 PM' }, { value: '23:00', label: '11:00 PM' },
];

interface Props {
  course: Course;
  onSuccess: () => void;
}

export const DemoBookingForm = ({ course, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '',
    preferredDate: '', preferredTime: '',
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.country || !form.preferredDate || !form.preferredTime) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const preferredSlotUser = `${form.preferredDate} at ${form.preferredTime} (${timezone})`;
      const preferredSlotUTC = new Date(`${form.preferredDate}T${form.preferredTime}:00`).toISOString();

      await api.post('/demo-requests', {
        ...form,
        timezone,
        preferredSlotUser,
        preferredSlotUTC,
        courseId: course._id,
      });

      toast.success('Demo request submitted successfully! We will contact you soon.');
      onSuccess();
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Selected Course:</p>
        <p className="font-semibold text-primary-700 dark:text-primary-400">{course.title}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" required />
        <Select label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} options={countries} required />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Timezone: <span className="font-medium">{timezone}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Preferred Date" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} min={new Date().toISOString().split('T')[0]} required />
        <Select label="Preferred Time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} options={timeSlots} required />
      </div>

      <Button type="submit" loading={loading} className="w-full">Submit Demo Request</Button>
    </form>
  );
};
