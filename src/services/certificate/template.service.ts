import path from "path";
import fs from "fs/promises";
import JSZip from "jszip";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const TEMPLATES_DIR = path.resolve(process.cwd(), "templates");
const OUTPUT_DIR = path.resolve(process.cwd(), "generated", "certificates");

export class TemplateService {
  async ensureTemplate(fileName: string): Promise<string> {
    const templatePath = path.join(TEMPLATES_DIR, fileName);
    try {
      await fs.access(templatePath);
      return templatePath;
    } catch {
      throw new Error(`Template not found: ${templatePath}`);
    }
  }

  async generateCertificate(
    templateName: string,
    replacements: Record<string, string>,
    outputFileName: string,
  ): Promise<{ fileName: string; filePath: string }> {
    const templatePath = await this.ensureTemplate(templateName);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const buffer = await this._replacePlaceholders(templatePath, replacements);
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    await fs.writeFile(outputPath, buffer);

    return {
      fileName: outputFileName,
      filePath: outputPath,
    };
  }

  async generateCertificateBuffer(
    templateName: string,
    replacements: Record<string, string>,
  ): Promise<Buffer> {
    const templatePath = await this.ensureTemplate(templateName);
    console.log(`[TemplateService] generateCertificateBuffer start`);
    console.log(`[TemplateService] template: ${templatePath}`);
    console.log(`[TemplateService] replacements:`, JSON.stringify(replacements, null, 2));
    const buffer = await this._replacePlaceholders(templatePath, replacements);
    console.log(`[TemplateService] generated buffer size: ${buffer.length} bytes`);
    return buffer;
  }

  private async _replacePlaceholders(
    templatePath: string,
    replacements: Record<string, string>,
  ): Promise<Buffer> {
    const data = await fs.readFile(templatePath);
    console.log(`[TemplateService] template file size: ${data.length} bytes`);

    const zip = await JSZip.loadAsync(data);
    console.log(`[TemplateService] zip entries: ${Object.keys(zip.files).length}`);

    const slideFiles = Object.keys(zip.files).filter(
      (name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"),
    );
    console.log(`[TemplateService] slide files found: ${slideFiles.length} (${slideFiles.join(", ")})`);

    for (const slideFile of slideFiles) {
      let content = await zip.files[slideFile].async("string");

      let totalReplacements = 0;
      for (const [placeholder, value] of Object.entries(replacements)) {
        const escaped = escapeXml(value);
        const before = content;
        content = content.split(placeholder).join(escaped);
        const count = (before.length - content.length) / placeholder.length;
        if (count > 0) {
          console.log(`[TemplateService] replaced "${placeholder}" -> "${escaped}" (${count}x) in ${slideFile}`);
          totalReplacements += count;
        }
      }

      if (totalReplacements === 0) {
        console.warn(`[TemplateService] WARNING: no placeholders replaced in ${slideFile}`);
        // Log first 300 chars of content to inspect
        console.log(`[TemplateService] ${slideFile} content (first 300 chars): ${content.slice(0, 300)}`);
      }

      zip.file(slideFile, content);
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    console.log(`[TemplateService] final buffer size: ${buffer.length} bytes`);
    return buffer;
  }

  static getTemplatesDir(): string {
    return TEMPLATES_DIR;
  }

  static getOutputDir(): string {
    return OUTPUT_DIR;
  }
}
