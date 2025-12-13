import { useState } from 'react';
import { User, Mail, Phone, Globe, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export const StudentProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async () => {
    if (!form.name) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated successfully');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Manage your account settings</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm">
                  Student
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
                <User className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700"
                />
                <Mail className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
                <Phone className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Timezone"
                  value={user?.timezone || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700"
                />
                <Globe className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
              </div>

              <Button onClick={handleUpdateProfile} loading={saving}>
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-500" /> Change Password
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button onClick={handleChangePassword} loading={changingPassword} variant="outline">
                <Lock className="w-4 h-4" /> Change Password
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
