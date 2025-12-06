import { useEffect, useState } from 'react';
import { Calendar, Clock, Mail, Phone, Globe, Check, X, UserPlus, ExternalLink } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import type { DemoRequest } from '../../types';

export const AdminDemoRequests = () => {
  const [demos, setDemos] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<DemoRequest | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [convertModal, setConvertModal] = useState(false);
  const [approveForm, setApproveForm] = useState({ finalDate: '', finalTime: '', meetingLink: '' });
  const [convertForm, setConvertForm] = useState({ schedule: [{ day: 'Monday', time: '10:00' }], notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const { data } = await api.get('/demo-requests');
      setDemos(data);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedDemo || !approveForm.finalDate || !approveForm.finalTime || !approveForm.meetingLink) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      const adminFinalSlotUTC = new Date(`${approveForm.finalDate}T${approveForm.finalTime}:00`).toISOString();
      await api.put(`/demo-requests/${selectedDemo._id}/approve`, {
        adminFinalSlotUTC,
        meetingLink: approveForm.meetingLink,
      });
      toast.success('Demo approved and email sent to student!');
      setApproveModal(false);
      setApproveForm({ finalDate: '', finalTime: '', meetingLink: '' });
      fetchDemos();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this demo request?')) return;
    try {
      await api.put(`/demo-requests/${id}/reject`);
      toast.success('Demo request rejected');
      fetchDemos();
    } catch {}
  };

  const handleConvert = async () => {
    if (!selectedDemo) return;
    setSubmitting(true);
    try {
      await api.post(`/demo-requests/${selectedDemo._id}/convert`, {
        weeklySchedule: convertForm.schedule,
        notes: convertForm.notes,
      });
      toast.success('Student account created and credentials sent!');
      setConvertModal(false);
      setConvertForm({ schedule: [{ day: 'Monday', time: '10:00' }], notes: '' });
      fetchDemos();
    } finally {
      setSubmitting(false);
    }
  };

  const addScheduleSlot = () => {
    setConvertForm({ ...convertForm, schedule: [...convertForm.schedule, { day: 'Monday', time: '10:00' }] });
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'time', value: string) => {
    const newSchedule = [...convertForm.schedule];
    newSchedule[index][field] = value;
    setConvertForm({ ...convertForm, schedule: newSchedule });
  };

  const removeScheduleSlot = (index: number) => {
    setConvertForm({ ...convertForm, schedule: convertForm.schedule.filter((_, i) => i !== index) });
  };

  const filteredDemos = filter === 'all' ? demos : demos.filter(d => d.status === filter);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Demo Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage demo class requests from potential students</p>
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'converted'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredDemos.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No demo requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDemos.map((demo) => (
              <div key={demo._id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{demo.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        demo.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        demo.status === 'approved' ? 'bg-green-100 text-green-700' :
                        demo.status === 'converted' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {demo.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {demo.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {demo.phone}</span>
                      <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {demo.country} ({demo.timezone})</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1 text-primary-600">
                        <Calendar className="w-4 h-4" /> Course: {typeof demo.courseId === 'object' ? demo.courseId.title : 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" /> Preferred: {demo.preferredSlotUser}
                      </span>
                    </div>
                    {demo.status === 'approved' && demo.meetingLink && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <ExternalLink className="w-4 h-4" />
                        <span>Meeting: {demo.meetingLink}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {demo.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => { setSelectedDemo(demo); setApproveModal(true); }}>
                          <Check className="w-4 h-4" /> Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(demo._id)}>
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </>
                    )}
                    {demo.status === 'approved' && (
                      <Button size="sm" variant="gold" onClick={() => { setSelectedDemo(demo); setConvertModal(true); }}>
                        <UserPlus className="w-4 h-4" /> Convert to Student
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approve Modal */}
        <Modal isOpen={approveModal} onClose={() => setApproveModal(false)} title="Approve Demo Request" size="md">
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">Student: <span className="font-medium">{selectedDemo?.name}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Preferred: <span className="font-medium">{selectedDemo?.preferredSlotUser}</span></p>
            </div>
            <Input label="Final Date" type="date" value={approveForm.finalDate} onChange={(e) => setApproveForm({ ...approveForm, finalDate: e.target.value })} required />
            <Input label="Final Time" type="time" value={approveForm.finalTime} onChange={(e) => setApproveForm({ ...approveForm, finalTime: e.target.value })} required />
            <Input label="Meeting Link (Zoom/Meet)" value={approveForm.meetingLink} onChange={(e) => setApproveForm({ ...approveForm, meetingLink: e.target.value })} placeholder="https://zoom.us/j/..." required />
            <Button onClick={handleApprove} loading={submitting} className="w-full">Approve & Send Email</Button>
          </div>
        </Modal>

        {/* Convert Modal */}
        <Modal isOpen={convertModal} onClose={() => setConvertModal(false)} title="Convert to Student" size="lg">
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">Student: <span className="font-medium">{selectedDemo?.name}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: <span className="font-medium">{selectedDemo?.email}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Course: <span className="font-medium">{typeof selectedDemo?.courseId === 'object' ? selectedDemo.courseId.title : 'N/A'}</span></p>
            </div>
            <div>
              <label className="label">Weekly Schedule</label>
              {convertForm.schedule.map((slot, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select value={slot.day} onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)} className="input flex-1">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="time" value={slot.time} onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)} className="input w-32" />
                  {convertForm.schedule.length > 1 && (
                    <button onClick={() => removeScheduleSlot(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addScheduleSlot} className="text-primary-500 text-sm font-medium">+ Add another slot</button>
            </div>
            <Input label="Notes (optional)" value={convertForm.notes} onChange={(e) => setConvertForm({ ...convertForm, notes: e.target.value })} placeholder="Any notes about the student..." />
            <Button onClick={handleConvert} loading={submitting} className="w-full">Create Student Account</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
};
