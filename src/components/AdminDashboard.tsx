import React, { useState, useMemo } from 'react';
import { CertificateData, SchoolSettings } from '../types';
import { formatDate } from '../lib/utils';
import { 
  Search, 
  FileText, 
  Printer, 
  Download, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  Sparkles,
  Calendar,
  UserCheck,
  Building
} from 'lucide-react';

interface AdminDashboardProps {
  certificates: CertificateData[];
  settings: SchoolSettings;
  onEdit: (cert: CertificateData) => void;
  onDelete: (certId: string) => Promise<void>;
  onDuplicate: (cert: CertificateData) => void;
  onPreview: (cert: CertificateData) => void;
  onPrint: (cert: CertificateData) => void;
  onDownloadPDF: (cert: CertificateData) => void;
  onNewCertificateClick: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  certificates,
  settings,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  onPrint,
  onDownloadPDF,
  onNewCertificateClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered Certificates
  const filteredCerts = useMemo(() => {
    if (!searchQuery.trim()) return certificates;
    const q = searchQuery.toLowerCase().trim();
    return certificates.filter(
      (c) =>
        (c.certificateNo && c.certificateNo.toLowerCase().includes(q)) ||
        (c.grNumber && c.grNumber.toLowerCase().includes(q)) ||
        (c.studentName && c.studentName.toLowerCase().includes(q)) ||
        (c.fatherName && c.fatherName.toLowerCase().includes(q)) ||
        (c.surname && c.surname.toLowerCase().includes(q))
    );
  }, [certificates, searchQuery]);

  const handleDelete = async (certId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete certificate for "${name}"? This action cannot be undone.`)) {
      setDeletingId(certId);
      try {
        await onDelete(certId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="p-3.5 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Certificates</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{certificates.length}</h3>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-3.5 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Code</p>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 font-mono">{settings.schoolCode || 'N/A'}</h3>
          </div>
          <div className="w-9 h-9 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-3.5 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEMIS Code</p>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 font-mono">{settings.semisCode || 'N/A'}</h3>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-3.5 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Year</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{new Date().getFullYear()}</h3>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* SEARCH BAR & ACTION BAR */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Cert No, GR No, Student or Father Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={onNewCertificateClick}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
        >
          <Sparkles className="w-4 h-4" /> Generate New Certificate
        </button>
      </div>

      {/* CERTIFICATES DATA TABLE */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">
            Generated Certificate Register ({filteredCerts.length})
          </h3>
          <span className="text-xs text-slate-500">
            Synched with Firestore database
          </span>
        </div>

        {filteredCerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">No certificates found matching your request.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click "Generate New Certificate" to issue a school leaving certificate.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-800 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Cert No</th>
                  <th className="px-4 py-3">G.R. No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Father Name</th>
                  <th className="px-4 py-3">Class Left</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-900">{cert.certificateNo}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">{cert.grNumber}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 uppercase">{cert.studentName}</td>
                    <td className="px-4 py-3 uppercase text-slate-700">{cert.fatherName}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{cert.classStudying}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{formatDate(cert.issueDate)}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {/* Live Preview */}
                      <button
                        onClick={() => onPreview(cert)}
                        title="Live Preview"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Print */}
                      <button
                        onClick={() => onPrint(cert)}
                        title="Print Certificate"
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* PDF */}
                      <button
                        onClick={() => onDownloadPDF(cert)}
                        title="Download A4 PDF"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => onDuplicate(cert)}
                        title="Duplicate for new student"
                        className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(cert)}
                        title="Edit Certificate"
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => cert.id && handleDelete(cert.id, cert.studentName)}
                        disabled={deletingId === cert.id}
                        title="Delete Certificate"
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
