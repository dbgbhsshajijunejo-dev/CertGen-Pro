import React, { useState } from 'react';
import { CertificateData, SchoolSettings } from '../types';
import { CertificateView } from './CertificateView';
import { Printer, Download, X, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';

interface PreviewModalProps {
  cert: CertificateData | null;
  settings: SchoolSettings;
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onDownloadPDF: () => Promise<void> | void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  cert,
  settings,
  isOpen,
  onClose,
  onPrint,
  onDownloadPDF,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen || !cert) return null;

  const handleZoomIn = () => setZoomScale((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  const handleResetZoom = () => setZoomScale(0.85);

  const handlePDFClick = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-start p-4 print:p-0 print:bg-white print:static print:block">
      {/* Top Floating Control Toolbar (Hidden on Print) */}
      <div className="sticky top-2 z-50 bg-slate-900/90 text-white border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 max-w-4xl w-full mb-4 print:hidden">
        {/* Left: Title & Scale selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 hidden sm:inline-block">Certificate Preview Scale:</span>
          
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-blue-400 min-w-[50px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition ml-1"
              title="Reset Scale"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick scale presets */}
          <div className="hidden md:flex items-center gap-1 text-[11px]">
            {[0.7, 0.85, 1.0, 1.15].map((scale) => (
              <button
                key={scale}
                onClick={() => setZoomScale(scale)}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  zoomScale === scale
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print (A4)
          </button>
          <button
            onClick={handlePDFClick}
            disabled={isGeneratingPDF}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-75 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scaled Certificate Container */}
      <div className="w-full flex justify-center items-start print:my-0 pb-12">
        <div
          className="transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <CertificateView cert={cert} settings={settings} previewMode={true} />
        </div>
      </div>
    </div>
  );
};
