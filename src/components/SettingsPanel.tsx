import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { Save, Building2, Palette, FileText, Upload, RefreshCw, CheckCircle2, Users, UserPlus, Trash2, ShieldCheck, KeyRound, User } from 'lucide-react';

interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: 'Admin' | 'Operator';
  createdAt: string;
}

interface SettingsPanelProps {
  settings: SchoolSettings;
  onSaveSettings: (settings: SchoolSettings) => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User accounts state
  const [userList, setUserList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('cert_app_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {}
    return [
      { id: 'admin-1', username: '@gbhsshajijunejo', password: 'ADMIN', role: 'Admin', createdAt: new Date().toLocaleDateString() }
    ];
  });

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Operator'>('Operator');
  const [userMsg, setUserMsg] = useState('');

  const saveUsersToStorage = (users: UserAccount[]) => {
    setUserList(users);
    localStorage.setItem('cert_app_users', JSON.stringify(users));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg('');

    const u = newUsername.trim();
    const p = newPassword.trim();

    if (!u || !p) {
      alert('Please provide both username and password for the new user.');
      return;
    }

    const formattedUsername = u.startsWith('@') ? u : `@${u}`;

    if (userList.some((user) => user.username.toLowerCase() === formattedUsername.toLowerCase())) {
      alert(`User with username "${formattedUsername}" already exists!`);
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: formattedUsername,
      password: p,
      role: newRole,
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [...userList, newUser];
    saveUsersToStorage(updated);

    setNewUsername('');
    setNewPassword('');
    setNewRole('Operator');
    setUserMsg(`User "${formattedUsername}" created successfully.`);
    setTimeout(() => setUserMsg(''), 4000);
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (username.toLowerCase() === '@gbhsshajijunejo' || username.toLowerCase() === 'gbhsshajijunejo') {
      alert('Primary System Administrator (@gbhsshajijunejo) cannot be deleted!');
      return;
    }

    if (confirm(`Are you sure you want to delete user account "${username}"?`)) {
      const updated = userList.filter((u) => u.id !== id);
      saveUsersToStorage(updated);
      setUserMsg(`User account "${username}" deleted.`);
      setTimeout(() => setUserMsg(''), 4000);
    }
  };

  const handleLogoUpload = (
    field: 'govtLogoUrl' | 'schoolLogoUrl' | 'watermarkLogoUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image exceeds 2MB limit. Please choose a smaller file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Failed to save settings. Saved to local cache.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            School & Certificate Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize official school metadata, logos, signature designations, and visual theme. Automatically saved in Firebase.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved to Firebase
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* SECTION 1: School Identity & Header */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> 1. School Information & Codes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official School Name *
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                School Address & Location
              </label>
              <input
                type="text"
                value={formData.schoolAddress}
                onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / Region
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Code
                </label>
                <input
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semis Code
                </label>
                <input
                  type="text"
                  value={formData.semisCode}
                  onChange={(e) => setFormData({ ...formData, semisCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Logos & Watermark */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" /> 2. Logos & Watermark
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Govt Logo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-700">Government Logo (Left)</span>
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-2xs">
                {formData.govtLogoUrl ? (
                  <img src={formData.govtLogoUrl} alt="Govt Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[10px] text-slate-400">No Logo</span>
                )}
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                Upload Govt Logo
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload('govtLogoUrl', e)} className="hidden" />
              </label>
            </div>

            {/* School Logo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-700">School Emblem Logo (Right)</span>
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-2xs">
                {formData.schoolLogoUrl ? (
                  <img src={formData.schoolLogoUrl} alt="School Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[10px] text-slate-400">No Logo</span>
                )}
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                Upload School Logo
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload('schoolLogoUrl', e)} className="hidden" />
              </label>
            </div>

            {/* Watermark Logo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-700">Center Watermark Logo</span>
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-2xs relative">
                {formData.watermarkLogoUrl ? (
                  <img src={formData.watermarkLogoUrl} alt="Watermark" className="w-full h-full object-contain opacity-30" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[10px] text-slate-400">No Watermark</span>
                )}
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                Upload Watermark
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload('watermarkLogoUrl', e)} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Titles, Footer & Signature Labels */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> 3. Certificate Title & Signature Labels
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Certificate Heading Title
              </label>
              <input
                type="text"
                value={formData.certificateTitle}
                onChange={(e) => setFormData({ ...formData, certificateTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-bold text-blue-900 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bottom Certification Declaration Text
              </label>
              <textarea
                rows={2}
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Signature Designation Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {/* Teacher Signature Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Left Signature: Teacher Name & Designation
                </label>
                <input
                  type="text"
                  placeholder="Teacher Name"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs mb-2 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Designation Label (e.g. Class Teacher)"
                  value={formData.teacherTitle}
                  onChange={(e) => setFormData({ ...formData, teacherTitle: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600"
                />
              </div>

              {/* Vice Principal / First Assistant Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Center Signature: Vice Principal / Assistant
                </label>
                <input
                  type="text"
                  placeholder="Vice Principal / Assistant Name"
                  value={formData.vicePrincipalName}
                  onChange={(e) => setFormData({ ...formData, vicePrincipalName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs mb-2 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Designation Label (e.g. First Assistant)"
                  value={formData.vicePrincipalTitle}
                  onChange={(e) => setFormData({ ...formData, vicePrincipalTitle: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600"
                />
              </div>

              {/* Principal Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Right Signature: Principal / Headmaster
                </label>
                <input
                  type="text"
                  placeholder="Principal Name"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs mb-2 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Designation Label (e.g. Principal)"
                  value={formData.principalTitle}
                  onChange={(e) => setFormData({ ...formData, principalTitle: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Theme & Border Styling */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" /> 4. Color Palette & Border Theme
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Outer Decorative Border Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.borderColor}
                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={formData.borderColor}
                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                  className="w-32 px-3 py-2 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner & Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={formData.themeColor}
                  onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                  className="w-32 px-3 py-2 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Admin & User Access Management */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> 5. Admin & User Account Management
            </span>
            <span className="text-xs font-normal normal-case text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Admin Access Enabled
            </span>
          </h3>

          {userMsg && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{userMsg}</span>
            </div>
          )}

          {/* Form to Create New User */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-blue-600" /> Create New User Account
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  placeholder="Set Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  User Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'Admin' | 'Operator')}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Operator">Operator (Certificate Entry)</option>
                  <option value="Admin">Admin (Full Control)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleCreateUser}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-2xs transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create User</span>
              </button>
            </div>
          </div>

          {/* List of Registered Accounts */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authorized System Users ({userList.length})
            </h4>

            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 bg-white">
              {userList.map((user) => {
                const isPrimaryAdmin =
                  user.username.toLowerCase() === '@gbhsshajijunejo' ||
                  user.username.toLowerCase() === 'gbhsshajijunejo';

                return (
                  <div
                    key={user.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {user.username}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              user.role === 'Admin'
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {user.role}
                          </span>
                          {isPrimaryAdmin && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded">
                              Primary System Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Password: <span className="text-slate-700 font-semibold">{user.password || '••••••••'}</span> &bull; Added: {user.createdAt}
                        </p>
                      </div>
                    </div>

                    {!isPrimaryAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating Firebase...' : 'Save Settings to Firebase'}
          </button>
        </div>
      </form>
    </div>
  );
};
