"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: env_1.env.SMTP_PORT,
    secure: env_1.env.SMTP_ENCRYPTION === "SSL",
    auth: {
        user: env_1.env.SMTP_USERNAME,
        pass: env_1.env.SMTP_PASSWORD,
    },
});
const APP_NAME = process.env.COMPANY_NAME ?? "JTCourse";
exports.emailService = {
    async sendVerificationEmail(to, token) {
        const link = `${env_1.env.CORS_ORIGIN.split(",")[0] ?? "http://localhost:3000"}/verify-email?token=${token}`;
        await transporter.sendMail({
            from: `"${APP_NAME}" <${env_1.env.SMTP_USERNAME}>`,
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
    async sendResetPasswordEmail(to, token) {
        const link = `${env_1.env.CORS_ORIGIN.split(",")[0] ?? "http://localhost:3000"}/reset-password?token=${token}`;
        await transporter.sendMail({
            from: `"${APP_NAME}" <${env_1.env.SMTP_USERNAME}>`,
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
};
