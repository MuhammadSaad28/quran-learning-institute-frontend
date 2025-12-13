import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { convertToTimezone } from '../../lib/timezone';

interface ClassSchedule {
  _id: string;
  studentId: { _id: string; userId: { name: string; email: string; timezone?: string } };
  courseId: { title: string };
  dateTimeUTC: string;
  dateTimeUser: string;
  status: 'scheduled' | 'completed' | 'absent' | 'cancelled';
  notes?: string;
}

export const AdminSchedules = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  const [statusForm, setStatusForm] = useState({ status: 'completed', notes: '', sendEmail: true });
  const [rescheduleForm, setRescheduleForm] = useState({ newDateTime: '', notes: '', sendEmail: true });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [adminTimezone, setAdminTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    fetchSchedules();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data?.adminTimezone) {
        setAdminTimezone(data.adminTimezone);
      }
    } catch {}
  };

  const fetchSchedules = async () => {
    try {
      const { data } = await api.get('/schedules');
      setSchedules(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const openStatusModal = (schedule: ClassSchedule, status: 'completed' | 'absent') => {
    setSelectedSchedule(schedule);
    setStatusForm({ status, notes: '', sendEmail: true });
    setStatusModal(true);
  };

  const openRescheduleModal = (schedule: ClassSchedule) => {
    setSelectedSchedule(schedule);
    const dt = new Date(schedule.dateTimeUTC);
    setRescheduleForm({
      newDateTime: dt.toISOString().slice(0, 16),
      notes: '',
      sendEmail: true,
    });
    setRescheduleModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedSchedule) return;
    setSubmitting(true);
    try {
      await api.put(`/schedules/${selectedSchedule._id}/status`, statusForm);
      toast.success(`Class marked as ${statusForm.status}`);
      setStatusModal(false);
      fetchSchedules();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSchedule || !rescheduleForm.newDateTime) return;
    setSubmitting(true);
    try {
      await api.put(`/schedules/${selectedSchedule._id}/reschedule`, {
        newDateTime: rescheduleForm.newDateTime,
        newDateTimeUser: new Date(rescheduleForm.newDateTime).toLocaleString(),
        notes: rescheduleForm.notes,
        sendEmail: rescheduleForm.sendEmail,
      });
      toast.success('Class rescheduled successfully');
      setRescheduleModal(false);
      fetchSchedules();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reschedule');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Class Schedules</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Manage student class schedules</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-full md:w-40">
            <option value="all">All Classes</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredSchedules.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No schedules found</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredSchedules.map((schedule) => (
                <div key={schedule._id} className="card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{schedule.studentId?.userId?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{schedule.courseId?.title || 'N/A'}</p>
                    </div>
                    {getStatusBadge(schedule.status)}
                  </div>
                  <div className="space-y-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{convertToTimezone(schedule.dateTimeUTC, adminTimezone)}</p>
                      <p className="text-xs text-gold-600">Student: {schedule.dateTimeUser}</p>
                    </div>
                  </div>
                  {schedule.status === 'scheduled' && (
                    <div className="flex gap-2 pt-3 border-t dark:border-gray-700">
                      <button onClick={() => openStatusModal(schedule, 'completed')} className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4" /> Complete
                      </button>
                      <button onClick={() => openStatusModal(schedule, 'absent')} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
                        <XCircle className="w-4 h-4" /> Absent
                      </button>
                      <button onClick={() => openRescheduleModal(schedule)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-sm">
                        <RefreshCw className="w-4 h-4" /> Reschedule
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{schedule.studentId?.userId?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{schedule.studentId?.userId?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{schedule.courseId?.title || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white font-medium">{convertToTimezone(schedule.dateTimeUTC, adminTimezone)}</p>
                          <p className="text-xs text-gray-500">Your time ({adminTimezone})</p>
                          <p className="text-xs text-gold-600 mt-1">Student: {schedule.dateTimeUser}</p>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(schedule.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {schedule.status === 'scheduled' && (
                              <>
                                <button onClick={() => openStatusModal(schedule, 'completed')} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Mark Completed">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </button>
                                <button onClick={() => openStatusModal(schedule, 'absent')} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Mark Absent">
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </button>
                                <button onClick={() => openRescheduleModal(schedule)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Reschedule">
                                  <RefreshCw className="w-4 h-4 text-blue-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Status Update Modal */}
        <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title={`Mark Class as ${statusForm.status === 'completed' ? 'Completed' : 'Absent'}`} size="sm">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedSchedule?.studentId?.userId?.name}</p>
              <p className="text-sm text-gray-500 mt-2">Class Time</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedSchedule?.dateTimeUser}</p>
            </div>
            <Input label="Notes (optional)" value={statusForm.notes} onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })} placeholder="Add any notes..." />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={statusForm.sendEmail} onChange={(e) => setStatusForm({ ...statusForm, sendEmail: e.target.checked })} className="rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Send email notification to student</span>
            </label>
            <Button onClick={handleStatusUpdate} loading={submitting} className="w-full">
              {statusForm.status === 'completed' ? 'Mark as Completed' : 'Mark as Absent'}
            </Button>
          </div>
        </Modal>

        {/* Reschedule Modal */}
        <Modal isOpen={rescheduleModal} onClose={() => setRescheduleModal(false)} title="Reschedule Class" size="sm">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedSchedule?.studentId?.userId?.name}</p>
              <p className="text-sm text-gray-500 mt-2">Current Time (Your timezone)</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedSchedule && convertToTimezone(selectedSchedule.dateTimeUTC, adminTimezone)}</p>
              <p className="text-xs text-gold-600 mt-1">Student's time: {selectedSchedule?.dateTimeUser}</p>
            </div>
            <div className="bg-gold-50 dark:bg-gold-900/20 p-3 rounded-lg">
              <p className="text-sm text-gold-700 dark:text-gold-400">⏰ Enter the new date/time in YOUR timezone ({adminTimezone}). The student will receive the time converted to their timezone.</p>
            </div>
            <div>
              <label className="label">New Date & Time (in {adminTimezone})</label>
              <input type="datetime-local" value={rescheduleForm.newDateTime} onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDateTime: e.target.value })} className="input" />
            </div>
            <Input label="Notes (optional)" value={rescheduleForm.notes} onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })} placeholder="Reason for rescheduling..." />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rescheduleForm.sendEmail} onChange={(e) => setRescheduleForm({ ...rescheduleForm, sendEmail: e.target.checked })} className="rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Send email notification to student</span>
            </label>
            <Button onClick={handleReschedule} loading={submitting} className="w-full">Reschedule Class</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
};
