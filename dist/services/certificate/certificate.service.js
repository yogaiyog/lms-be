"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const template_service_1 = require("./template.service");
const placeholder_service_1 = require("./placeholder.service");
class CertificateService {
    constructor() {
        this.templateService = new template_service_1.TemplateService();
        this.placeholderService = new placeholder_service_1.PlaceholderService();
    }
    async generate(data, templateName = "certificate-template.pptx") {
        const sanitizedName = data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        const outputFileName = `${sanitizedName}.pptx`;
        const replacements = this.placeholderService.buildReplacements(data);
        const result = await this.templateService.generateCertificate(templateName, replacements, outputFileName);
        return {
            success: true,
            fileName: result.fileName,
            filePath: result.filePath,
        };
    }
    async generateBuffer(data, templateName = "certificate-template.pptx") {
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
    async generateBatch(entries, templateName) {
        return Promise.all(entries.map((data) => this.generate(data, templateName)));
    }
    static getOutputDir() {
        return template_service_1.TemplateService.getOutputDir();
    }
}
exports.CertificateService = CertificateService;
