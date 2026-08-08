import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CURRICULUM_NAME = "Code-Explorer";
const TRIAL_CURRICULUM_NAME = "Trial Class K-2";
const CATEGORY_NAME = "Kelas 1";

const INCOME_BATCH_NAME = "Income-Batch";
const INCOME_PRIVATE_NAME = "Income-Private";
const OUTCOME_TRIAL_NAME = "Outcome-Trial";
const OUTCOME_MAKEUP_NAME = "Outcome-Makeup";

// Per-class pricing for the seeded invoices
const BATCH_PRICE_PER_MEETING = 50000;
const PRIVATE_PRICE_PER_MEETING = 60000;
const TRIAL_PRICE_PER_MEETING = 30000;
const MAKEUP_PRICE_PER_MEETING = 25000;

const ATTENDANCE_STATUS_CYCLE = ["PRESENT", "PRESENT", "LATE", "PRESENT", "SICK", "PRESENT", "PRESENT", "LATE", "PRESENT"];

async function getOrCreateCategory() {
  const existing = await prisma.category.findFirst({ where: { name: CATEGORY_NAME } });
  if (existing) return existing;
  return prisma.category.create({ data: { name: CATEGORY_NAME, label: `${CATEGORY_NAME} SD` } });
}

async function getStudent(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { studentProfile: true } });
  if (!user?.studentProfile) {
    throw new Error(`Siswa "${email}" tidak ditemukan. Jalankan seed-income dulu: npx tsx prisma/seed-income.ts`);
  }
  return user.studentProfile;
}

async function getTutor(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { tutorProfile: true } });
  if (!user?.tutorProfile) {
    throw new Error(`Tutor "${email}" tidak ditemukan. Jalankan seed-income dulu.`);
  }
  return user.tutorProfile;
}

function weeklyMondays(count: number): Date[] {
  const today = new Date();
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  lastMonday.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(lastMonday);
    d.setDate(lastMonday.getDate() - (count - 1 - i) * 7);
    dates.push(d);
  }
  return dates;
}

// Generate invoice numbers guaranteed unique for the year (max existing + sequence)
async function nextInvoiceNumbers(count: number): Promise<string[]> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const rows = await prisma.invoice.findMany({
    where: { number: { startsWith: prefix } },
    select: { number: true },
  });
  let maxNum = 0;
  for (const r of rows) {
    const n = Number(r.number.replace(prefix, ""));
    if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
  }
  const seq = await prisma.invoiceSequence.findUnique({ where: { year } });
  const start = Math.max(maxNum, seq?.last ?? 0);
  return Array.from({ length: count }, (_, i) => `${prefix}${String(start + i + 1).padStart(6, "0")}`);
}

// === Extend Income-* classes to full completion (idempotent) ===
async function extendIncomeClass(input: { className: string; pricePerMeeting: number; expectedTotal: number }) {
  const { className, pricePerMeeting, expectedTotal } = input;

  const cls = await prisma.class.findFirst({
    where: { name: className },
    include: {
      schedules: { orderBy: { date: "asc" } },
      enrollments: { include: { student: true } },
      curriculum: { include: { assessmentSet: { include: { aspects: { orderBy: { order: "asc" } } } } } },
      tutors: true,
    },
  });
  if (!cls) {
    throw new Error(`Kelas "${className}" tidak ditemukan. Jalankan seed-income dulu.`);
  }

  const remaining = cls.schedules.filter((s) => !s.isDone);
  if (remaining.length === 0) {
    console.log(`⏭  ${className}: semua jadwal sudah selesai — skip`);
    return { className, addedMeetings: 0, attendances: 0, invoices: 0 };
  }

  const aspects = cls.curriculum?.assessmentSet?.aspects ?? [];
  const tutorId = cls.tutors[0]?.id;
  const addedMeetings = remaining.length;

  await prisma.schedule.updateMany({
    where: { id: { in: remaining.map((s) => s.id) } },
    data: { isDone: true },
  });

  let attendances = 0;
  for (const [sIdx, schedule] of remaining.entries()) {
    for (const [eIdx, enrollment] of cls.enrollments.entries()) {
      const status = ATTENDANCE_STATUS_CYCLE[(sIdx + eIdx) % ATTENDANCE_STATUS_CYCLE.length];
      const attendance = await prisma.attendance.create({
        data: {
          scheduleId: schedule.id,
          studentId: enrollment.studentId,
          date: schedule.date,
          status,
          teachedBy: tutorId,
        },
      });
      attendances += 1;

      const aspectScores = aspects.map((aspect, aIdx) => ({
        aspectId: aspect.id,
        score: 3 + ((sIdx + eIdx + aIdx) % 3),
        notes: null,
      }));
      const totalScore = aspectScores.reduce((sum, s) => sum + s.score, 0);
      const percentage = 75 + ((sIdx + eIdx) * 3) % 26;

      await prisma.attendanceAssessment.create({
        data: {
          attendanceId: attendance.id,
          totalScore,
          percentage,
          mentorComment: "Assessment otomatis dari seed outcome",
          scores: { create: aspectScores },
        },
      });

      await prisma.meetUsage.create({
        data: {
          enrollmentId: enrollment.id,
          scheduleId: schedule.id,
          studentId: enrollment.studentId,
          attendanceId: attendance.id,
          date: schedule.date,
        },
      });
    }
  }

  await prisma.enrollment.updateMany({
    where: { classId: cls.id },
    data: { totalMeetPurchased: expectedTotal, totalMeetLeft: 0 },
  });

  const numbers = await nextInvoiceNumbers(cls.enrollments.length);
  let invoices = 0;
  for (const [i, enrollment] of cls.enrollments.entries()) {
    const subtotal = addedMeetings * pricePerMeeting;
    const invoice = await prisma.invoice.create({
      data: {
        enrollmentId: enrollment.id,
        number: numbers[i],
        description: `Invoice ${className} (tambahan)`,
        meetCount: addedMeetings,
        subtotal,
        total: subtotal,
        status: "PAID",
        paidAt: new Date(),
      },
    });
    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: subtotal,
        paymentMethod: cls.type === "BATCH" ? "QRIS" : "TRANSFER - BCA",
        paymentType: cls.type === "BATCH" ? "qris" : "bank_transfer",
        status: "SETTLEMENT",
        paidAt: new Date(),
        gateway: "manual",
      },
    });
    invoices += 1;
  }

  console.log(`✓ ${className}: +${addedMeetings} pertemuan, ${attendances} absensi, ${invoices} invoice tambahan`);
  return { className, addedMeetings, attendances, invoices };
}

// === Create single-schedule outcome class (TRIAL / MAKEUP) ===
async function seedOutcomeClass(input: {
  name: string;
  type: "TRIAL" | "MAKEUP";
  tutorEmail: string;
  curriculumName: string;
  studentEmails: string[];
  pricePerMeeting: number;
  meetLinkSlug: string;
}) {
  const { name, type, tutorEmail, curriculumName, studentEmails, pricePerMeeting, meetLinkSlug } = input;

  const tutor = await getTutor(tutorEmail);
  const students = await Promise.all(studentEmails.map((email) => getStudent(email)));
  const category = await getOrCreateCategory();

  const curriculum = await prisma.curriculum.findFirst({
    where: { name: curriculumName },
    include: {
      topics: { orderBy: { order: "asc" } },
      assessmentSet: { include: { aspects: { orderBy: { order: "asc" } } } },
    },
  });
  if (!curriculum || !curriculum.assessmentSet || curriculum.topics.length === 0) {
    throw new Error(`Kurikulum "${curriculumName}" tidak ditemukan. Jalankan seed utama dulu: npm run db:seed`);
  }

  const dates = weeklyMondays(1);
  const cls = await prisma.class.create({
    data: {
      name,
      type,
      categoryId: category.id,
      curriculumId: curriculum.id,
      batch: 1,
      startDate: dates[0],
      isOnline: true,
      tutors: { connect: { id: tutor.id } },
    },
  });

  await prisma.schedule.create({
    data: {
      classId: cls.id,
      dayOfWeek: "MONDAY",
      startTime: "19:00",
      endTime: "19:55",
      meetLink: `https://meet.google.com/${meetLinkSlug}`,
      topicId: curriculum.topics[0].id,
      topic: curriculum.topics[0].title,
      date: dates[0],
      isDone: true,
    },
  });

  const schedule = await prisma.schedule.findFirst({ where: { classId: cls.id } });
  const enrollments: { id: string; studentId: string }[] = [];
  for (const student of students) {
    enrollments.push(
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classId: cls.id,
          curriculumId: curriculum.id,
          totalMeetPurchased: 1,
          totalMeetLeft: 0,
        },
      }),
    );
  }

  const aspects = curriculum.assessmentSet.aspects;
  let attendances = 0;
  for (const [eIdx, enrollment] of enrollments.entries()) {
    const status = ATTENDANCE_STATUS_CYCLE[eIdx % ATTENDANCE_STATUS_CYCLE.length];
    const attendance = await prisma.attendance.create({
      data: {
        scheduleId: schedule!.id,
        studentId: enrollment.studentId,
        date: schedule!.date,
        status,
        teachedBy: tutor.id,
      },
    });
    attendances += 1;

    const aspectScores = aspects.map((aspect, aIdx) => ({
      aspectId: aspect.id,
      score: 3 + ((eIdx + aIdx) % 3),
      notes: null,
    }));
    const totalScore = aspectScores.reduce((sum, s) => sum + s.score, 0);

    await prisma.attendanceAssessment.create({
      data: {
        attendanceId: attendance.id,
        totalScore,
        percentage: 80 + eIdx * 2,
        mentorComment: "Assessment otomatis dari seed outcome",
        scores: { create: aspectScores },
      },
    });

    await prisma.meetUsage.create({
      data: {
        enrollmentId: enrollment.id,
        scheduleId: schedule!.id,
        studentId: enrollment.studentId,
        attendanceId: attendance.id,
        date: schedule!.date,
      },
    });
  }

  const numbers = await nextInvoiceNumbers(enrollments.length);
  let invoices = 0;
  for (const [i, enrollment] of enrollments.entries()) {
    const invoice = await prisma.invoice.create({
      data: {
        enrollmentId: enrollment.id,
        number: numbers[i],
        description: `Invoice ${name}`,
        meetCount: 1,
        subtotal: pricePerMeeting,
        total: pricePerMeeting,
        status: "PAID",
        paidAt: new Date(),
      },
    });
    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: pricePerMeeting,
        paymentMethod: "QRIS",
        paymentType: "qris",
        status: "SETTLEMENT",
        paidAt: new Date(),
        gateway: "manual",
      },
    });
    invoices += 1;
  }

  console.log(`✓ ${name}: 1 pertemuan, ${attendances} absensi, ${invoices} invoice lunas`);
  return { name, schedules: 1, enrollments: enrollments.length, attendances, invoices };
}

async function syncInvoiceSequence() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const rows = await prisma.invoice.findMany({
    where: { number: { startsWith: prefix } },
    select: { number: true },
  });
  let maxNum = 0;
  for (const r of rows) {
    const n = Number(r.number.replace(prefix, ""));
    if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
  }
  if (maxNum === 0) return;
  const current = await prisma.invoiceSequence.findUnique({ where: { year } });
  const target = Math.max(current?.last ?? 0, maxNum);
  await prisma.invoiceSequence.upsert({
    where: { year },
    create: { year, last: target },
    update: { last: target },
  });
  console.log(`✓ InvoiceSequence ${year} → ${target}`);
}

async function cleanupOutcomeClasses() {
  const classes = await prisma.class.findMany({
    where: { name: { in: [OUTCOME_TRIAL_NAME, OUTCOME_MAKEUP_NAME] } },
    select: { id: true },
  });

  for (const cls of classes) {
    await prisma.attendanceAssessmentScore.deleteMany({
      where: { assessment: { attendance: { schedule: { classId: cls.id } } } },
    });
    await prisma.attendanceAssessment.deleteMany({
      where: { attendance: { schedule: { classId: cls.id } } },
    });
    const invoiceIds = (
      await prisma.invoice.findMany({
        where: { enrollment: { classId: cls.id } },
        select: { id: true },
      })
    ).map((i) => i.id);
    await prisma.payment.deleteMany({ where: { invoiceId: { in: invoiceIds } } });
    await prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } });
    await prisma.meetUsage.deleteMany({ where: { schedule: { classId: cls.id } } });
    await prisma.attendance.deleteMany({ where: { schedule: { classId: cls.id } } });
    await prisma.schedule.deleteMany({ where: { classId: cls.id } });
    await prisma.enrollment.deleteMany({ where: { classId: cls.id } });
    await prisma.class.delete({ where: { id: cls.id } });
  }

  if (classes.length > 0) {
    console.log(`✓ Cleaned ${classes.length} outcome class(es)`);
  }
}

async function main() {
  console.log("Seeding outcome (pengeluaran) data...");

  await cleanupOutcomeClasses();

  // 1) Extend existing Income-* classes to full completion
  const batch = await extendIncomeClass({
    className: INCOME_BATCH_NAME,
    pricePerMeeting: BATCH_PRICE_PER_MEETING,
    expectedTotal: 12,
  });
  const priv = await extendIncomeClass({
    className: INCOME_PRIVATE_NAME,
    pricePerMeeting: PRIVATE_PRICE_PER_MEETING,
    expectedTotal: 12,
  });

  // 2) Create TRIAL & MAKEUP classes
  const trial = await seedOutcomeClass({
    name: OUTCOME_TRIAL_NAME,
    type: "TRIAL",
    tutorEmail: "budi.tutor@lms.com",
    curriculumName: TRIAL_CURRICULUM_NAME,
    studentEmails: ["rafa.student@lms.com"],
    pricePerMeeting: TRIAL_PRICE_PER_MEETING,
    meetLinkSlug: "outcome-trial",
  });
  const makeup = await seedOutcomeClass({
    name: OUTCOME_MAKEUP_NAME,
    type: "MAKEUP",
    tutorEmail: "sari.tutor@lms.com",
    curriculumName: CURRICULUM_NAME,
    studentEmails: ["nisa.student@lms.com"],
    pricePerMeeting: MAKEUP_PRICE_PER_MEETING,
    meetLinkSlug: "outcome-makeup",
  });

  await syncInvoiceSequence();

  console.log("\n--- Seed Outcome Summary ---");
  console.log(`Batch extend:    +${batch.addedMeetings} pertemuan, +${batch.attendances} absensi`);
  console.log(`Private extend:  +${priv.addedMeetings} pertemuan, +${priv.attendances} absensi`);
  console.log(`Trial baru:      ${trial.enrollments} murid, ${trial.attendances} absensi`);
  console.log(`Makeup baru:     ${makeup.enrollments} murid, ${makeup.attendances} absensi`);
  console.log("---------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
