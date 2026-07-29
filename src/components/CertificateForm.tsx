import React, { useState, useEffect } from 'react';
import { CertificateData, SchoolSettings } from '../types';
import { dateToWords, generateAutoCertNumber, generateCertificateQRCode } from '../lib/utils';
import { Sparkles, Calendar, Save, Printer, Download, Eye, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

interface CertificateFormProps {
  initialData?: CertificateData | null;
  existingCerts: CertificateData[];
  settings: SchoolSettings;
  onSave: (cert: CertificateData) => Promise<void>;
  onPreviewToggle: (cert: CertificateData) => void;
  onPrint: (cert: CertificateData) => void;
  onDownloadPDF: (cert: CertificateData) => void;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  initialData,
  existingCerts,
  settings,
  onSave,
  onPreviewToggle,
  onPrint,
  onDownloadPDF,
}) => {
  const [formData, setFormData] = useState<CertificateData>(() => {
    if (initialData) return initialData;
    const today = new Date().toISOString().split('T')[0];
    return {
      certificateNo: generateAutoCertNumber(existingCerts),
      grNumber: '',
      issueDate: today,
      studentName: '',
      fatherName: '',
      surname: '',
      gender: 'Male',
      religion: 'Islam',
      caste: '',
      nationality: 'Pakistani',
      placeOfBirth: '',
      dateOfBirth: '',
      dateOfBirthWords: '',
      admissionDate: '',
      lastSchoolAttended: '',
      classAdmitted: 'Class VI',
      classStudying: 'Class X',
      progress: 'Satisfactory',
      conduct: 'Good',
      dateOfLeaving: today,
      reasonOfLeaving: 'Higher Education / Passed Final Exam',
      remarks: 'Passed All Examinations Successfully.',
      studentPhotoUrl: '',
      qrCodeUrl: '',
      createdAt: new Date().toISOString(),
    };
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'academic' | 'leaving'>('student');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle DOB change to auto-convert into words
  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    const words = dateToWords(dob);
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dob,
      dateOfBirthWords: words,
    }));
  };

  // Regeneration of Auto Cert Number
  const handleRegenerateCertNo = () => {
    const newCertNo = generateAutoCertNumber(existingCerts);
    setFormData((prev) => ({ ...prev, certificateNo: newCertNo }));
  };

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, studentPhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update QR Code on submission / preview
  const prepareCertWithQR = async (cert: CertificateData): Promise<CertificateData> => {
    const qrUrl = await generateCertificateQRCode(cert);
    return { ...cert, qrCodeUrl: qrUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.grNumber || !formData.fatherName) {
      alert('Please fill in required fields: Student Name, G.R Number, and Father Name.');
      return;
    }
    setSaving(true);
    try {
      const finalCert = await prepareCertWithQR(formData);
      await onSave(finalCert);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerPrint = async () => {
    const finalCert = await prepareCertWithQR(formData);
    onPrint(finalCert);
  };

  const handleTriggerPDF = async () => {
    const finalCert = await prepareCertWithQR(formData);
    onDownloadPDF(finalCert);
  };

  const handleTriggerPreview = async () => {
    const finalCert = await prepareCertWithQR(formData);
    onPreviewToggle(finalCert);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-[#0F172A] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-blue-400" />
            {initialData ? 'Edit Certificate Record' : 'Generate New School Certificate'}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Fill in student details below. Certificate fields, DOB in words, and QR code format automatically.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTriggerPreview}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            Preview
          </button>
          <button
            type="button"
            onClick={handleTriggerPrint}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            Print
          </button>
          <button
            type="button"
            onClick={handleTriggerPDF}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Form Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-2.5 gap-2 text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`pb-2 px-3 border-b-2 transition text-xs ${
            activeTab === 'student'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900 text-slate-500'
          }`}
        >
          1. Student Personal Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`pb-2 px-3 border-b-2 transition text-xs ${
            activeTab === 'academic'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900 text-slate-500'
          }`}
        >
          2. Academic & Admission Record
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leaving')}
          className={`pb-2 px-3 border-b-2 transition text-xs ${
            activeTab === 'leaving'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900 text-slate-500'
          }`}
        >
          3. Leaving Status & Remarks
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Top Meta Bar: Certificate Number, GR Number, Issue Date */}
        <div className="p-4 bg-blue-50/70 rounded-lg border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Certificate Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Certificate Number *</span>
              <button
                type="button"
                onClick={handleRegenerateCertNo}
                title="Regenerate Auto Cert Number"
                className="text-blue-600 hover:text-blue-800 text-[10px] flex items-center gap-0.5"
              >
                <RefreshCw className="w-3 h-3" /> Auto
              </button>
            </label>
            <input
              type="text"
              required
              value={formData.certificateNo}
              onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono text-sm font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* G.R. Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              G.R. Number (General Register) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 4829"
              value={formData.grNumber}
              onChange={(e) => setFormData({ ...formData, grNumber: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Date of Issue *
            </label>
            <input
              type="date"
              required
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* TAB 1: Student Personal Details */}
        {activeTab === 'student' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MOHAMMAD HAMZA"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm uppercase font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Surname */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surname / Family Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. JUNEJO / MEMON / SHAIKH"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Father Name & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Father's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABDUL QADIR"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Religion, Caste, Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Religion
                </label>
                <input
                  type="text"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caste / Tribe
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajput / Baloch"
                  value={formData.caste}
                  onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Place of Birth & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Place of Birth
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Sindh"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth (Figures) *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleDateOfBirthChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Photo (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 border border-slate-300 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 flex items-center gap-1.5 w-full justify-center">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.studentPhotoUrl && (
                    <img
                      src={formData.studentPhotoUrl}
                      alt="Student Preview"
                      className="w-9 h-9 rounded object-cover border"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Auto DOB in Words Field */}
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Date of Birth in Words (Auto-generated)
              </label>
              <input
                type="text"
                placeholder="Select date of birth above to auto-generate words..."
                value={formData.dateOfBirthWords}
                onChange={(e) => setFormData({ ...formData, dateOfBirthWords: e.target.value })}
                className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-md text-sm italic font-medium text-blue-950 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Academic & Admission Record */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Last School Attended */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last School Attended
                </label>
                <input
                  type="text"
                  placeholder="e.g. Govt Primary School No. 1, City Branch"
                  value={formData.lastSchoolAttended}
                  onChange={(e) => setFormData({ ...formData, lastSchoolAttended: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Admission
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Class Admitted */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class in which Admitted
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class VI (Sixth)"
                  value={formData.classAdmitted}
                  onChange={(e) => setFormData({ ...formData, classAdmitted: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Class Studying */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Currently Studying / Left
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class X (Tenth)"
                  value={formData.classStudying}
                  onChange={(e) => setFormData({ ...formData, classStudying: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Progress
                </label>
                <select
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Leaving Status & Remarks */}
        {activeTab === 'leaving' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Conduct */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conduct & Character
                </label>
                <select
                  value={formData.conduct}
                  onChange={(e) => setFormData({ ...formData, conduct: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Exemplary">Exemplary</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                </select>
              </div>

              {/* Date of Leaving */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Leaving School *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfLeaving}
                  onChange={(e) => setFormData({ ...formData, dateOfLeaving: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Reason of Leaving */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason of Leaving School
                </label>
                <input
                  type="text"
                  placeholder="e.g. Higher Education / Passed Final Secondary Examination"
                  value={formData.reasonOfLeaving}
                  onChange={(e) => setFormData({ ...formData, reasonOfLeaving: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarks / Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. All school dues cleared. Cleared Matriculation Board Examination."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions & Save to Firebase */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected to Firebase Firestore (`certificates` collection)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeTab !== 'student' && (
              <button
                type="button"
                onClick={() =>
                  setActiveTab((curr) => (curr === 'leaving' ? 'academic' : 'student'))
                }
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Previous Step
              </button>
            )}

            {activeTab !== 'leaving' ? (
              <button
                type="button"
                onClick={() =>
                  setActiveTab((curr) => (curr === 'student' ? 'academic' : 'leaving'))
                }
                className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving to Firebase...' : 'Save & Store Certificate'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
