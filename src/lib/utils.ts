import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateData } from '../types';

// Convert number to words (0-99999)
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const ORDINAL_DAYS: { [key: number]: string } = {
  1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth', 6: 'Sixth', 7: 'Seventh', 8: 'Eighth', 9: 'Ninth', 10: 'Tenth',
  11: 'Eleventh', 12: 'Twelfth', 13: 'Thirteenth', 14: 'Fourteenth', 15: 'Fifteenth', 16: 'Sixteenth', 17: 'Seventeenth',
  18: 'Eighteenth', 19: 'Nineteenth', 20: 'Twentieth', 21: 'Twenty-First', 22: 'Twenty-Second', 23: 'Twenty-Third',
  24: 'Twenty-Fourth', 25: 'Twenty-Fifth', 26: 'Twenty-Sixth', 27: 'Twenty-Seventh', 28: 'Twenty-Eighth', 29: 'Twenty-Ninth',
  30: 'Thirtieth', 31: 'Thirty-First'
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function numberToWords(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 0) return 'Minus ' + numberToWords(-n);
  
  if (n < 20) return ONES[n];
  if (n < 100) {
    const tensStr = TENS[Math.floor(n / 10)];
    const remainder = n % 10;
    return tensStr + (remainder > 0 ? '-' + ONES[remainder] : '');
  }
  if (n < 1000) {
    const hundredStr = ONES[Math.floor(n / 100)] + ' Hundred';
    const remainder = n % 100;
    return hundredStr + (remainder > 0 ? ' and ' + numberToWords(remainder) : '');
  }
  if (n < 100000) {
    const thousandStr = numberToWords(Math.floor(n / 1000)) + ' Thousand';
    const remainder = n % 1000;
    return thousandStr + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  return n.toString();
}

// Convert YYYY-MM-DD or date string to "Fourteenth Day of May Two Thousand Eight"
export function dateToWords(dateStr: string): string {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;

  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const dayWords = ORDINAL_DAYS[day] || numberToWords(day);
  const monthWords = MONTH_NAMES[month] || '';
  const yearWords = numberToWords(year);

  return `${dayWords} Day of ${monthWords} ${yearWords}`;
}

// Format date into standard DD-MM-YYYY
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}

// Generate QR Code data URL
export async function generateCertificateQRCode(cert: CertificateData): Promise<string> {
  const payload = JSON.stringify({
    certNo: cert.certificateNo,
    grNo: cert.grNumber,
    name: cert.studentName,
    father: cert.fatherName,
    issueDate: cert.issueDate,
    verifiedBy: 'Govt School General Register'
  });

  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 150,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

// Generate Auto Certificate Number (e.g., SLC-2026-0001)
export function generateAutoCertNumber(existingCerts: CertificateData[] = []): string {
  const currentYear = new Date().getFullYear();
  const prefix = `SLC-${currentYear}-`;
  
  // Find highest index for current year
  let maxSeq = 0;
  for (const cert of existingCerts) {
    if (cert.certificateNo && cert.certificateNo.startsWith(prefix)) {
      const parts = cert.certificateNo.split('-');
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

// Helper to sanitize oklch/oklab/color-mix CSS functions for html2canvas compatibility
function sanitizeDocumentColors(clonedDoc: Document): void {
  const convertColorString = (cssText: string): string => {
    if (!cssText || (!cssText.includes('oklch') && !cssText.includes('oklab') && !cssText.includes('color-mix'))) {
      return cssText;
    }
    
    // Replace oklch/oklab/color-mix color expressions with browser-computed rgb/rgba values
    let sanitized = cssText;
    const regex = /(oklch|oklab|color-mix)\([^)]+\)/gi;
    
    // Perform replacement
    sanitized = sanitized.replace(regex, (match) => {
      try {
        const dummy = document.createElement('div');
        dummy.style.color = match;
        document.body.appendChild(dummy);
        const computed = window.getComputedStyle(dummy).color;
        document.body.removeChild(dummy);
        if (computed && (computed.startsWith('rgb') || computed.startsWith('#'))) {
          return computed;
        }
      } catch (err) {
        // Fallback silently if computation fails
      }
      return 'rgb(0, 0, 0)';
    });

    return sanitized;
  };

  // 1. Sanitize all <style> tag content
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  for (const style of styleTags) {
    if (style.textContent && (style.textContent.includes('oklch') || style.textContent.includes('oklab') || style.textContent.includes('color-mix'))) {
      style.textContent = convertColorString(style.textContent);
    }
  }

  // 2. Sanitize all inline styles
  const allElements = Array.from(clonedDoc.querySelectorAll<HTMLElement>('*'));
  for (const el of allElements) {
    if (el.style && el.style.cssText && (el.style.cssText.includes('oklch') || el.style.cssText.includes('oklab') || el.style.cssText.includes('color-mix'))) {
      el.style.cssText = convertColorString(el.style.cssText);
    }
  }
}

// Download PDF export matching exact A4 dimensions
export async function downloadCertificatePDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Certificate view element not found for PDF export.');
    return;
  }

  try {
    // High DPI scaling (canvas 3x for crisp text)
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        sanitizeDocumentColors(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(filename || 'Government_School_Leaving_Certificate.pdf');
  } catch (err) {
    console.error('PDF export error:', err);
    alert('An error occurred while generating the PDF. Please try printing to PDF using Ctrl+P / Cmd+P.');
  }
}
