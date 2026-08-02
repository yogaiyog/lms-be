import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_ENCRYPTION === "SSL",
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

const APP_NAME = process.env.COMPANY_NAME ?? "JTCourse";

export const emailService = {
  async sendVerificationEmail(to: string, token: string) {
    const link = `${env.CORS_ORIGIN.split(",")[0] ?? "http://localhost:3000"}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: `"${APP_NAME}" <${env.SMTP_USERNAME}>`,
      to,
      subject: `Verifikasi Email - ${APP_NAME}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#2563eb;">Verifikasi Email</h2>
          <p>Terima kasih telah mendaftar di <strong>${APP_NAME}</strong>.</p>
          <p>Klik tombol di bawah untuk memverifikasi email kamu:</p>
          <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
            Verifikasi Email
          </a>
          <p style="color:#64748b;font-size:13px;">Atau buka link ini di browser:<br/>${link}</p>
          <p style="color:#64748b;font-size:13px;">Link berlaku 24 jam.</p>
        </div>
      `,
    });
  },

  async sendResetPasswordEmail(to: string, token: string) {
    const link = `${env.CORS_ORIGIN.split(",")[0] ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"${APP_NAME}" <${env.SMTP_USERNAME}>`,
      to,
      subject: `Reset Password - ${APP_NAME}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#2563eb;">Reset Password</h2>
          <p>Kami menerima permintaan reset password untuk akun <strong>${APP_NAME}</strong> kamu.</p>
          <p>Klik tombol di bawah untuk mereset password:</p>
          <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#64748b;font-size:13px;">Atau buka link ini di browser:<br/>${link}</p>
          <p style="color:#64748b;font-size:13px;">Link berlaku 1 jam. Abaikan email ini jika kamu tidak meminta reset password.</p>
        </div>
      `,
    });
  },

  async sendInvoiceEmail(
    to: string,
    pdfBuffer: Buffer,
    fileName: string,
    info: { studentName: string; invoiceNumber: string; total: number; status: string },
  ) {
    const { studentName, invoiceNumber, total, status } = info;
    const totalLabel = "Rp " + total.toLocaleString("id-ID");
    await transporter.sendMail({
      from: `"${APP_NAME}" <${env.SMTP_USERNAME}>`,
      to,
      subject: `Invoice ${invoiceNumber} - ${APP_NAME}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#2563eb;">Invoice ${invoiceNumber}</h2>
          <p>Halo, invoice berikut untuk <strong>${studentName}</strong>:</p>
          <p style="font-size:14px;line-height:1.8;">
            Nomor: <strong>${invoiceNumber}</strong><br/>
            Jumlah: <strong style="font-size:18px;">${totalLabel}</strong><br/>
            Status: <strong>${status}</strong>
          </p>
          <p>PDF invoice terlampir pada email ini. Silakan selesaikan pembayaran sesuai petunjuk yang tertera.</p>
          <p style="color:#64748b;font-size:13px;">— ${APP_NAME}</p>
        </div>
      `,
      attachments: [{ filename: fileName, content: pdfBuffer }],
    });
  },
};
