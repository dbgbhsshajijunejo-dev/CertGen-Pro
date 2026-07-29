import React from 'react';
import { CertificateData, SchoolSettings } from '../types';
import { formatDate } from '../lib/utils';

interface CertificateViewProps {
  cert: CertificateData;
  settings: SchoolSettings;
  previewMode?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  cert,
  settings,
  previewMode = false,
}) => {
  const borderColor = settings.borderColor || '#1e3a8a';
  const themeColor = settings.themeColor || '#1d4ed8';

  return (
    <div
      id="certificate-print-area"
      className={`relative mx-auto bg-[#fafcff] text-slate-900 font-serif print:m-0 print:p-0 select-none overflow-hidden ${
        previewMode
          ? 'w-[210mm] h-[297mm] max-h-[297mm] shadow-2xl rounded-sm border border-slate-300'
          : 'w-[210mm] h-[297mm] max-h-[297mm]'
      }`}
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Outer Decorative Double Border Box - Fixed inset 10mm inside single A4 page */}
      <div
        className="absolute inset-[8mm] sm:inset-[10mm] flex flex-col justify-between overflow-hidden"
        style={{
          border: `4px double ${borderColor}`,
          outline: `2px solid ${borderColor}`,
          outlineOffset: '-7px',
          backgroundColor: '#f8faff',
          boxSizing: 'border-box',
        }}
      >
        {/* Corner Motifs */}
        <div
          className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 pointer-events-none z-10"
          style={{ borderColor: borderColor }}
        />
        <div
          className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 pointer-events-none z-10"
          style={{ borderColor: borderColor }}
        />
        <div
          className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 pointer-events-none z-10"
          style={{ borderColor: borderColor }}
        />
        <div
          className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 pointer-events-none z-10"
          style={{ borderColor: borderColor }}
        />

        {/* Center Watermark Logo */}
        {settings.watermarkLogoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
            style={{ opacity: settings.watermarkOpacity || 0.06 }}
          >
            <img
              src={settings.watermarkLogoUrl}
              alt="Watermark"
              className="w-[380px] h-[380px] object-contain filter grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 flex flex-col h-full justify-between p-3.5 sm:p-4 overflow-hidden">
          {/* HEADER SECTION */}
          <div>
            <div className="grid grid-cols-12 items-center pb-3 border-b-2" style={{ borderColor: borderColor }}>
              {/* LEFT: Govt Logo */}
              <div className="col-span-2 flex justify-center items-center h-full p-1">
                {settings.govtLogoUrl ? (
                  <img
                    src={settings.govtLogoUrl}
                    alt="Govt Logo"
                    className="max-h-24 max-w-24 w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-blue-900 flex items-center justify-center text-xs font-bold text-blue-900 text-center p-1">
                    GOVT SEAL
                  </div>
                )}
              </div>

              {/* CENTER: School Name & Address */}
              <div className="col-span-8 text-center px-2 flex flex-col justify-center items-center">
                {(() => {
                  const rawName = settings.schoolName || 'GBHSS HAJI JUNEJO (CAMPUS), DISTRICT BADIN';
                  if (rawName.includes(',')) {
                    const parts = rawName.split(',');
                    return (
                      <h1
                        className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-center"
                        style={{ color: borderColor }}
                      >
                        <span className="block">{parts[0].trim()}</span>
                        <span className="block text-base sm:text-lg font-bold text-slate-800 mt-0.5 tracking-wide">
                          {parts.slice(1).join(',').trim()}
                        </span>
                      </h1>
                    );
                  }
                  return (
                    <h1
                      className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-center max-w-[440px] mx-auto"
                      style={{ color: borderColor }}
                    >
                      {rawName}
                    </h1>
                  );
                })()}

                <p className={`font-semibold text-slate-800 mt-1.5 ${
                  settings.addressFontSize === 'small' ? 'text-xs' : settings.addressFontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}>
                  {settings.schoolAddress} {settings.district ? `• ${settings.district}` : ''}
                </p>

                <div className={`flex justify-center items-center gap-2 font-bold text-slate-900 mt-1.5 ${
                  settings.semisFontSize === 'small' ? 'text-xs' : settings.semisFontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}>
                  <span>School SEMIS Code: <strong className="font-mono text-blue-950 font-black text-base sm:text-lg tracking-wider ml-1">{settings.semisCode || 'N/A'}</strong></span>
                </div>
              </div>

              {/* RIGHT: School Logo */}
              <div className="col-span-2 flex justify-center items-center h-full p-1">
                {settings.schoolLogoUrl ? (
                  <img
                    src={settings.schoolLogoUrl}
                    alt="School Logo"
                    className="max-h-24 max-w-24 w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-blue-900 flex items-center justify-center text-xs font-bold text-blue-900 text-center p-1">
                    SCHOOL LOGO
                  </div>
                )}
              </div>
            </div>

            {/* CERTIFICATE TITLE BOX */}
            <div className="my-3 text-center">
              <div
                className="inline-block px-8 py-1.5 rounded-full shadow-md text-white font-extrabold text-base tracking-wider uppercase border-2 border-white"
                style={{ backgroundColor: themeColor }}
              >
                {settings.certificateTitle || 'SCHOOL LEAVING CERTIFICATE'}
              </div>
            </div>

            {/* CERTIFICATE TOP METADATA BAR (Cert No, Date, GR No) */}
            <div className="flex justify-between items-center text-xs font-semibold px-2 mb-3 pb-1 border-b border-slate-300">
              <div>
                <span className="text-slate-600">Certificate No: </span>
                <span className="font-mono text-sm text-blue-950 font-bold tracking-wider">{cert.certificateNo || '---'}</span>
              </div>
              <div>
                <span className="text-slate-600">G.R. No: </span>
                <span className="font-mono text-sm text-blue-950 font-bold tracking-wider">{cert.grNumber || '---'}</span>
              </div>
              <div>
                <span className="text-slate-600">Date of Issue: </span>
                <span className="font-mono text-sm text-blue-950 font-bold">{formatDate(cert.issueDate)}</span>
              </div>
            </div>
          </div>

          {/* MAIN CERTIFICATE DETAILS (Classic Government Underline Format) */}
          <div className="flex-1 my-1 flex flex-col justify-between text-xs sm:text-sm leading-relaxed text-slate-900">
            {/* Row: Student Photo + Top Primary Fields */}
            <div className="flex gap-4 items-start mb-2">
              <div className="flex-1 space-y-2.5">
                {/* Student Name */}
                <div className="flex items-baseline">
                  <span className="font-bold text-slate-800 whitespace-nowrap min-w-[150px]">
                    1. Name of Student:
                  </span>
                  <div className="flex-1 border-b-2 border-dotted border-slate-700 px-2 font-bold text-base text-blue-950 tracking-wide uppercase">
                    {cert.studentName || '__________________________________________'}
                  </div>
                </div>

                {/* Father's Name */}
                <div className="flex items-baseline">
                  <span className="font-bold text-slate-800 whitespace-nowrap min-w-[150px]">
                    2. Father's Name:
                  </span>
                  <div className="flex-1 border-b-2 border-dotted border-slate-700 px-2 font-bold text-blue-950 uppercase">
                    {cert.fatherName || '__________________________________________'}
                  </div>
                </div>

                {/* Surname */}
                <div className="flex items-baseline">
                  <span className="font-bold text-slate-800 whitespace-nowrap min-w-[150px]">
                    3. Surname:
                  </span>
                  <div className="flex-1 border-b-2 border-dotted border-slate-700 px-2 font-semibold text-slate-900 uppercase">
                    {cert.surname || '---'}
                  </div>
                </div>
              </div>

              {/* Optional Student Photo */}
              {cert.studentPhotoUrl ? (
                <div className="w-24 h-28 border-2 border-slate-800 p-0.5 bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
                  <img
                    src={cert.studentPhotoUrl}
                    alt="Student"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-24 h-28 border border-dashed border-slate-400 bg-slate-50/50 flex flex-col items-center justify-center text-[10px] text-slate-400 text-center p-1 shrink-0">
                  <span>Student</span>
                  <span>Photograph</span>
                  <span>(Optional)</span>
                </div>
              )}
            </div>

            {/* Row: Gender, Religion, Caste */}
            <div className="grid grid-cols-3 gap-3 py-1">
              <div className="flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">4. Gender:</span>
                <span className="flex-1 border-b border-dotted border-slate-700 text-center font-semibold text-slate-900">
                  {cert.gender || '---'}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">5. Religion:</span>
                <span className="flex-1 border-b border-dotted border-slate-700 text-center font-semibold text-slate-900">
                  {cert.religion || '---'}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">6. Caste:</span>
                <span className="flex-1 border-b border-dotted border-slate-700 text-center font-semibold text-slate-900">
                  {cert.caste || '---'}
                </span>
              </div>
            </div>

            {/* Place of Birth */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                7. Place of Birth:
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900">
                {cert.placeOfBirth || '---'}
              </div>
            </div>

            {/* Date of Birth (Figures) */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                8. Date of Birth (Figures):
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-mono font-bold text-blue-950">
                {formatDate(cert.dateOfBirth)}
              </div>
            </div>

            {/* Date of Birth (Words) */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                9. Date of Birth (Words):
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900 capitalize italic">
                {cert.dateOfBirthWords || '---'}
              </div>
            </div>

            {/* Last School Attended */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                10. Last School Attended:
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900">
                {cert.lastSchoolAttended || 'N/A'}
              </div>
            </div>

            {/* Admission Date & Class Admitted */}
            <div className="grid grid-cols-2 gap-4 py-1">
              <div className="flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-2">
                  11. Date of Admission:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-mono font-semibold text-slate-900">
                  {formatDate(cert.admissionDate)}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-2">
                  12. Class Admitted:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900">
                  {cert.classAdmitted || '---'}
                </div>
              </div>
            </div>

            {/* Class Studying & Progress & Conduct */}
            <div className="grid grid-cols-12 gap-2 py-1">
              <div className="col-span-5 flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">
                  13. Class Studying:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-700 px-1 font-bold text-blue-950">
                  {cert.classStudying || '---'}
                </div>
              </div>
              <div className="col-span-3 flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">
                  14. Progress:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-700 px-1 font-semibold text-slate-900">
                  {cert.progress || 'Satisfactory'}
                </div>
              </div>
              <div className="col-span-4 flex items-baseline">
                <span className="font-bold text-slate-800 whitespace-nowrap mr-1">
                  15. Conduct:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-700 px-1 font-semibold text-slate-900">
                  {cert.conduct || 'Good'}
                </div>
              </div>
            </div>

            {/* Date of Leaving */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                16. Date of Leaving School:
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-mono font-bold text-blue-950">
                {formatDate(cert.dateOfLeaving)}
              </div>
            </div>

            {/* Reason of Leaving */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                17. Reason of Leaving:
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900">
                {cert.reasonOfLeaving || 'Parents Choice / Higher Education'}
              </div>
            </div>

            {/* Remarks */}
            <div className="flex items-baseline py-1">
              <span className="font-bold text-slate-800 whitespace-nowrap min-w-[180px]">
                18. Remarks:
              </span>
              <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-semibold text-slate-900">
                {cert.remarks || 'Passed All School Examinations successfully.'}
              </div>
            </div>
          </div>

          {/* CERTIFICATION FOOTER STATEMENT */}
          <div className="my-3 pt-2 border-t border-slate-300 text-center">
            <p className="text-xs italic font-semibold text-slate-800 leading-normal">
              "{settings.footerText || 'It is certified that above information is in accordance with the School General Register.'}"
            </p>
          </div>

          {/* SIGNATURE SECTION */}
          <div className="pt-6 pb-2 grid grid-cols-3 gap-4 text-center items-end">
            {/* Left: Class Teacher */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-10 border-b border-slate-700 mb-1 flex items-end justify-center">
                {/* Signature space */}
              </div>
              <p className="text-xs font-bold text-slate-900">Class Teacher</p>
              <p className="text-[10px] text-slate-600 font-medium uppercase">Signature</p>
            </div>

            {/* Center: Vice Principal / First Assistant */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-10 border-b border-slate-700 mb-1 flex items-end justify-center">
                {/* Signature space */}
              </div>
              <p className="text-xs font-bold text-slate-900">{settings.vicePrincipalName || 'First Assistant'}</p>
              <p className="text-[10px] text-slate-600 font-medium uppercase">{settings.vicePrincipalTitle || 'First Assistant'}</p>
            </div>

            {/* Right: Principal */}
            <div className="flex flex-col items-center relative">
              <div className="w-36 h-10 border-b border-slate-700 mb-1 flex items-end justify-center">
                {/* Signature space */}
              </div>
              <p className="text-xs font-extrabold text-blue-950">{settings.principalName || 'Principal'}</p>
              <p className="text-[10px] text-slate-700 font-bold uppercase">{settings.principalTitle || 'Principal'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
