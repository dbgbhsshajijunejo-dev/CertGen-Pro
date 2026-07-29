import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { Save, Building2, Palette, FileText, Upload, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SettingsPanelProps {
  settings: SchoolSettings;
  onSaveSettings: (settings: SchoolSettings) => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
