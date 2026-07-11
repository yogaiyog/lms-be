import { PDFDocument, PDFPage, StandardFonts, rgb, RGB } from "pdf-lib";
import { env } from "../../config/env";

type ReportScoreItem = {
  aspectTitle: string;
  aspectDescription?: string | null;
  icon?: string | null;
  avgScore: number;
  avgMaxScore: number;
  avgPercentage: number;
  count: number;
};

type ReportNote = {
  comment: string;
  date: string;
  tutorName: string;
};

type ReportData = {
  student: { nickname: string; fullName: string };
  generatedAt: string;
  selectedCount: number;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  statusCounts: { PRESENT: number; LATE: number; ABSENT: number; SICK?: number; PERMISSION?: number };
  topics?: string[];
  assessmentScores?: ReportScoreItem[];
  topStrengths?: { aspectTitle: string; narrative: string }[];
  topWeakness?: { aspectTitle: string; narrative: string } | null;
  notes?: ReportNote[];
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const COLORS = {
  primary: rgb(0.13, 0.41, 0.63),
  accent: rgb(0.07, 0.72, 0.42),
  warning: rgb(0.92, 0.50, 0.07),
  danger: rgb(0.85, 0.18, 0.14),
  text: rgb(0.15, 0.15, 0.15),
  muted: rgb(0.50, 0.50, 0.50),
  light: rgb(0.92, 0.92, 0.92),
  white: rgb(1, 1, 1),
  border: rgb(0.85, 0.85, 0.85),
};

function drawRect(page: PDFPage, x: number, y: number, w: number, h: number, color: RGB) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

function drawText(page: PDFPage, text: string, x: number, y: number, size: number, font: any, color: RGB = COLORS.text, options: { align?: "left" | "center" | "right"; maxWidth?: number } = {}) {
  const width = font.widthOfTextAtSize(text, size);
  let tx = x;
  if (options.align === "center") tx = x - width / 2;
  else if (options.align === "right") tx = x - width;
  page.drawText(text, { x: tx, y, size, font, color, maxWidth: options.maxWidth ?? CONTENT_W });
}

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (line) { lines.push(line); line = word; }
      else { lines.push(word); line = ""; }
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function getGradeLabel(pct: number): { label: string; color: RGB } {
  if (pct >= 90) return { label: "Excellent", color: rgb(0.07, 0.72, 0.42) };
  if (pct >= 75) return { label: "Good", color: rgb(0.13, 0.41, 0.63) };
  if (pct >= 60) return { label: "Cukup", color: COLORS.warning };
  return { label: "Perlu Bimbingan", color: COLORS.danger };
}

export class ReportPdfService {
  async generatePdf(data: ReportData): Promise<Buffer> {
    const doc = await PDFDocument.create();
    doc.setTitle(`Laporan - ${data.student.fullName}`);
    doc.setAuthor("JTCourse");
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;

    const ensureSpace = (needed: number) => {
      if (y - needed < MARGIN) {
        page = doc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
        return true;
      }
      return false;
    };

    const drawSectionHeader = (title: string) => {
      ensureSpace(35);
      drawRect(page, MARGIN, y - 22, CONTENT_W, 22, rgb(0.95, 0.96, 0.98));
      drawText(page, title, MARGIN + 10, y - 6, 11, bold, COLORS.primary);
      y -= 30;
    };

    // ── Header ──
    drawRect(page, 0, y - 10, PAGE_W, 80, COLORS.primary);
    drawText(page, "LAPORAN PERKEMBANGAN SISWA", MARGIN, y + 20, 20, bold, COLORS.white);
    drawText(page, `${data.student.fullName} (${data.student.nickname})`, MARGIN, y - 8, 12, font, COLORS.white);
    const grade = getGradeLabel(data.scorePercentage);
    drawText(page, grade.label, PAGE_W - MARGIN, y + 10, 18, bold, grade.color, { align: "right" });
    drawText(page, `${Math.round(data.scorePercentage)}%`, PAGE_W - MARGIN, y - 10, 12, font, COLORS.white, { align: "right" });
    y -= 100;

    // ── Summary Cards ──
    const cardW = (CONTENT_W - 16) / 3;
    const cardH = 55;
    const summaryItems = [
      { label: "Nilai Akumulasi", value: `${Math.round(data.scorePercentage)}%`, color: COLORS.accent },
      { label: "Total Skor", value: `${data.totalScore} / ${data.maxScore}`, color: rgb(0.13, 0.41, 0.63) },
      { label: "Tepat Waktu", value: `${data.statusCounts.PRESENT} / ${data.selectedCount}`, color: COLORS.warning },
    ];
    for (let i = 0; i < summaryItems.length; i++) {
      const cx = MARGIN + i * (cardW + 8);
      drawRect(page, cx, y - cardH, cardW, cardH, rgb(0.96, 0.97, 0.98));
      drawText(page, summaryItems[i].value, cx + cardW / 2, y - 16, 16, bold, summaryItems[i].color, { align: "center" });
      drawText(page, summaryItems[i].label, cx + cardW / 2, y - 36, 8, font, COLORS.muted, { align: "center" });
    }
    y -= cardH + 20;

    // ── Detail Info ──
    ensureSpace(55);
    const infoLines = [
      `Tanggal: ${new Date(data.generatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
      `Total Pertemuan Dinilai: ${data.selectedCount} jadwal`,
      `Skor Total: ${data.totalScore} / ${data.maxScore} (${Math.round(data.scorePercentage)}%)`,
    ];
    for (const line of infoLines) {
      drawText(page, line, MARGIN, y, 9, font, COLORS.text);
      y -= 15;
    }
    y -= 5;

    // ── Attendance Breakdown ──
    ensureSpace(140);
    drawSectionHeader("REKAP KEHADIRAN");
    const attTotal = data.selectedCount || 1;
    const attItems = [
      { label: "Tepat Waktu", pct: Math.round((data.statusCounts.PRESENT / attTotal) * 100), count: data.statusCounts.PRESENT, color: COLORS.accent },
      { label: "Terlambat", pct: Math.round((data.statusCounts.LATE / attTotal) * 100), count: data.statusCounts.LATE, color: COLORS.warning },
      { label: "Tidak Hadir", pct: Math.round((data.statusCounts.ABSENT / attTotal) * 100), count: data.statusCounts.ABSENT, color: COLORS.danger },
    ];
    for (const att of attItems) {
      const barW = (att.pct / 100) * (CONTENT_W - 100);
      drawText(page, att.label, MARGIN, y - 8, 9, font, COLORS.text);
      drawText(page, `${att.pct}% (${att.count})`, PAGE_W - MARGIN, y - 8, 9, font, COLORS.muted, { align: "right" });
      drawRect(page, MARGIN, y - 18, CONTENT_W - 100, 6, COLORS.light);
      drawRect(page, MARGIN, y - 18, Math.max(barW, 0), 6, att.color);
      y -= 28;
    }
    y -= 5;

    // ── Topics ──
    if (data.topics && data.topics.length > 0) {
      const topicLines = data.topics.join(", ");
      const topicLineCount = Math.ceil(font.widthOfTextAtSize(topicLines, 9) / CONTENT_W) + 1;
      ensureSpace(35 + topicLineCount * 14);
      drawSectionHeader("MATERI YANG DIPELAJARI");
      const lines = wrapText(topicLines, font, 9, CONTENT_W);
      for (const line of lines) {
        drawText(page, `- ${line}`, MARGIN + 5, y, 9, font, COLORS.text);
        y -= 14;
      }
      y -= 5;
    }

    // ── Assessment Scores ──
    if (data.assessmentScores && data.assessmentScores.length > 0) {
      ensureSpace(40 + data.assessmentScores.length * 34 + 20);
      drawSectionHeader("PERFORMANCE ASSESSMENT");
      drawText(page, `Rata-rata: ${Math.round(data.scorePercentage)}%`, PAGE_W - MARGIN, y + 18, 9, font, grade.color, { align: "right" });

      for (const s of data.assessmentScores) {
        const pct = Math.round(s.avgPercentage);
        let barColor = COLORS.accent;
        if (pct < 40) barColor = COLORS.danger;
        else if (pct < 60) barColor = COLORS.warning;

        drawText(page, s.aspectTitle, MARGIN, y, 9, bold, COLORS.text);
        drawText(page, `${s.avgScore} / ${s.avgMaxScore}${s.count > 1 ? " (rata-rata)" : ""}`, PAGE_W - MARGIN, y, 8, font, COLORS.muted, { align: "right" });
        y -= 14;
        drawRect(page, MARGIN, y - 4, CONTENT_W, 7, COLORS.light);
        drawRect(page, MARGIN, y - 4, Math.max((pct / 100) * CONTENT_W, 0), 7, barColor);
        y -= 20;
      }
      y -= 5;
    }

    // ── Strengths ──
    if (data.topStrengths && data.topStrengths.length > 0) {
      ensureSpace(80);
      drawSectionHeader("KELEBIHAN");
      for (const s of data.topStrengths) {
        ensureSpace(30);
        drawText(page, `+ ${s.aspectTitle}`, MARGIN + 5, y, 9, bold, COLORS.accent);
        y -= 14;
        if (s.narrative) {
          const narrLines = wrapText(s.narrative, font, 8, CONTENT_W - 10);
          for (const l of narrLines) {
            drawText(page, l, MARGIN + 15, y, 8, font, COLORS.muted);
            y -= 13;
          }
        }
        y -= 3;
      }
    }

    // ── Weakness ──
    if (data.topWeakness) {
      ensureSpace(60);
      drawSectionHeader("PERLU PERHATIAN");
      drawText(page, `! ${data.topWeakness.aspectTitle}`, MARGIN + 5, y, 9, bold, COLORS.danger);
      y -= 14;
      if (data.topWeakness.narrative) {
        const weakLines = wrapText(data.topWeakness.narrative, font, 8, CONTENT_W - 10);
        for (const l of weakLines) {
          drawText(page, l, MARGIN + 15, y, 8, font, COLORS.muted);
          y -= 13;
        }
      }
      y -= 5;
    }

    // ── Tutor Notes ──
    if (data.notes && data.notes.length > 0) {
      ensureSpace(50);
      drawSectionHeader("CATATAN TUTOR");
      for (const n of data.notes) {
        const commentLines = wrapText(n.comment, font, 9, CONTENT_W - 10);
        const needed = 20 + commentLines.length * 14;
        ensureSpace(needed);
        for (const l of commentLines) {
          drawText(page, `"${l}"`, MARGIN + 10, y, 9, font, COLORS.text);
          y -= 14;
        }
        drawText(page, `- ${n.tutorName}, ${new Date(n.date).toLocaleDateString("id-ID")}`, MARGIN + 10, y, 8, font, COLORS.muted);
        y -= 18;
      }
    }

    // ── Footer on each page ──
    for (const p of doc.getPages()) {
      drawRect(p, 0, 0, PAGE_W, 50, rgb(0.95, 0.96, 0.98));
      drawText(p, `Laporan digenerate: ${new Date(data.generatedAt).toLocaleString("id-ID")}`, PAGE_W / 2, 36, 7, font, COLORS.muted, { align: "center" });
      drawText(p, `(c) ${env.COMPANY_NAME}`, PAGE_W / 2, 24, 7, font, COLORS.muted, { align: "center" });
    }

    const buf = await doc.save();
    return Buffer.from(buf);
  }
}
