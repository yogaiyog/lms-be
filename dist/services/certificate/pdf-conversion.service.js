"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfConversionService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
const pdf_lib_1 = require("pdf-lib");
const certificate_service_1 = require("./certificate.service");
class PdfConversionService {
    constructor() {
        this.certificateService = new certificate_service_1.CertificateService();
    }
    async generatePdfBuffer(data) {
        const tmpDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), "cert-"));
        const sanitizedName = data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        try {
            const pptxBuffer = await this.certificateService.generateBuffer(data);
            const pptxPath = path_1.default.join(tmpDir, `${sanitizedName}.pptx`);
            await promises_1.default.writeFile(pptxPath, pptxBuffer);
            await this.convertToPdf(pptxPath, tmpDir);
            const pdfPath = path_1.default.join(tmpDir, `${sanitizedName}.pdf`);
            const fullPdf = await promises_1.default.readFile(pdfPath);
            // Extract only the first page (template pptx may have multiple slides)
            const pdfDoc = await pdf_lib_1.PDFDocument.load(fullPdf);
            const singlePage = await pdf_lib_1.PDFDocument.create();
            const [firstPage] = await singlePage.copyPages(pdfDoc, [0]);
            singlePage.addPage(firstPage);
            const pdfBuffer = await singlePage.save();
            return Buffer.from(pdfBuffer);
        }
        finally {
            await promises_1.default.rm(tmpDir, { recursive: true, force: true });
        }
    }
    convertToPdf(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.execFile)("soffice", [
                "--headless",
                "--convert-to", "pdf",
                "--outdir", outputDir,
                inputPath,
            ], { timeout: 30000 }, (error) => {
                if (error) {
                    reject(new Error(`LibreOffice conversion failed: ${error.message}`));
                    return;
                }
                resolve();
            });
        });
    }
    sanitizeFileName(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    }
}
exports.PdfConversionService = PdfConversionService;
