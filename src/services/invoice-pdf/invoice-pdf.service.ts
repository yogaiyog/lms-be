import { PDFDocument, PDFPage, StandardFonts, rgb, RGB } from "pdf-lib";
import QRCode from "qrcode";
import { env } from "../../config/env";
import type { Prisma } from "@prisma/client";

export const invoicePdfInclude = {
  enrollment: {
    include: {
      student: {
        include: {
          parent: { include: { user: { select: { email: true } } } },
          user: { select: { email: true } },
        },
      },
      curriculum: true,
    },
  },
  payments: true,
} satisfies Prisma.InvoiceInclude;

export type InvoicePdfData = Prisma.InvoiceGetPayload<{ include: typeof invoicePdfInclude }>;

// ── Page geometry ──
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const HEADER_H = 130;
const FOOTER_H = 46;

// ── Spacing scale (keeps rhythm consistent across the whole document) ──
const SPACE = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
};

const COLORS = {
  primary: rgb(0.13, 0.41, 0.63),
  dark: rgb(0.09, 0.30, 0.47),
  accent: rgb(0.07, 0.72, 0.42),
  warning: rgb(0.92, 0.50, 0.07),
  danger: rgb(0.85, 0.18, 0.14),
  text: rgb(0.15, 0.15, 0.15),
  muted: rgb(0.50, 0.50, 0.50),
  light: rgb(0.95, 0.96, 0.98),
  softBlue: rgb(0.94, 0.96, 1),
  white: rgb(1, 1, 1),
  border: rgb(0.87, 0.88, 0.90),
  rowAlt: rgb(0.975, 0.98, 0.985),
};

function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  color: RGB,
  border?: { color: RGB; width?: number },
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color,
    ...(border ? { borderColor: border.color, borderWidth: border.width ?? 1 } : {}),
  });
}

function safeText(text: string, font: any, size: number): string {
  try {
    font.widthOfTextAtSize(text, size);
    return text;
  } catch {
    let out = "";
    for (const ch of text) {
      try {
        font.widthOfTextAtSize(ch, size);
        out += ch;
      } catch {
        // drop characters the standard font can't encode
      }
    }
    return out;
  }
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: any,
  color: RGB = COLORS.text,
  options: { align?: "left" | "center" | "right"; maxWidth?: number } = {},
) {
  const clean = safeText(text, font, size);
  const width = font.widthOfTextAtSize(clean, size);
  let tx = x;
  if (options.align === "center") tx = x - width / 2;
  else if (options.align === "right") tx = x - width;
  page.drawText(clean, { x: tx, y, size, font, color, maxWidth: options.maxWidth ?? CONTENT_W });
}

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  text = safeText(text, font, size);
  const lines: string[] = [];
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      if (line) {
        lines.push(line);
        line = "";
      }
      let chunk = "";
      for (const ch of word) {
        const test = chunk + ch;
        if (chunk && font.widthOfTextAtSize(test, size) > maxWidth) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk = test;
        }
      }
      if (chunk) lines.push(chunk);
      continue;
    }
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

// Small rounded-looking badge (flat rect, kept simple since pdf-lib has no radius support)
function badgeWidth(text: string, font: any, size: number, hPad = 10) {
  return font.widthOfTextAtSize(safeText(text, font, size), size) + hPad * 2;
}

function drawBadge(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: any,
  bg: RGB,
  fg: RGB = COLORS.white,
  size = 8,
  hPad = 10,
) {
  const w = badgeWidth(text, font, size, hPad);
  const h = size + 10;
  drawRect(page, x, y - h + 3, w, h, bg);
  drawText(page, text, x + w / 2, y - h / 2 + 1, size, font, fg, { align: "center" });
  return w;
}

function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("id-ID");
}

const STATUS_COLORS: Record<string, RGB> = {
  PAID: COLORS.accent,
  PARTIAL: COLORS.warning,
  UNPAID: COLORS.danger,
  DRAFT: COLORS.muted,
  REFUNDED: COLORS.danger,
  CANCELLED: COLORS.muted,
};

const PAYMENT_STATUS_COLORS: Record<string, RGB> = {
  SETTLEMENT: COLORS.accent,
  PENDING: COLORS.warning,
  EXPIRED: COLORS.danger,
  DENY: COLORS.danger,
  REFUND: COLORS.danger,
  CANCELLED: COLORS.muted,
};

function bankName(bank: string | null | undefined): string {
  if (!bank) return "Virtual Account";
  const map: Record<string, string> = {
    bca: "BCA",
    bni: "BNI",
    bri: "BRI",
    mandiri: "Mandiri",
    permata: "Permata",
  };
  return `Virtual Account Bank ${map[bank.toLowerCase()] ?? bank.toUpperCase()}`;
}

function ewalletName(paymentType: string | null | undefined): string {
  const map: Record<string, string> = {
    gopay: "GoPay",
    shopeepay: "ShopeePay",
    dana: "DANA",
  };
  return paymentType ? (map[paymentType] ?? "E-Wallet") : "E-Wallet";
}

export class InvoicePdfService {
  async generatePdf(invoice: InvoicePdfData): Promise<Buffer> {
    const doc = await PDFDocument.create();
    doc.setTitle(`Invoice ${invoice.number}`);
    doc.setAuthor(env.COMPANY_NAME);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;

    // Reserve room for the footer on every page, not just a magic "+50".
    const ensureSpace = (needed: number) => {
      if (y - needed < MARGIN + FOOTER_H) {
        page = doc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
        return true;
      }
      return false;
    };

    const drawSectionHeader = (title: string, color: RGB = COLORS.primary) => {
      ensureSpace(36);
      const h = 24;
      drawRect(page, MARGIN, y - h, CONTENT_W, h, COLORS.light);
      drawRect(page, MARGIN, y - h, 4, h, color);
      drawText(page, title, MARGIN + 16, y - h / 2 - 3, 10.5, bold, COLORS.primary);
      y -= h + SPACE.md;
    };

    // Generic responsive info-grid: computes its own height from the number
    // of items instead of relying on hand-picked offsets, so nothing overlaps
    // or leaves odd gaps if the item count ever changes.
    const drawInfoGrid = (items: { label: string; value: string }[], cols = 2) => {
      const gap = SPACE.sm + 4;
      const cardW = (CONTENT_W - gap * (cols - 1)) / cols;
      const cardH = 42;
      const rows = Math.ceil(items.length / cols);
      ensureSpace(rows * (cardH + gap));
      items.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = MARGIN + col * (cardW + gap);
        const cyTop = y - row * (cardH + gap);
        drawRect(page, cx, cyTop - cardH, cardW, cardH, COLORS.light);
        drawText(page, item.label.toUpperCase(), cx + 12, cyTop - 15, 7, bold, COLORS.muted);
        drawText(page, item.value, cx + 12, cyTop - 30, 9.5, bold, COLORS.text, { maxWidth: cardW - 24 });
      });
      y -= rows * (cardH + gap) - gap + SPACE.lg;
    };

    const student = invoice.enrollment?.student;
    const curriculum = invoice.enrollment?.curriculum;
    const parent = student?.parent;

    const settled = invoice.payments
      .filter((p) => p.status === "SETTLEMENT")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const refunded = invoice.payments
      .filter((p) => p.status === "REFUND")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const netSettled = settled - refunded;
    const total = Number(invoice.total);
    const remaining = Math.max(0, total - netSettled);

    const activePayment =
      invoice.payments
        .filter((p) => p.status === "PENDING")
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ?? null;

    // ══════════════════════════ HEADER ══════════════════════════
    const barBottom = PAGE_H - HEADER_H;
    drawRect(page, 0, barBottom, PAGE_W, HEADER_H, COLORS.primary);
    drawRect(page, 0, barBottom, PAGE_W, 4, COLORS.accent);

    drawText(page, env.COMPANY_NAME, MARGIN, PAGE_H - 46, 15, bold, COLORS.white);
    drawText(page, "INVOICE", MARGIN, PAGE_H - 84, 28, bold, COLORS.white);
    drawText(page, `No. ${invoice.number}`, MARGIN, PAGE_H - 104, 10, font, rgb(0.85, 0.9, 0.97));

    const statusText = invoice.status;
    const statusColor = STATUS_COLORS[invoice.status] ?? COLORS.muted;
    drawText(page, "Diterbitkan", PAGE_W - MARGIN, PAGE_H - 44, 8, font, rgb(0.8, 0.87, 0.96), { align: "right" });
    drawText(page, formatDate(invoice.createdAt), PAGE_W - MARGIN, PAGE_H - 56, 10, bold, COLORS.white, { align: "right" });
    const badgeW = badgeWidth(statusText, bold, 10, 12);
    drawBadge(page, statusText, PAGE_W - MARGIN - badgeW, PAGE_H - 72, bold, statusColor, COLORS.white, 10, 12);

    y = barBottom - SPACE.xl;

    // ══════════════════════════ INFO GRID ══════════════════════════
    drawInfoGrid([
      { label: "Siswa", value: student?.fullName ?? "—" },
      // { label: "Kurikulum", value: curriculum?.name ?? "—" },
      // { label: "Pertemuan", value: `${invoice.meetCount} sesi` },
      { label: "Kontak Parent", value: parent ? `${parent.fullName} (${parent.phone})` : "—" },
      // { label: "Email", value: parent?.user?.email ?? student?.user?.email ?? "—" },
    ]);

    // ══════════════════════════ RINCIAN TAGIHAN ══════════════════════════
    ensureSpace(160);
    drawSectionHeader("RINCIAN TAGIHAN", COLORS.primary);
    drawText(page, invoice.description ?? `Invoice ${invoice.number}`, MARGIN + 5, y, 10, bold, COLORS.text, {
      maxWidth: CONTENT_W - 140,
    });
    drawText(page, `${invoice.meetCount} pertemuan`, PAGE_W - MARGIN - 5, y, 9, font, COLORS.muted, { align: "right" });
    y -= SPACE.lg;
    drawRect(page, MARGIN, y + 6, CONTENT_W, 1, COLORS.border);
    y -= SPACE.sm;

    const registrationFee = Number(invoice.registrationFee ?? 0);
    const lineRows: { label: string; value: string }[] = [
      { label: "Subtotal", value: formatIDR(Number(invoice.subtotal)) },
      ...(registrationFee > 0 ? [{ label: "Biaya Pendaftaran", value: formatIDR(registrationFee) }] : []),
      {
        label: invoice.taxPercent != null ? `Pajak (${invoice.taxPercent}%)` : "Pajak",
        value: formatIDR(Number(invoice.taxAmount ?? 0)),
      },
    ];
    for (const r of lineRows) {
      drawText(page, r.label, MARGIN + 5, y, 9.5, font, COLORS.text);
      drawText(page, r.value, PAGE_W - MARGIN - 5, y, 9.5, font, COLORS.text, { align: "right" });
      y -= 18;
    }
    y -= SPACE.xs;
    drawRect(page, MARGIN, y + 6, CONTENT_W, 1, COLORS.border);
    y -= SPACE.sm + 4;

    // Total / Terbayar / Sisa — pulled into one highlighted summary card so the
    // numbers that matter most are visually separated from the line items above.
    // const summaryH = 78;
    // ensureSpace(summaryH + 20);
    // drawRect(page, MARGIN, y - summaryH, CONTENT_W, summaryH, COLORS.softBlue);
    // let sy = y - 20;
    // drawText(page, "Total Tagihan", MARGIN + 16, sy, 9.5, font, COLORS.muted);
    // drawText(page, formatIDR(total), PAGE_W - MARGIN - 16, sy, 12, bold, COLORS.dark, { align: "right" });
    // sy -= 22;
    // drawText(page, "Terbayar", MARGIN + 16, sy, 9.5, font, COLORS.muted);
    // drawText(page, formatIDR(netSettled), PAGE_W - MARGIN - 16, sy, 10.5, bold, COLORS.accent, { align: "right" });
    // sy -= 22;
    // drawRect(page, MARGIN + 16, sy + 12, CONTENT_W - 32, 1, COLORS.border);
    // drawText(page, "Sisa Tagihan", MARGIN + 16, sy - 2, 10, bold, COLORS.text);
    // drawText(
    //   page,
    //   formatIDR(remaining),
    //   PAGE_W - MARGIN - 16,
    //   sy - 2,
    //   13,
    //   bold,
    //   remaining > 0 ? COLORS.warning : COLORS.accent,
    //   { align: "right" },
    // );
    // y -= summaryH + SPACE.xl;

    // ══════════════════════════ METODE PEMBAYARAN ══════════════════════════
    if (invoice.status === "PAID") {
      drawText(page, "Tagihan ini sudah lunas.", MARGIN + 16, y - 21, 10, bold, COLORS.accent);
      y -= 34 + SPACE.lg;
    } else if (activePayment) {
      drawText(
        page,
        `Jumlah yang harus dibayar: ${formatIDR(Number(activePayment.amount))}`,
        MARGIN + 5,
        y,
        10,
        bold,
        COLORS.text,
      );
      y -= 24;

      if (activePayment.paymentType === "bank_transfer") {
        const boxH = 118;
        ensureSpace(boxH + 20);
        const boxTop = y;
        drawRect(page, MARGIN, boxTop - boxH, CONTENT_W, boxH, COLORS.light, { color: COLORS.border, width: 1 });
        let by = boxTop - 20;
        drawText(page, bankName(activePayment.bank), MARGIN + 16, by, 10.5, bold, COLORS.dark);
        by -= 26;
        drawRect(page, MARGIN + 16, by - 26, CONTENT_W - 32, 34, COLORS.white, { color: COLORS.border, width: 1 });
        drawText(page, "Nomor Virtual Account", MARGIN + 26, by - 8, 8, font, COLORS.muted);
        drawText(page, activePayment.vaNumber ?? "—", MARGIN + 26, by - 22, 14, bold, COLORS.dark);
        by -= 44;
        drawText(
          page,
          `Transfer ke nomor VA di atas melalui ${activePayment.bank?.toUpperCase() ?? "bank terkait"}. Pembayaran terverifikasi otomatis — simpan bukti transfer untuk berjaga-jaga.`,
          MARGIN + 16,
          by,
          8.5,
          font,
          COLORS.muted,
          { maxWidth: CONTENT_W - 32 },
        );
        y = boxTop - boxH - SPACE.lg;
      } else if (activePayment.paymentType === "qris") {
        const qrText = activePayment.qrString;
        const qrSize = 150;
        const qrLines = qrText ? wrapText(qrText, font, 7, CONTENT_W - qrSize - 60) : [];
        const boxH = Math.max(qrSize + 30, 60 + qrLines.length * 11);
        ensureSpace(boxH + 20);
        const boxTop = y;
        drawRect(page, MARGIN, boxTop - boxH, CONTENT_W, boxH, COLORS.light, { color: COLORS.border, width: 1 });
        const qrBuffer = await QRCode.toBuffer(qrText ?? "QRIS", { type: "png", width: qrSize, margin: 1 });
        const qrImage = await doc.embedPng(qrBuffer);
        const qrX = MARGIN + 16;
        const qrY = boxTop - boxH / 2 - qrSize / 2;
        drawRect(page, qrX, qrY, qrSize, qrSize, COLORS.white, { color: COLORS.border, width: 1 });
        page.drawImage(qrImage, { x: qrX + 5, y: qrY + 5, width: qrSize - 10, height: qrSize - 10 });

        const tx = qrX + qrSize + 24;
        let ty = boxTop - 22;
        drawText(page, "QRIS", tx, ty, 11, bold, COLORS.dark);
        ty -= 16;
        drawText(page, "Scan kode QR ini dengan aplikasi apa pun yang mendukung QRIS.", tx, ty, 8.5, font, COLORS.text, {
          maxWidth: CONTENT_W - qrSize - 60,
        });
        ty -= 20;
        if (qrText) {
          drawText(page, "Kode QRIS:", tx, ty, 7.5, font, COLORS.muted);
          ty -= 12;
          for (const l of qrLines) {
            drawText(page, l, tx, ty, 7, font, COLORS.muted, { maxWidth: CONTENT_W - qrSize - 60 });
            ty -= 10;
          }
        }
        y = boxTop - boxH - SPACE.lg;
      } else if (activePayment.deeplinkUrl) {
        const wallet = ewalletName(activePayment.paymentType);
        const qrSize = 150;
        const linkLines = wrapText(activePayment.deeplinkUrl, font, 7, CONTENT_W - qrSize - 60);
        const boxH = Math.max(qrSize + 30, 60 + linkLines.length * 11);
        ensureSpace(boxH + 20);
        const boxTop = y;
        drawRect(page, MARGIN, boxTop - boxH, CONTENT_W, boxH, COLORS.light, { color: COLORS.border, width: 1 });
        const qrBuffer = await QRCode.toBuffer(activePayment.deeplinkUrl, { type: "png", width: qrSize, margin: 1 });
        const qrImage = await doc.embedPng(qrBuffer);
        const qrX = MARGIN + 16;
        const qrY = boxTop - boxH / 2 - qrSize / 2;
        drawRect(page, qrX, qrY, qrSize, qrSize, COLORS.white, { color: COLORS.border, width: 1 });
        page.drawImage(qrImage, { x: qrX + 5, y: qrY + 5, width: qrSize - 10, height: qrSize - 10 });

        const tx = qrX + qrSize + 24;
        let ty = boxTop - 22;
        drawText(page, wallet, tx, ty, 11, bold, COLORS.dark);
        ty -= 16;
        drawText(page, `Scan QR atau buka link untuk membayar dengan ${wallet}.`, tx, ty, 8.5, bold, COLORS.text, {
          maxWidth: CONTENT_W - qrSize - 60,
        });
        ty -= 20;
        drawText(page, "Link pembayaran:", tx, ty, 7.5, font, COLORS.muted);
        ty -= 12;
        for (const l of linkLines) {
          drawText(page, l, tx, ty, 7, font, COLORS.text, { maxWidth: CONTENT_W - qrSize - 60 });
          ty -= 10;
        }
        y = boxTop - boxH - SPACE.lg;
      } else {
        ensureSpace(40);
        drawText(
          page,
          "Tidak ada detail pembayaran — silakan buat ulang metode pembayaran.",
          MARGIN + 5,
          y,
          9,
          font,
          COLORS.text,
        );
        y -= SPACE.lg;
      }
    } else {
      ensureSpace(56);
      drawSectionHeader("METODE PEMBAYARAN", COLORS.accent);
      drawText(
        page,
        "Belum ada metode pembayaran dipilih. Admin dapat memilih metode via dashboard Keuangan.",
        MARGIN + 5,
        y,
        9,
        font,
        COLORS.text,
        { maxWidth: CONTENT_W - 10 },
      );
      y -= SPACE.lg;
    }

    // ══════════════════════════ RIWAYAT PEMBAYARAN ══════════════════════════
    if (invoice.payments.length > 0) {
      const rowH = 22;
      ensureSpace(50 + invoice.payments.length * rowH + 30);
      drawSectionHeader("RIWAYAT PEMBAYARAN");

      const colX = [MARGIN + 12, MARGIN + 150, MARGIN + 260, PAGE_W - MARGIN - 12];
      drawText(page, "STATUS", colX[0], y, 8, bold, COLORS.muted);
      drawText(page, "METODE", colX[1], y, 8, bold, COLORS.muted);
      drawText(page, "WAKTU", colX[2], y, 8, bold, COLORS.muted);
      drawText(page, "JUMLAH", colX[3], y, 8, bold, COLORS.muted, { align: "right" });
      y -= 10;
      drawRect(page, MARGIN, y - 2, CONTENT_W, 1, COLORS.border);
      y -= rowH - 6;

      invoice.payments.forEach((p, i) => {
        if (y - rowH < MARGIN + FOOTER_H) {
          page = doc.addPage([PAGE_W, PAGE_H]);
          y = PAGE_H - MARGIN;
        }
        if (i % 2 === 1) {
          drawRect(page, MARGIN, y - 14, CONTENT_W, rowH, COLORS.rowAlt);
        }
        const pc = PAYMENT_STATUS_COLORS[p.status] ?? COLORS.muted;
        drawBadge(page, p.status, colX[0], y + 6, bold, pc, COLORS.white, 7, 7);
        drawText(page, p.paymentMethod ?? "—", colX[1], y - 3, 8.5, font, COLORS.text, { maxWidth: 100 });
        drawText(page, formatDateTime(p.paidAt ?? p.createdAt), colX[2], y - 3, 8.5, font, COLORS.text);
        drawText(page, formatIDR(Number(p.amount)), colX[3], y - 3, 8.5, bold, COLORS.text, { align: "right" });
        y -= rowH;
      });
    }

    // ══════════════════════════ FOOTER (every page) ══════════════════════════
    const pages = doc.getPages();
    pages.forEach((p, idx) => {
      drawRect(p, 0, 0, PAGE_W, FOOTER_H, COLORS.light);
      drawRect(p, 0, FOOTER_H, PAGE_W, 1, COLORS.border);
      drawText(p, `${env.COMPANY_NAME} — invoice ini berlaku sesuai syarat & ketentuan`, MARGIN, 28, 7.5, font, COLORS.muted);
      drawText(
        p,
        `Digenerate ${new Date().toLocaleString("id-ID")}`,
        MARGIN,
        16,
        7,
        font,
        COLORS.muted,
      );
      drawText(p, `Halaman ${idx + 1} / ${pages.length}`, PAGE_W - MARGIN, 20, 7.5, font, COLORS.muted, {
        align: "right",
      });
    });

    const buf = await doc.save();
    return Buffer.from(buf);
  }
}