"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const jszip_1 = __importDefault(require("jszip"));
function escapeXml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
const TEMPLATES_DIR = path_1.default.resolve(process.cwd(), "templates");
const OUTPUT_DIR = path_1.default.resolve(process.cwd(), "generated", "certificates");
class TemplateService {
    async ensureTemplate(fileName) {
        const templatePath = path_1.default.join(TEMPLATES_DIR, fileName);
        try {
            await promises_1.default.access(templatePath);
            return templatePath;
        }
        catch {
            throw new Error(`Template not found: ${templatePath}`);
        }
    }
    async generateCertificate(templateName, replacements, outputFileName) {
        const templatePath = await this.ensureTemplate(templateName);
        await promises_1.default.mkdir(OUTPUT_DIR, { recursive: true });
        const buffer = await this._replacePlaceholders(templatePath, replacements);
        const outputPath = path_1.default.join(OUTPUT_DIR, outputFileName);
        await promises_1.default.writeFile(outputPath, buffer);
        return {
            fileName: outputFileName,
            filePath: outputPath,
        };
    }
    async generateCertificateBuffer(templateName, replacements) {
        const templatePath = await this.ensureTemplate(templateName);
        console.log(`[TemplateService] generateCertificateBuffer start`);
        console.log(`[TemplateService] template: ${templatePath}`);
        console.log(`[TemplateService] replacements:`, JSON.stringify(replacements, null, 2));
        const buffer = await this._replacePlaceholders(templatePath, replacements);
        console.log(`[TemplateService] generated buffer size: ${buffer.length} bytes`);
        return buffer;
    }
    async _replacePlaceholders(templatePath, replacements) {
        const data = await promises_1.default.readFile(templatePath);
        console.log(`[TemplateService] template file size: ${data.length} bytes`);
        const zip = await jszip_1.default.loadAsync(data);
        console.log(`[TemplateService] zip entries: ${Object.keys(zip.files).length}`);
        const slideFiles = Object.keys(zip.files).filter((name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));
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
    static getTemplatesDir() {
        return TEMPLATES_DIR;
    }
    static getOutputDir() {
        return OUTPUT_DIR;
    }
}
exports.TemplateService = TemplateService;
