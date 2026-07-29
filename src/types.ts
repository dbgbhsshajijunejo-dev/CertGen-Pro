export interface SchoolSettings {
  id?: string;
  govtLogoUrl: string;
  schoolLogoUrl: string;
  watermarkLogoUrl: string;
  schoolName: string;
  schoolAddress: string;
  district: string;
  schoolCode: string;
  semisCode: string;
  certificateTitle: string;
  footerText: string;
  principalName: string;
  principalTitle: string;
  vicePrincipalName: string;
  vicePrincipalTitle: string;
  teacherName: string;
  teacherTitle: string;
  borderColor: string;
  themeColor: string;
  watermarkOpacity: number; // e.g. 0.06
  addressFontSize?: 'small' | 'medium' | 'large';
  semisFontSize?: 'small' | 'medium' | 'large';
  certScale?: number;
  updatedAt?: string;
}

export interface StudentRecord {
  id?: string;
  grNumber: string;
  studentName: string;
  fatherName: string;
  surname: string;
  gender: 'Male' | 'Female' | 'Other';
  religion: string;
  caste: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string; // YYYY-MM-DD
  dateOfBirthWords: string;
  admissionDate: string; // YYYY-MM-DD
  lastSchoolAttended: string;
  classAdmitted: string;
  classStudying: string;
  photoUrl?: string;
}

export interface CertificateData {
  id?: string;
  certificateNo: string;
  grNumber: string;
  issueDate: string;
  studentName: string;
  fatherName: string;
  surname: string;
  gender: string;
  religion: string;
  caste: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string;
  dateOfBirthWords: string;
  admissionDate: string;
  lastSchoolAttended: string;
  classAdmitted: string;
  classStudying: string;
  progress: string;
  conduct: string;
  dateOfLeaving: string;
  reasonOfLeaving: string;
  remarks: string;
  studentPhotoUrl?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'staff';
}
