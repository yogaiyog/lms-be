import type { CertificateData } from "./types";

export class PlaceholderService {
  private static readonly PLACEHOLDER_FIELDS: Record<string, keyof CertificateData> = {
    "{{NAME}}": "name",
    "{{COURSE}}": "course",
    "{{DATE}}": "date",
    "{{CERTIFICATE_NUMBER}}": "certificateNumber",
    "{{INSTRUCTOR}}": "instructor",
    "{{GRADE}}": "grade",
    "{{QR_CODE}}": "qrCode",
  };

  buildReplacements(data: CertificateData): Record<string, string> {
    const replacements: Record<string, string> = {};

    for (const [placeholder, field] of Object.entries(
      PlaceholderService.PLACEHOLDER_FIELDS,
    )) {
      const value = data[field];
      if (value !== undefined && value !== null) {
        replacements[placeholder] = value;
      }
    }

    return replacements;
  }
}
