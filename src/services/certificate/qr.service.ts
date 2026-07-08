import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";

const QR_DIR = path.resolve(process.cwd(), "generated", "certificates", "qr");

export class QRService {
  async generateQRCode(
    certificateId: string,
    baseUrl: string = "https://domain.com/certificate",
  ): Promise<string> {
    await fs.mkdir(QR_DIR, { recursive: true });

    const url = `${baseUrl}/${certificateId}`;
    const fileName = `qr-${certificateId}.png`;
    const filePath = path.join(QR_DIR, fileName);

    await QRCode.toFile(filePath, url, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return filePath;
  }

  static getQRDir(): string {
    return QR_DIR;
  }
}
