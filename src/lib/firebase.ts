import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { SchoolSettings, CertificateData } from '../types';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Access the specific database ID if specified in config, or default
export const db = getFirestore(
  app, 
  firebaseConfigJson.firestoreDatabaseId || undefined
);

export const auth = getAuth(app);

// Default Default School Settings
export const DEFAULT_SETTINGS: SchoolSettings = {
  govtLogoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80', // Seal icon or emblem
  schoolLogoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
  watermarkLogoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
  schoolName: 'GBHSS HAJI JUNEJO (CAMPUS), DISTRICT BADIN',
  schoolAddress: 'Main Station Road, City Center',
  district: 'District Central, Hyderabad',
  schoolCode: 'SCH-84920',
  semisCode: '408100192',
  certificateTitle: 'SCHOOL LEAVING CERTIFICATE',
  footerText: 'It is certified that above information is in accordance with the School General Register.',
  principalName: 'Prof. Mohammad Ali',
  principalTitle: 'Principal',
  vicePrincipalName: 'Mr. Abdul Rehman',
  vicePrincipalTitle: 'First Assistant',
  teacherName: 'Mrs. Saima Khan',
  teacherTitle: 'Class Teacher',
  borderColor: '#1e3a8a', // Deep Blue
  themeColor: '#1d4ed8', // Royal Blue
  watermarkOpacity: 0.06,
};

const SETTINGS_DOC_ID = 'general_settings';
const LOCAL_SETTINGS_KEY = 'school_cert_settings';
const LOCAL_CERTS_KEY = 'school_cert_records';

// Helper to wrap Firestore calls with a fast timeout for smooth offline fallback
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 3000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore request timeout')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Load School Settings
export async function loadSchoolSettings(): Promise<SchoolSettings> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await withTimeout(getDoc(docRef), 3000);
    if (snap.exists()) {
      const data = { ...DEFAULT_SETTINGS, ...snap.data() } as SchoolSettings;
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firebase settings fetch offline/unavailable, using local fallback');
  }

  // Fallback to localStorage
  const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (local) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
    } catch {
      // ignore
    }
  }
  return DEFAULT_SETTINGS;
}

// Save School Settings
export async function saveSchoolSettings(settings: SchoolSettings): Promise<void> {
  // Always update local cache immediately
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));

  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await withTimeout(setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }), 3000);
  } catch (err) {
    console.warn('Firebase settings save failed, saved locally');
  }
}

// Save Certificate
export async function saveCertificate(cert: CertificateData): Promise<string> {
  const certId = cert.id || `CERT-${Date.now()}`;
  const certData: CertificateData = {
    ...cert,
    id: certId,
    updatedAt: new Date().toISOString(),
  };

  // Local storage backup immediately
  const existingCerts = getLocalCertificates();
  const index = existingCerts.findIndex((c) => c.id === certId || c.certificateNo === cert.certificateNo);
  if (index >= 0) {
    existingCerts[index] = certData;
  } else {
    existingCerts.unshift(certData);
  }
  localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(existingCerts));

  try {
    const docRef = doc(db, 'certificates', certId);
    await withTimeout(setDoc(docRef, certData), 3000);
  } catch (err) {
    console.warn('Firebase cert save failed, stored locally');
  }

  return certId;
}

// Fetch All Certificates
export async function loadCertificates(): Promise<CertificateData[]> {
  try {
    const colRef = collection(db, 'certificates');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(500));
    const snap = await withTimeout(getDocs(q), 3500);
    if (!snap.empty) {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CertificateData));
      localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(docs));
      return docs;
    }
  } catch (err) {
    console.warn('Firebase load certificates offline/unavailable, using local storage');
  }

  return getLocalCertificates();
}

// Delete Certificate
export async function deleteCertificateRecord(certId: string): Promise<void> {
  // Local delete immediately
  const existing = getLocalCertificates().filter((c) => c.id !== certId);
  localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(existing));

  try {
    const docRef = doc(db, 'certificates', certId);
    await withTimeout(deleteDoc(docRef), 3000);
  } catch (err) {
    console.warn('Firebase delete failed, deleted locally');
  }
}

function getLocalCertificates(): CertificateData[] {
  const local = localStorage.getItem(LOCAL_CERTS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }
  return [];
}
