/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedTopics } from "./seed-topics";
import { seedBatchScratchExplorer } from "./seed-topics-batch-scratch";
import { seedBatchScratchExplorer2 } from "./seed-topics-batch-scratch-2";
import { seedPythonExplorer } from "./seed-topics-py";
import { seedCodeExplorer } from "./seed-topics-ce";
import { seedBatchCodeExplorer } from "./seed-topics-batch-ce";
import { seedTrialClass } from "./seed-trial-topics";
import { seedTrialPython } from "./seed-trial-topics-py";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data (order matters for FK constraints)
  await prisma.attendanceAssessmentScore.deleteMany();
  await prisma.attendanceAssessment.deleteMany();
  await prisma.assessmentAspect.deleteMany();
  await prisma.studentBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.meetUsage.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.tutorSlot.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.requestClass.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.curriculumCategory.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.category.deleteMany();
  await prisma.assessmentSet.deleteMany();
  await prisma.tutorCost.deleteMany();
  await prisma.class.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.tutorProfile.deleteMany();
  await prisma.parentProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  // === ADMIN ===
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@lms.com",
      password,
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log("✓ Admin created:", adminUser.email);

  // === TUTORS ===
  const tutor1User = await prisma.user.create({
    data: {
      email: "budi.tutor@lms.com",
      password,
      role: "TUTOR",
      emailVerified: true,
      tutorProfile: {
        create: {
          fullName: "Budi Santoso",
          phone: "081234567890",
          bio: "Tutor Scratch & Web Development untuk anak-anak",
          avatarUrl: null,
          dayoff1: 1, // Tuesday
          dayoff2: 3, // Thursday
        },
      },
    },
  });

  const tutor2User = await prisma.user.create({
    data: {
      email: "sari.tutor@lms.com",
      password,
      role: "TUTOR",
      emailVerified: true,
      tutorProfile: {
        create: {
          fullName: "Sari Dewi",
          phone: "081234567891",
          bio: "Tutor Python & Game Development",
          avatarUrl: null,
          dayoff1: 0, // Monday
          dayoff2: 2, // Wednesday
        },
      },
    },
  });
  console.log("✓ Tutors created");

  const tutor1 = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId: tutor1User.id },
  });
  const tutor2 = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId: tutor2User.id },
  });

  // === PARENTS ===
  const parent1User = await prisma.user.create({
    data: {
      email: "andi.parent@lms.com",
      password,
      role: "PARENT",
      emailVerified: true,
      parentProfile: {
        create: {
          fullName: "Andi Pratama",
          phone: "082111222333",
        },
      },
    },
  });

  const parent2User = await prisma.user.create({
    data: {
      email: "maya.parent@lms.com",
      password,
      role: "PARENT",
      emailVerified: true,
      parentProfile: {
        create: {
          fullName: "Maya Sari",
          phone: "082144555666",
        },
      },
    },
  });
  console.log("✓ Parents created");

  const parent1 = await prisma.parentProfile.findUniqueOrThrow({
    where: { userId: parent1User.id },
  });
  const parent2 = await prisma.parentProfile.findUniqueOrThrow({
    where: { userId: parent2User.id },
  });

  console.log("✓ Parents created");

  // === CATEGORIES (must be before students & curriculums) ===
  const categoryData = [
    { name: "Kelas 1", label: "Kelas 1 SD" },
    { name: "Kelas 2", label: "Kelas 2 SD" },
    { name: "Kelas 3", label: "Kelas 3 SD" },
    { name: "Kelas 4", label: "Kelas 4 SD" },
    { name: "Kelas 5", label: "Kelas 5 SD" },
    { name: "Kelas 6", label: "Kelas 6 SD" },
    { name: "Kelas 7", label: "Kelas 7 SMP" },
    { name: "Kelas 8", label: "Kelas 8 SMP" },
    { name: "Kelas 9", label: "Kelas 9 SMP" },
  ];

  const categories = await Promise.all(
    categoryData.map((c) => prisma.category.create({ data: c })),
  );
  const [kelas1, kelas2, kelas3, kelas4, kelas5, kelas6, kelas7, kelas8, kelas9] = categories;
  console.log(`✓ ${categories.length} categories created`);

  // === STUDENTS ===
  const student1User = await prisma.user.create({
    data: {
      email: "rafa.student@lms.com",
      password,
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId: parent1.id,
          fullName: "Rafa Pratama",
          nickname: "Rafa",
          birthDate: new Date("2016-05-15"),
          categoryId: kelas1.id,
          totalXp: 350,
          currentStreak: 5,
          lastActive: new Date(),
        },
      },
    },
  });

  const student2User = await prisma.user.create({
    data: {
      email: "luna.student@lms.com",
      password,
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId: parent1.id,
          fullName: "Luna Pratama",
          nickname: "Luna",
          birthDate: new Date("2014-08-20"),
          categoryId: kelas4.id,
          totalXp: 720,
          currentStreak: 12,
          lastActive: new Date(),
        },
      },
    },
  });

  const student3User = await prisma.user.create({
    data: {
      email: "ardhi.student@lms.com",
      password,
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Ardhi Saputra",
          nickname: "Ardhi",
          birthDate: new Date("2012-03-10"),
          categoryId: kelas7.id,
          totalXp: 1250,
          currentStreak: 20,
          lastActive: new Date(),
        },
      },
    },
  });

  const student4User = await prisma.user.create({
    data: {
      email: "nisa.student@lms.com",
      password,
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Nisa Saputra",
          nickname: "Nisa",
          birthDate: new Date("2017-11-05"),
          categoryId: kelas1.id,
          totalXp: 180,
          currentStreak: 2,
          lastActive: new Date(),
        },
      },
    },
  });
  // Student tanpa class (untuk test flow request class -> baru diassign)
  const student5User = await prisma.user.create({
    data: {
      email: "dito.student@lms.com",
      password,
      role: "STUDENT",
      emailVerified: true,
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Dito Saputra",
          nickname: "Dito",
          birthDate: new Date("2015-06-20"),
          categoryId: kelas4.id,
          totalXp: 0,
          currentStreak: 0,
        },
      },
    },
  });
  console.log("✓ Students created");

  const student1 = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student1User.id },
  });
  const student2 = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student2User.id },
  });
  const student3 = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student3User.id },
  });
  const student4 = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student4User.id },
  });
  const student5 = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student5User.id },
  });

  // === ASSESSMENT SETS (created first so curriculums can reference it) ===
  const defaultAssessment = await prisma.assessmentSet.create({
    data: {
      name: "Default Coding Assessment",
      description: "Penilaian coding untuk siswa coding course",
      aspects: {
        create: [
          { title: "Pemahaman Konsep", description: "Memahami konsep yang diajarkan", minScore: 1, maxScore: 5, order: 1 },
          { title: "Kualitas Kode", description: "Kerapian dan struktur kode yang ditulis", minScore: 1, maxScore: 5, order: 2 },
          { title: "Kreativitas", description: "Kreativitas dalam menyelesaikan masalah", minScore: 1, maxScore: 5, order: 3 },
          { title: "Kemandirian", description: "Mampu mengerjakan tanpa banyak bantuan", minScore: 1, maxScore: 5, order: 4 },
          { title: "Problem Solving", description: "Kemampuan memecahkan masalah", minScore: 1, maxScore: 5, order: 5 },
          { title: "Ketepatan Waktu", description: "Menyelesaikan tugas tepat waktu", minScore: 1, maxScore: 5, order: 6 },
          { title: "Partisipasi", description: "Keaktifan dalam diskusi kelas", minScore: 1, maxScore: 5, order: 7 },
          { title: "Kerapian Project", description: "Project dikerjakan dengan rapi dan terstruktur", minScore: 1, maxScore: 5, order: 8 },
          { title: "Kolaborasi", description: "Kemampuan bekerja sama dengan teman", minScore: 1, maxScore: 5, order: 9 },
          { title: "Presentasi", description: "Kemampuan mempresentasikan hasil karya", minScore: 1, maxScore: 5, order: 10 },
        ],
      },
    },
    include: { aspects: true },
  });
  console.log(`✓ Assessment set created: ${defaultAssessment.name} (${defaultAssessment.aspects.length} aspects)`);

  // === REQUEST CLASS ===
  // Dito (student5) - baru daftar, belum punya kelas, status PENDING → Python-Explorer
  await prisma.requestClass.create({
    data: {
      studentId: student5.id,
      parentId: parent2.id,
      category: "JUNIOR_II",
      curriculum: "Python-Explorer",
      days: JSON.stringify(["TUESDAY", "THURSDAY"]),
      startTime: "15:00",
      endTime: "16:30",
      sessionCount: 2,
      preferredTutorId: tutor2.id,
      notes: "Dito pernah belajar Python dasar di sekolah, ingin melanjutkan",
      status: "PENDING",
    },
  });

  // Nisa (student4) - request ganti jadwal → Scratch-Explorer
  await prisma.requestClass.create({
    data: {
      studentId: student4.id,
      parentId: parent2.id,
      category: "JUNIOR_I",
      curriculum: "Scratch-Explorer",
      days: JSON.stringify(["SATURDAY"]),
      startTime: "13:00",
      endTime: "14:30",
      sessionCount: 1,
      notes: "Minta pindah hari Sabtu karena kegiatan sekolah hari Rabu",
      status: "PENDING",
    },
  });

  // Luna (student2) - request PENDING → Python-Explorer
  await prisma.requestClass.create({
    data: {
      studentId: student2.id,
      parentId: parent1.id,
      category: "JUNIOR_II",
      curriculum: "Python-Explorer",
      days: JSON.stringify(["SATURDAY"]),
      startTime: "10:30",
      endTime: "12:00",
      sessionCount: 1,
      notes: "Luna tertarik dengan coding Python",
      status: "PENDING",
    },
  });

  // Ardhi (student3) - requestnya di-REJECTED
  await prisma.requestClass.create({
    data: {
      studentId: student3.id,
      parentId: parent2.id,
      category: "JUNIOR_III",
      curriculum: "Mobile App Development",
      days: JSON.stringify(["SUNDAY"]),
      startTime: "09:00",
      endTime: "11:00",
      sessionCount: 1,
      notes: "Ardhi ingin belajar bikin aplikasi Android",
      status: "REJECTED",
      adminNotes: "Mohon maaf, kurikulum Mobile App Development belum tersedia. Silakan pilih kurikulum Python-Explorer atau Scratch-Explorer",
      reviewedAt: new Date(),
    },
  });
  console.log("✓ Request classes created");

  // === TUTOR SLOTS (1-hour slots, hanya dalam range yg diizinkan) ===
  async function createDefaultSlots(tutorId: string) {
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const data: { tutorId: string; dayOfWeek: string; startTime: string; endTime: string }[] = [];

    for (let d = 0; d < 7; d++) {
      const isWeekend = d >= 5;
      const startHour = isWeekend ? 9 : 15;
      for (let h = startHour; h < 21; h++) {
        data.push({
          tutorId,
          dayOfWeek: days[d],
          startTime: `${String(h).padStart(2, "0")}:00`,
          endTime: `${String(h + 1).padStart(2, "0")}:00`,
        });
      }
    }

    await prisma.tutorSlot.createMany({ data });
    return data.length;
  }

  const budiSlots = await createDefaultSlots(tutor1.id);
  const sariSlots = await createDefaultSlots(tutor2.id);
  console.log(`✓ Tutor slots created (Budi: ${budiSlots}, Sari: ${sariSlots})`);

  // === BADGES ===
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        title: "First Code!",
        description: "Menyelesaikan coding pertama kali",
        imageUrl: "/badges/first-code.png",
        xpBonus: 50,
      },
    }),
    prisma.badge.create({
      data: {
        title: "7 Days Streak",
        description: "Belajar 7 hari berturut-turut",
        imageUrl: "/badges/streak-7.png",
        xpBonus: 100,
      },
    }),
    prisma.badge.create({
      data: {
        title: "Bug Hunter",
        description: "Berhasil memperbaiki bug pertama",
        imageUrl: "/badges/bug-hunter.png",
        xpBonus: 75,
      },
    }),
    prisma.badge.create({
      data: {
        title: "Code Master",
        description: "Menguasai 10 konsep coding",
        imageUrl: "/badges/code-master.png",
        xpBonus: 200,
      },
    }),
  ]);
  console.log("✓ Badges created");

  // === STUDENT BADGES ===
  await prisma.studentBadge.createMany({
    data: [
      { studentId: student1.id, badgeId: badges[0].id },
      { studentId: student1.id, badgeId: badges[1].id },
      { studentId: student2.id, badgeId: badges[0].id },
      { studentId: student2.id, badgeId: badges[1].id },
      { studentId: student2.id, badgeId: badges[2].id },
      { studentId: student3.id, badgeId: badges[0].id },
      { studentId: student3.id, badgeId: badges[1].id },
      { studentId: student3.id, badgeId: badges[2].id },
      { studentId: student3.id, badgeId: badges[3].id },
    ],
  });
  console.log("✓ Student badges created");

  await seedTopics(prisma, defaultAssessment, [kelas2, kelas3, kelas4, kelas5, kelas6]);
  await seedBatchScratchExplorer(prisma, defaultAssessment, [kelas2, kelas3, kelas4, kelas5, kelas6]);
  await seedBatchScratchExplorer2(prisma, defaultAssessment, [kelas2, kelas3, kelas4, kelas5, kelas6]);
  await seedPythonExplorer(prisma, defaultAssessment, [kelas5, kelas6, kelas7, kelas8, kelas9]);
  await seedCodeExplorer(prisma, defaultAssessment, [kelas1, kelas2, kelas3]);
  await seedBatchCodeExplorer(prisma, defaultAssessment, [kelas1, kelas2, kelas3]);
  await seedTrialClass(prisma, defaultAssessment, [kelas1, kelas2]);
  await seedTrialPython(prisma, defaultAssessment, [kelas6, kelas7, kelas8, kelas9]);

  // === ENROLLMENTS ===
  // Dito (student5) - unassigned enrollment for Python-Explorer
  const pythonExplorerCurriculum = await prisma.curriculum.findFirst({
    where: { name: "Python-Explorer" },
  });
  if (pythonExplorerCurriculum) {
    await prisma.enrollment.create({
      data: {
        studentId: student5.id,
        curriculumId: pythonExplorerCurriculum.id,
        totalMeetPurchased: 0,
        totalMeetLeft: 0,
      },
    });
    console.log("✓ Enrollment created (Dito → Python-Explorer)");
  }

  // === TUTOR COSTS ===
  await prisma.tutorCost.createMany({
    data: [
      { classType: "TRIAL", cost: 12000, description: "Biaya tutor untuk kelas Trial" },
      { classType: "BATCH810", cost: 20000, description: "Biaya tutor untuk kelas Batch 8-10 siswa" },
      { classType: "BATCH35", cost: 20000, description: "Biaya tutor untuk kelas Batch 3-5 siswa" },
      { classType: "PRIVATE", cost: 30000, description: "Biaya tutor untuk kelas Private" },
      { classType: "MAKEUP", cost: 20000, description: "Biaya tutor untuk kelas Make Up" },
    ],
  });
  console.log("✓ Tutor costs created");

  console.log("\n--- Seed Summary ---");
  console.log("Admin:       admin@lms.com");
  console.log("Tutors:      budi.tutor@lms.com, sari.tutor@lms.com");
  console.log("Parents:     andi.parent@lms.com, maya.parent@lms.com");
  console.log("Students:    rafa.student@lms.com, luna.student@lms.com,");
  console.log("             ardhi.student@lms.com, nisa.student@lms.com, dito.student@lms.com");
  console.log("Curriculums: Code-Explorer (Kelas 1-3), Batch-Code-Explorer (Kelas 1-3), Scratch-Explorer (Kelas 2-6), Batch-Scratch-Explorer (Kelas 2-6), Batch-Scratch-Explorer-2 (Kelas 2-6), Python-Explorer (Kelas 5-9), Trial Class K-2 (Kelas 1-2), Trial Python 6-9 (Kelas 6-9)");
  console.log("Password:    password123 (all accounts)");
  console.log("--------------------\n");
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
