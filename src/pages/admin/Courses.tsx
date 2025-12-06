import { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import type { Course } from '../../types';

const emptyForm = { title: '', description: '', duration: '', price: '', level: 'beginner', features: '', image: '', isActive: true };

export const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      price: course.price.toString(),
      level: course.level,
      features: course.features?.join('\n') || '',
      image: course.image || '',
      isActive: course.isActive,
    });
    setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.duration || !form.price) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        features: form.features.split('\n').filter(f => f.trim()),
      };
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        toast.success('Course updated');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created');
      }
      setModal(false);
      fetchCourses();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch {}
  };

  const toggleActive = async (course: Course) => {
    try {
      await api.put(`/courses/${course._id}`, { isActive: !course.isActive });
      toast.success(`Course ${course.isActive ? 'deactivated' : 'activated'}`);
      fetchCourses();
    } catch {}
  };

  const levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your course offerings</p>
          </div>
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Course</Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No courses yet</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4" /> Create First Course</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className={`card overflow-hidden ${!course.isActive ? 'opacity-60' : ''}`}>
                <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 relative">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${course.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${course.price}/mo</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(course)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(course)}>{course.isActive ? 'Deactivate' : 'Activate'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(course._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modal} onClose={() => setModal(false)} title={editingId ? 'Edit Course' : 'Create Course'} size="lg">
          <div className="space-y-4">
            <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Quran Reading Basics" />
            <Textarea label="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Course description..." rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Duration *" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 months" />
              <Input label="Price ($/month) *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="50" />
            </div>
            <Select label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} options={levelOptions} />
            <Textarea label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="One-on-one sessions&#10;Flexible timing&#10;Certificate included" rows={4} />
            <Input label="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            <Button onClick={handleSubmit} loading={submitting} className="w-full">{editingId ? 'Update Course' : 'Create Course'}</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
};
