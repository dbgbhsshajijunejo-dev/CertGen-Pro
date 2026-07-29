import React from 'react';
import { CertificateData, SchoolSettings } from '../types';
import { CertificateView } from './CertificateView';
import { Printer, Download, X } from 'lucide-react';

interface PreviewModalProps {
  cert: CertificateData | null;
  settings: SchoolSettings;
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  cert,
  settings,
  isOpen,
  onClose,
  onPrint,
  onDownloadPDF,
}) => {
  if (!isOpen || !cert) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:block">
      {/* Action Bar (Hidden on Print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition"
        >
          <Printer className="w-4 h-4" /> Print Certificate (A4)
        </button>
        <button
          onClick={onDownloadPDF}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Certificate Frame */}
      <div className="my-8 print:my-0 transform scale-95 sm:scale-100 transition-transform">
        <CertificateView cert={cert} settings={settings} previewMode={true} />
      </div>
    </div>
  );
};
