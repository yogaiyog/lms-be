import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // === ADMIN ===
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@lms.com",
      password,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin created:", adminUser.email);

  // === TUTORS ===
  const tutor1User = await prisma.user.create({
    data: {
      email: "budi.tutor@lms.com",
      password,
      role: "TUTOR",
      tutorProfile: {
        create: {
          fullName: "Budi Santoso",
          phone: "081234567890",
          bio: "Tutor Scratch & Web Development untuk anak-anak",
          avatarUrl: null,
        },
      },
    },
  });

  const tutor2User = await prisma.user.create({
    data: {
      email: "sari.tutor@lms.com",
      password,
      role: "TUTOR",
      tutorProfile: {
        create: {
          fullName: "Sari Dewi",
          phone: "081234567891",
          bio: "Tutor Python & Game Development",
          avatarUrl: null,
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

  // === STUDENTS ===
  const student1User = await prisma.user.create({
    data: {
      email: "rafa.student@lms.com",
      password,
      role: "STUDENT",
      studentProfile: {
        create: {
          parentId: parent1.id,
          fullName: "Rafa Pratama",
          nickname: "Rafa",
          birthDate: new Date("2016-05-15"),
          category: "KIDS",
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
      studentProfile: {
        create: {
          parentId: parent1.id,
          fullName: "Luna Pratama",
          nickname: "Luna",
          birthDate: new Date("2014-08-20"),
          category: "JUNIOR_I",
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
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Ardhi Saputra",
          nickname: "Ardhi",
          birthDate: new Date("2012-03-10"),
          category: "JUNIOR_II",
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
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Nisa Saputra",
          nickname: "Nisa",
          birthDate: new Date("2017-11-05"),
          category: "KIDS",
          totalXp: 180,
          currentStreak: 2,
          lastActive: new Date(),
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

  // === CLASSES ===
  const class1 = await prisma.class.create({
    data: {
      name: "Scratch Adventurer - Batch 4",
      category: "KIDS",
      tutorId: tutor1.id,
      isActive: true,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Python Explorer - Batch 2",
      category: "JUNIOR_I",
      tutorId: tutor2.id,
      isActive: true,
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: "Web Dev Warrior - Batch 1",
      category: "JUNIOR_II",
      tutorId: tutor1.id,
      isActive: true,
    },
  });
  console.log("✓ Classes created");

  // === ENROLLMENTS ===
  await prisma.enrollment.createMany({
    data: [
      { studentId: student1.id, classId: class1.id },
      { studentId: student4.id, classId: class1.id },
      { studentId: student2.id, classId: class2.id },
      { studentId: student3.id, classId: class3.id },
    ],
  });
  console.log("✓ Enrollments created");

  // === SCHEDULES ===
  const schedule1 = await prisma.schedule.create({
    data: {
      classId: class1.id,
      dayOfWeek: "SATURDAY",
      startTime: "09:00",
      endTime: "10:30",
      meetLink: "https://meet.google.com/abc-defg-hij",
      topic: "Membuat Animasi Interaktif di Scratch",
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      classId: class1.id,
      dayOfWeek: "WEDNESDAY",
      startTime: "15:00",
      endTime: "16:00",
      meetLink: "https://meet.google.com/xyz-uvwx-rst",
      topic: "Quiz: Variabel dan Event",
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      classId: class2.id,
      dayOfWeek: "SATURDAY",
      startTime: "10:30",
      endTime: "12:00",
      meetLink: "https://meet.google.com/jkl-mnop-qrs",
      topic: "Loop dan Conditionals di Python",
    },
  });

  const schedule4 = await prisma.schedule.create({
    data: {
      classId: class3.id,
      dayOfWeek: "SUNDAY",
      startTime: "13:00",
      endTime: "15:00",
      meetLink: "https://meet.google.com/tuv-wxya-bcd",
      topic: "HTML & CSS Fundamentals",
    },
  });
  console.log("✓ Schedules created");

  // === ATTENDANCES ===
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  await prisma.attendance.createMany({
    data: [
      // Rafa attendances
      {
        scheduleId: schedule1.id,
        studentId: student1.id,
        date: twoWeeksAgo,
        status: "PRESENT",
        notes: "Sangat aktif di kelas!",
      },
      {
        scheduleId: schedule1.id,
        studentId: student1.id,
        date: lastWeek,
        status: "PRESENT",
        notes: "Berhasil menyelesaikan challenge",
      },
      {
        scheduleId: schedule2.id,
        studentId: student1.id,
        date: lastWeek,
        status: "LATE",
        notes: "Masuk 10 menit terlambat",
      },
      // Luna attendances
      {
        scheduleId: schedule3.id,
        studentId: student2.id,
        date: twoWeeksAgo,
        status: "PRESENT",
      },
      {
        scheduleId: schedule3.id,
        studentId: student2.id,
        date: lastWeek,
        status: "PRESENT",
        notes: "Kode sangat rapi",
      },
      // Ardhi attendances
      {
        scheduleId: schedule4.id,
        studentId: student3.id,
        date: twoWeeksAgo,
        status: "PRESENT",
      },
      {
        scheduleId: schedule4.id,
        studentId: student3.id,
        date: lastWeek,
        status: "SICK",
        notes: "Sakit flu",
      },
      // Nisa attendances
      {
        scheduleId: schedule1.id,
        studentId: student4.id,
        date: twoWeeksAgo,
        status: "ABSENT",
      },
      {
        scheduleId: schedule1.id,
        studentId: student4.id,
        date: lastWeek,
        status: "PRESENT",
        notes: "Mulai memahami konsep",
      },
    ],
  });
  console.log("✓ Attendances created");

  // === ANNOUNCEMENTS ===
  await prisma.announcement.createMany({
    data: [
      {
        classId: class1.id,
        tutorId: tutor1.id,
        title: "Selamat Datang di Scratch Adventurer!",
        content:
          "Halo semuanya! Selamat datang di kelas Scratch Adventurer Batch 4. Kita akan belajar membuat game dan animasi seru. Siapkan laptop dan semangat belajar!",
      },
      {
        classId: class2.id,
        tutorId: tutor2.id,
        title: "Jadwal Ujian Tengah Semester",
        content:
          "Ujian tengah semester akan diadakan minggu depan. Topik yang diuji: loop, conditionals, dan fungsi. Silakan review materi dari minggu 1-6.",
      },
      {
        classId: class3.id,
        tutorId: tutor1.id,
        title: "Project Pertama: Personal Website",
        content:
          "Untuk project pertama, kalian akan membuat personal website sederhana menggunakan HTML dan CSS. Deadline: 2 minggu dari sekarang.",
      },
    ],
  });
  console.log("✓ Announcements created");

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

  console.log("\n--- Seed Summary ---");
  console.log("Admin:       admin@lms.com");
  console.log("Tutors:      budi.tutor@lms.com, sari.tutor@lms.com");
  console.log("Parents:     andi.parent@lms.com, maya.parent@lms.com");
  console.log("Students:    rafa.student@lms.com, luna.student@lms.com,");
  console.log("             ardhi.student@lms.com, nisa.student@lms.com");
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
