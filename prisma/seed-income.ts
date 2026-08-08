import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "password123";
const CURRICULUM_NAME = "Code-Explorer";
const CATEGORY_NAME = "Kelas 1";

const BATCH_NAME = "Income-Batch";
const PRIVATE_NAME = "Income-Private";

const TUTOR_BUDI = { email: "budi.tutor@lms.com", fullName: "Budi Santoso", phone: "081234567890" };
const TUTOR_SARI = { email: "sari.tutor@lms.com", fullName: "Sari Dewi", phone: "081234567891" };

const PARENT_EMAILS = ["andi.parent@lms.com", "maya.parent@lms.com"];

const BATCH_STUDENT_EMAILS = ["rafa.student@lms.com", "luna.student@lms.com", "nisa.student@lms.com"];
const PRIVATE_STUDENT_EMAILS = ["ardhi.student@lms.com"];

// Per-class pricing for the seeded invoices
const BATCH_PRICE_PER_MEETING = 50000;
const PRIVATE_PRICE_PER_MEETING = 60000;

const ATTENDANCE_STATUS_CYCLE = ["PRESENT", "PRESENT", "LATE", "PRESENT", "SICK", "PRESENT", "PRESENT", "LATE", "PRESENT"];

async function cleanupExisting() {
  const classes = await prisma.class.findMany({
    where: { name: { in: [BATCH_NAME, PRIVATE_NAME] } },
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
    console.log(`✓ Cleaned ${classes.length} previous seed class(es)`);
  }
}

async function getOrCreateParent(email: string) {
  const existing = await prisma.user.findUnique({ where: { email }, include: { parentProfile: true } });
  if (existing?.parentProfile) return existing.parentProfile;
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(PASSWORD, 12),
      role: "PARENT",
      emailVerified: true,
      parentProfile: { create: { fullName: email.split("@")[0], phone: "080000000000" } },
    },
    include: { parentProfile: true },
  });
  return user.parentProfile!;
}

async function getOrCreateStudent(email: string, parentId: string) {
  const existing = await prisma.user.findUnique({ where: { email }, include: { studentProfile: true } });
  if (existing?.studentProfile) return existing.studentProfile;
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(PASSWORD, 12),
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId,
          fullName: email.split("@")[0],
          nickname: email.split("@")[0],
          birthDate: new Date("2015-01-01"),
        },
      },
    },
    include: { studentProfile: true },
  });
  return user.studentProfile!;
}

async function getOrCreateTutor(profile: { email: string; fullName: string; phone: string }) {
  const existing = await prisma.user.findUnique({ where: { email: profile.email }, include: { tutorProfile: true } });
  if (existing?.tutorProfile) return existing.tutorProfile;
  const user = await prisma.user.create({
    data: {
      email: profile.email,
      password: await bcrypt.hash(PASSWORD, 12),
      role: "TUTOR",
      emailVerified: true,
      tutorProfile: { create: { fullName: profile.fullName, phone: profile.phone } },
    },
    include: { tutorProfile: true },
  });
  return user.tutorProfile!;
}

async function getOrCreateCategory() {
  const existing = await prisma.category.findFirst({ where: { name: CATEGORY_NAME } });
  if (existing) return existing;
  return prisma.category.create({ data: { name: CATEGORY_NAME, label: `${CATEGORY_NAME} SD` } });
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

type SeedClassInput = {
  name: string;
  type: "BATCH" | "PRIVATE";
  tutorId: string;
  curriculumId: string;
  categoryId: string;
  topics: { id: string; title: string }[];
  aspects: { id: string }[];
  doneCount: number;
  pricePerMeeting: number;
  students: { id: string }[];
  meetLinkSlug: string;
};

async function seedClass(input: SeedClassInput) {
  const { name, type, tutorId, curriculumId, categoryId, topics, aspects, doneCount, pricePerMeeting, students, meetLinkSlug } = input;

  const dates = weeklyMondays(topics.length);
  const cls = await prisma.class.create({
    data: {
      name,
      type,
      categoryId,
      curriculumId,
      batch: 1,
      startDate: dates[0],
      isOnline: true,
      tutors: { connect: { id: tutorId } },
    },
  });

  await prisma.schedule.createMany({
    data: dates.map((date, i) => ({
      classId: cls.id,
      dayOfWeek: "MONDAY",
      startTime: "19:00",
      endTime: "19:55",
      meetLink: `https://meet.google.com/${meetLinkSlug}`,
      topicId: topics[i].id,
      topic: topics[i].title,
      date,
      isDone: i < doneCount,
    })),
  });

  const enrollments = [];
  for (const student of students) {
    enrollments.push(
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classId: cls.id,
          curriculumId,
          totalMeetPurchased: doneCount,
          totalMeetLeft: 0,
        },
      }),
    );
  }

  const schedules = await prisma.schedule.findMany({
    where: { classId: cls.id, isDone: true },
    orderBy: { date: "asc" },
  });

  let attendances = 0;
  for (const [sIdx, schedule] of schedules.entries()) {
    for (const [eIdx, enrollment] of enrollments.entries()) {
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
          mentorComment: "Assessment otomatis dari seed income",
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

  // Invoices — all PAID with a SETTLEMENT payment
  let invoices = 0;
  const numbers = await nextInvoiceNumbers(enrollments.length);
  for (const [i, enrollment] of enrollments.entries()) {
    const subtotal = doneCount * pricePerMeeting;
    const number = numbers[i];
    const invoice = await prisma.invoice.create({
      data: {
        enrollmentId: enrollment.id,
        number,
        description: `Invoice ${name}`,
        meetCount: doneCount,
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
        paymentMethod: type === "BATCH" ? "QRIS" : "TRANSFER - BCA",
        paymentType: type === "BATCH" ? "qris" : "bank_transfer",
        status: "SETTLEMENT",
        paidAt: new Date(),
        gateway: "manual",
      },
    });
    invoices += 1;
  }

  return { cls, schedules: schedules.length, enrollments: enrollments.length, attendances, invoices };
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

async function main() {
  console.log("Seeding income data...");

  await cleanupExisting();

  const budi = await getOrCreateTutor(TUTOR_BUDI);
  const sari = await getOrCreateTutor(TUTOR_SARI);

  const parents = await Promise.all(PARENT_EMAILS.map((email) => getOrCreateParent(email)));
  const parentById: Record<string, string> = {};
  parents.forEach((p, idx) => {
    parentById[PARENT_EMAILS[idx]] = p.id;
  });

  const batchStudents = await Promise.all(
    BATCH_STUDENT_EMAILS.map((email) => getOrCreateStudent(email, parentById[email])),
  );
  const privateStudents = await Promise.all(
    PRIVATE_STUDENT_EMAILS.map((email) => getOrCreateStudent(email, parentById[email])),
  );

  const category = await getOrCreateCategory();

  const curriculum = await prisma.curriculum.findFirst({
    where: { name: CURRICULUM_NAME },
    include: {
      topics: { orderBy: { order: "asc" } },
      assessmentSet: { include: { aspects: { orderBy: { order: "asc" } } } },
    },
  });
  if (!curriculum || !curriculum.assessmentSet || curriculum.topics.length === 0) {
    throw new Error(
      `Kurikulum "${CURRICULUM_NAME}" tidak ditemukan. Jalankan seed utama dulu: npm run db:seed`,
    );
  }

  const batch = await seedClass({
    name: BATCH_NAME,
    type: "BATCH",
    tutorId: budi.id,
    curriculumId: curriculum.id,
    categoryId: category.id,
    topics: curriculum.topics,
    aspects: curriculum.assessmentSet.aspects,
    doneCount: 5,
    pricePerMeeting: BATCH_PRICE_PER_MEETING,
    students: batchStudents,
    meetLinkSlug: "income-batch",
  });

  const priv = await seedClass({
    name: PRIVATE_NAME,
    type: "PRIVATE",
    tutorId: sari.id,
    curriculumId: curriculum.id,
    categoryId: category.id,
    topics: curriculum.topics,
    aspects: curriculum.assessmentSet.aspects,
    doneCount: 9,
    pricePerMeeting: PRIVATE_PRICE_PER_MEETING,
    students: privateStudents,
    meetLinkSlug: "income-private",
  });

  await syncInvoiceSequence();

  console.log("\n--- Seed Income Summary ---");
  console.log(`Batch (Budi):   ${batch.schedules} jadwal, ${batch.enrollments} murid, ${batch.attendances} absensi, ${batch.invoices} invoice`);
  console.log(`Private (Sari): ${priv.schedules} jadwal, ${priv.enrollments} murid, ${priv.attendances} absensi, ${priv.invoices} invoice`);
  console.log(`Pengeluaran (cost tutor): ${3 * 5 * 20000 + 1 * 9 * 30000}`);
  console.log(`Pemasukan (invoice lunas): ${3 * (5 * BATCH_PRICE_PER_MEETING) + 1 * (9 * PRIVATE_PRICE_PER_MEETING)}`);
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
