import { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, BookOpen, Edit, Trash2, Eye } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import type { Student } from '../../types';

export const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ notes: '', schedule: [{ day: 'Monday', time: '10:00' }] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      notes: student.notes || '',
      schedule: student.weeklySchedule.length > 0 ? student.weeklySchedule : [{ day: 'Monday', time: '10:00' }],
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      await api.put(`/students/${selectedStudent._id}`, {
        notes: editForm.notes,
        weeklySchedule: editForm.schedule,
      });
      toast.success('Student updated successfully');
      setEditModal(false);
      fetchStudents();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch {}
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addScheduleSlot = () => {
    setEditForm({ ...editForm, schedule: [...editForm.schedule, { day: 'Monday', time: '10:00' }] });
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'time', value: string) => {
    const newSchedule = [...editForm.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setEditForm({ ...editForm, schedule: newSchedule });
  };

  const removeScheduleSlot = (index: number) => {
    setEditForm({ ...editForm, schedule: editForm.schedule.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage enrolled students</p>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : students.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students enrolled yet</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Schedule</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Start Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{student.userId?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{student.userId?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm">
                          {student.courseId?.title || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {student.weeklySchedule?.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-sm text-gray-600 dark:text-gray-400">{s.day} at {s.time}</p>
                          ))}
                          {student.weeklySchedule?.length > 2 && (
                            <p className="text-xs text-gray-400">+{student.weeklySchedule.length - 2} more</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(student.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedStudent(student); setViewModal(true); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleEdit(student)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(student._id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Modal */}
        <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Student Details" size="md">
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedStudent.userId?.name?.[0] || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedStudent.userId?.name}</h3>
                  <p className="text-gray-500">{selectedStudent.userId?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.userId?.phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Timezone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.userId?.timezone || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Course</p>
                <p className="font-semibold text-primary-700 dark:text-primary-400">{selectedStudent.courseId?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Weekly Schedule</p>
                <div className="space-y-2">
                  {selectedStudent.weeklySchedule?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{s.day} at {s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedStudent.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedStudent.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Student" size="md">
          <div className="space-y-4">
            <div>
              <label className="label">Weekly Schedule</label>
              {editForm.schedule.map((slot, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select value={slot.day} onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)} className="input flex-1">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="time" value={slot.time} onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)} className="input w-32" />
                  {editForm.schedule.length > 1 && (
                    <button onClick={() => removeScheduleSlot(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addScheduleSlot} className="text-primary-500 text-sm font-medium">+ Add another slot</button>
            </div>
            <Input label="Notes" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Notes about the student..." />
            <Button onClick={handleUpdate} loading={submitting} className="w-full">Update Student</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
};
