import React, { useState, useEffect } from 'react';
import { CertificateData, SchoolSettings } from './types';
import { 
  loadSchoolSettings, 
  saveSchoolSettings, 
  loadCertificates, 
  saveCertificate, 
  deleteCertificateRecord,
  DEFAULT_SETTINGS 
} from './lib/firebase';
import { downloadCertificatePDF } from './lib/utils';
import { Navbar } from './components/Navbar';
import { CertificateForm } from './components/CertificateForm';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsPanel } from './components/SettingsPanel';
import { PreviewModal } from './components/PreviewModal';
import { CertificateView } from './components/CertificateView';
import { LoginForm } from './components/LoginForm';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'dashboard' | 'settings'>('new');
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cert_admin_session') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('cert_admin_username_logged') || 'hajijunejo';
  });

  const handleLoginSuccess = (user: string) => {
    localStorage.setItem('cert_admin_session', 'true');
    localStorage.setItem('cert_admin_username_logged', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cert_admin_session');
    setIsAuthenticated(false);
  };

  // Active Certificate for Edit or Preview
  const [editingCert, setEditingCert] = useState<CertificateData | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Print Mode state
  const [printingCert, setPrintingCert] = useState<CertificateData | null>(null);

  // Load Initial Data from Firebase
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [loadedSettings, loadedCerts] = await Promise.all([
          loadSchoolSettings(),
          loadCertificates(),
        ]);
        setSettings(loadedSettings);
        setCertificates(loadedCerts);
      } catch (err) {
        console.error('Error initializing data from Firebase:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Handle Save Settings
  const handleSaveSettings = async (updatedSettings: SchoolSettings) => {
    await saveSchoolSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  // Handle Save Certificate
  const handleSaveCert = async (cert: CertificateData) => {
    const certId = await saveCertificate(cert);
    const updatedCert = { ...cert, id: certId };

    setCertificates((prev) => {
      const idx = prev.findIndex((c) => c.id === certId || c.certificateNo === cert.certificateNo);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = updatedCert;
        return clone;
      }
      return [updatedCert, ...prev];
    });

    setEditingCert(null);
    setPreviewCert(updatedCert);
    setIsPreviewOpen(true);
  };

  // Handle Delete Certificate
  const handleDeleteCert = async (certId: string) => {
    await deleteCertificateRecord(certId);
    setCertificates((prev) => prev.filter((c) => c.id !== certId));
  };

  // Handle Edit Certificate
  const handleEditCert = (cert: CertificateData) => {
    setEditingCert(cert);
    setActiveTab('new');
  };

  // Handle Duplicate Certificate
  const handleDuplicateCert = (cert: CertificateData) => {
    const duplicated: CertificateData = {
      ...cert,
      id: undefined,
      certificateNo: `SLC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setEditingCert(duplicated);
    setActiveTab('new');
  };

  // Handle Preview Trigger
  const handlePreviewCert = (cert: CertificateData) => {
    setPreviewCert(cert);
    setIsPreviewOpen(true);
  };

  // Handle Direct Print
  const handlePrintCert = (cert: CertificateData) => {
    setPrintingCert(cert);
    setPreviewCert(cert);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Handle Download PDF
  const handleDownloadPDF = async (cert: CertificateData) => {
    setPreviewCert(cert);
    setIsPreviewOpen(true);
    setTimeout(async () => {
      const safeName = (cert.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${cert.certificateNo || 'Certificate'}_${safeName}.pdf`;
      await downloadCertificatePDF('certificate-print-area', filename);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <h2 className="text-base font-bold tracking-wide uppercase">School Certificate Generator</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to Firebase Firestore & Loading School Settings...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        settings={settings}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'new' && activeTab !== 'new') {
            setEditingCert(null);
          }
          setActiveTab(tab);
        }}
        schoolName={settings.schoolName}
        totalCertificates={certificates.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 print:p-0">
        {activeTab === 'new' && (
          <CertificateForm
            key={editingCert?.id || 'new_cert_form'}
            initialData={editingCert}
            existingCerts={certificates}
            settings={settings}
            onSave={handleSaveCert}
            onPreviewToggle={handlePreviewCert}
            onPrint={handlePrintCert}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            certificates={certificates}
            settings={settings}
            onEdit={handleEditCert}
            onDelete={handleDeleteCert}
            onDuplicate={handleDuplicateCert}
            onPreview={handlePreviewCert}
            onPrint={handlePrintCert}
            onDownloadPDF={handleDownloadPDF}
            onNewCertificateClick={() => {
              setEditingCert(null);
              setActiveTab('new');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* Hidden Print Area rendered only when printing outside modal */}
      {printingCert && (
        <div className="hidden print:block">
          <CertificateView cert={printingCert} settings={settings} previewMode={false} />
        </div>
      )}

      {/* Live A4 Preview & Print Modal */}
      <PreviewModal
        cert={previewCert}
        settings={settings}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrint={() => {
          if (previewCert) handlePrintCert(previewCert);
        }}
        onDownloadPDF={() => {
          if (previewCert) {
            const safeName = (previewCert.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
            downloadCertificatePDF('certificate-print-area', `${previewCert.certificateNo}_${safeName}.pdf`);
          }
        }}
      />
    </div>
  );
}
