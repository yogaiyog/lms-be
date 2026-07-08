export interface CertificateData {
  name: string;
  course: string;
  date: string;
  certificateNumber: string;
  instructor: string;
  grade?: string;
  qrCode?: string;
}

export interface GenerateResult {
  success: true;
  fileName: string;
  filePath: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  path: string;
}

export interface PlaceholderMapping {
  placeholder: string;
  value: string;
}
