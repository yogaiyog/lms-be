import { TemplateService } from "./template.service";
import { PlaceholderService } from "./placeholder.service";
import type { CertificateData, GenerateResult } from "./types";

export class CertificateService {
  private templateService: TemplateService;
  private placeholderService: PlaceholderService;

  constructor() {
    this.templateService = new TemplateService();
    this.placeholderService = new PlaceholderService();
  }

  async generate(
    data: CertificateData,
    templateName: string = "certificate-template.pptx",
  ): Promise<GenerateResult> {
    const sanitizedName = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const outputFileName = `${sanitizedName}.pptx`;

    const replacements = this.placeholderService.buildReplacements(data);

    const result = await this.templateService.generateCertificate(
      templateName,
      replacements,
      outputFileName,
    );

    return {
      success: true,
      fileName: result.fileName,
      filePath: result.filePath,
    };
  }

  async generateBuffer(
    data: CertificateData,
    templateName: string = "certificate-template.pptx",
  ): Promise<Buffer> {
    console.log(`[CertificateService] generateBuffer called`);
    console.log(`[CertificateService] data:`, JSON.stringify(data, null, 2));
    const replacements = this.placeholderService.buildReplacements(data);
    console.log(`[CertificateService] built ${Object.keys(replacements).length} replacements`);
    for (const [key, value] of Object.entries(replacements)) {
      console.log(`[CertificateService]   ${key} -> "${value}" (length: ${value.length})`);
    }
    const buffer = await this.templateService.generateCertificateBuffer(templateName, replacements);
    console.log(`[CertificateService] generated buffer: ${buffer.length} bytes`);
    return buffer;
  }

  async generateBatch(
    entries: CertificateData[],
    templateName?: string,
  ): Promise<GenerateResult[]> {
    return Promise.all(
      entries.map((data) => this.generate(data, templateName)),
    );
  }

  static getOutputDir(): string {
    return TemplateService.getOutputDir();
  }
}
