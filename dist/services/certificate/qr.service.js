"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const QR_DIR = path_1.default.resolve(process.cwd(), "generated", "certificates", "qr");
class QRService {
    async generateQRCode(certificateId, baseUrl = "https://domain.com/certificate") {
        await promises_1.default.mkdir(QR_DIR, { recursive: true });
        const url = `${baseUrl}/${certificateId}`;
        const fileName = `qr-${certificateId}.png`;
        const filePath = path_1.default.join(QR_DIR, fileName);
        await qrcode_1.default.toFile(filePath, url, {
            width: 200,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
        return filePath;
    }
    static getQRDir() {
        return QR_DIR;
    }
}
exports.QRService = QRService;
