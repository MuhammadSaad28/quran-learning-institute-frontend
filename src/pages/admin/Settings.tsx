import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    instituteName: '',
    instituteEmail: '',
    institutePhone: '',
    instituteAddress: '',
    adminTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    defaultMeetingLink: '',
    socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setForm({
          instituteName: data.instituteName || '',
          instituteEmail: data.instituteEmail || '',
          institutePhone: data.institutePhone || '',
          instituteAddress: data.instituteAddress || '',
          adminTimezone: data.adminTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          defaultMeetingLink: data.defaultMeetingLink || '',
          socialLinks: data.socialLinks || { facebook: '', twitter: '', instagram: '', youtube: '' },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved successfully');
    } finally {
      setSaving(false);
    }
  };

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata',
    'Asia/Dhaka', 'Asia/Kuala_Lumpur', 'Asia/Jakarta', 'Australia/Sydney',
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your institute settings</p>
        </div>

        {loading ? (
          <div className="card p-8 animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />)}
          </div>
        ) : (
          <div className="max-w-3xl space-y-6">
            {/* Institute Info */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary-500" /> Institute Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Institute Name"
                  value={form.instituteName}
                  onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                  placeholder="Quran Learning Institute"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Email"
                      type="email"
                      value={form.instituteEmail}
                      onChange={(e) => setForm({ ...form, instituteEmail: e.target.value })}
                      placeholder="info@institute.com"
                    />
                    <Mail className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <Input
                      label="Phone"
                      value={form.institutePhone}
                      onChange={(e) => setForm({ ...form, institutePhone: e.target.value })}
                      placeholder="+1 234 567 890"
                    />
                    <Phone className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    label="Address"
                    value={form.instituteAddress}
                    onChange={(e) => setForm({ ...form, instituteAddress: e.target.value })}
                    placeholder="Online Worldwide"
                  />
                  <MapPin className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Class Settings */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-500" /> Class Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Admin Timezone</label>
                  <select
                    value={form.adminTimezone}
                    onChange={(e) => setForm({ ...form, adminTimezone: e.target.value })}
                    className="input"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Input
                    label="Default Meeting Link"
                    value={form.defaultMeetingLink}
                    onChange={(e) => setForm({ ...form, defaultMeetingLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                  <LinkIcon className="absolute right-4 top-9 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary-500" /> Social Links
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Facebook"
                  value={form.socialLinks.facebook}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                  placeholder="https://facebook.com/..."
                />
                <Input
                  label="Twitter"
                  value={form.socialLinks.twitter}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })}
                  placeholder="https://twitter.com/..."
                />
                <Input
                  label="Instagram"
                  value={form.socialLinks.instagram}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                  placeholder="https://instagram.com/..."
                />
                <Input
                  label="YouTube"
                  value={form.socialLinks.youtube}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <Button onClick={handleSave} loading={saving} className="w-full md:w-auto">
              <Save className="w-4 h-4" /> Save Settings
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
