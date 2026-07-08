import { execFile } from "child_process";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { PDFDocument } from "pdf-lib";
import { CertificateService } from "./certificate.service";
import type { CertificateData } from "./types";

export class PdfConversionService {
  private certificateService: CertificateService;

  constructor() {
    this.certificateService = new CertificateService();
  }

  async generatePdfBuffer(data: CertificateData): Promise<Buffer> {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cert-"));
    const sanitizedName = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    try {
      const pptxBuffer = await this.certificateService.generateBuffer(data);

      const pptxPath = path.join(tmpDir, `${sanitizedName}.pptx`);
      await fs.writeFile(pptxPath, pptxBuffer);

      await this.convertToPdf(pptxPath, tmpDir);

      const pdfPath = path.join(tmpDir, `${sanitizedName}.pdf`);
      const fullPdf = await fs.readFile(pdfPath);

      // Extract only the first page (template pptx may have multiple slides)
      const pdfDoc = await PDFDocument.load(fullPdf);
      const singlePage = await PDFDocument.create();
      const [firstPage] = await singlePage.copyPages(pdfDoc, [0]);
      singlePage.addPage(firstPage);
      const pdfBuffer = await singlePage.save();

      return Buffer.from(pdfBuffer);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  }

  private convertToPdf(inputPath: string, outputDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      execFile(
        "soffice",
        [
          "--headless",
          "--convert-to", "pdf",
          "--outdir", outputDir,
          inputPath,
        ],
        { timeout: 30000 },
        (error) => {
          if (error) {
            reject(new Error(`LibreOffice conversion failed: ${error.message}`));
            return;
          }
          resolve();
        },
      );
    });
  }

  sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
}
