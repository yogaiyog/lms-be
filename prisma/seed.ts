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
          category: "JUNIOR_I",
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
          category: "JUNIOR_II",
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
          category: "JUNIOR_III",
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
          category: "JUNIOR_I",
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
      studentProfile: {
        create: {
          parentId: parent2.id,
          fullName: "Dito Saputra",
          nickname: "Dito",
          birthDate: new Date("2015-06-20"),
          category: "JUNIOR_II",
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

  // === CURRICULUMS (by category) ===
  const scratchTopics = [
    { title: "Apa itu Coding? & Pengenalan Scratch", materialLink: "https://docs.google.com/presentation/d/scratch1", exampleProjectLink: "https://scratch.mit.edu/projects/example1", goals: "Memahami konsep dasar coding dan interface Scratch", tools: "Browser, Scratch Editor" },
    { title: "Gerakan Dasar & Koordinat", materialLink: "https://docs.google.com/presentation/d/scratch2", exampleProjectLink: "https://scratch.mit.edu/projects/example2", goals: "Mengerti sistem koordinat dan blok gerakan", tools: "Scratch Editor" },
    { title: "Event & Trigger", materialLink: "https://docs.google.com/presentation/d/scratch3", exampleProjectLink: "https://scratch.mit.edu/projects/example3", goals: "Memahami event-driven programming", tools: "Scratch Editor" },
    { title: "Variable & Data", materialLink: "https://docs.google.com/presentation/d/scratch4", exampleProjectLink: "https://scratch.mit.edu/projects/example4", goals: "Mengerti konsep variable dan penggunaannya", tools: "Scratch Editor" },
    { title: "Looping: Ulangi & Forever", materialLink: "https://docs.google.com/presentation/d/scratch5", exampleProjectLink: "https://scratch.mit.edu/projects/example5", goals: "Memahami perulangan dalam Scratch", tools: "Scratch Editor" },
    { title: "Conditional: If-Then-Else", materialLink: "https://docs.google.com/presentation/d/scratch6", exampleProjectLink: "https://scratch.mit.edu/projects/example6", goals: "Memahami percabangan dalam Scratch", tools: "Scratch Editor" },
    { title: "Animasi Sederhana", materialLink: "https://docs.google.com/presentation/d/scratch7", exampleProjectLink: "https://scratch.mit.edu/projects/example7", goals: "Membuat animasi dengan costume dan backdrop", tools: "Scratch Editor" },
    { title: "Suara & Multimedia", materialLink: "https://docs.google.com/presentation/d/scratch8", exampleProjectLink: "https://scratch.mit.edu/projects/example8", goals: "Menambahkan suara dan efek multimedia", tools: "Scratch Editor" },
    { title: "Game Sederhana: Catch Game", materialLink: "https://docs.google.com/presentation/d/scratch9", exampleProjectLink: "https://scratch.mit.edu/projects/example9", goals: "Membuat game tangkap objek", tools: "Scratch Editor" },
    { title: "Game: Maze Runner", materialLink: "https://docs.google.com/presentation/d/scratch10", exampleProjectLink: "https://scratch.mit.edu/projects/example10", goals: "Membuat game labirin dengan timer", tools: "Scratch Editor" },
    { title: "Project Akhir: Animasi Cerita", materialLink: "https://docs.google.com/presentation/d/scratch11", exampleProjectLink: "https://scratch.mit.edu/projects/example11", goals: "Membuat animasi cerita interaktif", tools: "Scratch Editor" },
    { title: "Presentasi & Sharing Project", materialLink: "https://docs.google.com/presentation/d/scratch12", exampleProjectLink: null, goals: "Mempresentasikan project ke teman-teman", tools: "Scratch Editor, Zoom" },
  ];

  const pythonTopics = [
    { title: "Apa itu Python? & Instalasi", materialLink: "https://docs.google.com/presentation/d/py1", exampleProjectLink: "https://github.com/example/python1", goals: "Menginstall Python dan menjalankan program pertama", tools: "Python, VS Code" },
    { title: "Variable & Tipe Data", materialLink: "https://docs.google.com/presentation/d/py2", exampleProjectLink: "https://github.com/example/python2", goals: "Memahami tipe data: string, integer, float, boolean", tools: "Python, VS Code" },
    { title: "Input, Output & String Manipulation", materialLink: "https://docs.google.com/presentation/d/py3", exampleProjectLink: "https://github.com/example/python3", goals: "Membuat program interaktif dengan input/output", tools: "Python, VS Code" },
    { title: "List & Tuple", materialLink: "https://docs.google.com/presentation/d/py4", exampleProjectLink: "https://github.com/example/python4", goals: "Memahami struktur data list dan tuple", tools: "Python, VS Code" },
    { title: "Dictionary & Set", materialLink: "https://docs.google.com/presentation/d/py5", exampleProjectLink: "https://github.com/example/python5", goals: "Memahami dictionary dan set", tools: "Python, VS Code" },
    { title: "Loop: For & While", materialLink: "https://docs.google.com/presentation/d/py6", exampleProjectLink: "https://github.com/example/python6", goals: "Memahami perulangan for dan while", tools: "Python, VS Code" },
    { title: "Conditionals: If-Elif-Else", materialLink: "https://docs.google.com/presentation/d/py7", exampleProjectLink: "https://github.com/example/python7", goals: "Membuat program dengan percabangan", tools: "Python, VS Code" },
    { title: "Functions", materialLink: "https://docs.google.com/presentation/d/py8", exampleProjectLink: "https://github.com/example/python8", goals: "Membuat dan menggunakan fungsi", tools: "Python, VS Code" },
    { title: "Error Handling & Debugging", materialLink: "https://docs.google.com/presentation/d/py9", exampleProjectLink: "https://github.com/example/python9", goals: "Memahami try-except dan debugging", tools: "Python, VS Code" },
    { title: "File I/O", materialLink: "https://docs.google.com/presentation/d/py10", exampleProjectLink: "https://github.com/example/python10", goals: "Membaca dan menulis file", tools: "Python, VS Code" },
    { title: "Project: Calculator App", materialLink: "https://docs.google.com/presentation/d/py11", exampleProjectLink: "https://github.com/example/python11", goals: "Membuat aplikasi kalkulator", tools: "Python, VS Code" },
    { title: "Project Akhir: Simple Game", materialLink: "https://docs.google.com/presentation/d/py12", exampleProjectLink: "https://github.com/example/python12", goals: "Membuat game sederhana dengan Python", tools: "Python, VS Code" },
  ];

  const webTopics = [
    { title: "How Internet Works & Web Basics", materialLink: "https://docs.google.com/presentation/d/web1", exampleProjectLink: "https://github.com/example/web1", goals: "Memahami cara kerja internet dan web", tools: "Browser, VS Code" },
    { title: "HTML Fundamentals: Tags & Structure", materialLink: "https://docs.google.com/presentation/d/web2", exampleProjectLink: "https://github.com/example/web2", goals: "Membuat struktur halaman HTML dasar", tools: "VS Code, Browser" },
    { title: "HTML Forms & Tables", materialLink: "https://docs.google.com/presentation/d/web3", exampleProjectLink: "https://github.com/example/web3", goals: "Membuat form dan tabel HTML", tools: "VS Code, Browser" },
    { title: "CSS Fundamentals: Selectors & Properties", materialLink: "https://docs.google.com/presentation/d/web4", exampleProjectLink: "https://github.com/example/web4", goals: "Memahami CSS selectors dan properties", tools: "VS Code, Browser" },
    { title: "CSS Box Model & Layout", materialLink: "https://docs.google.com/presentation/d/web5", exampleProjectLink: "https://github.com/example/web5", goals: "Memahami box model, margin, padding, border", tools: "VS Code, Browser" },
    { title: "CSS Flexbox", materialLink: "https://docs.google.com/presentation/d/web6", exampleProjectLink: "https://github.com/example/web6", goals: "Layout dengan Flexbox", tools: "VS Code, Browser" },
    { title: "CSS Grid", materialLink: "https://docs.google.com/presentation/d/web7", exampleProjectLink: "https://github.com/example/web7", goals: "Layout dengan CSS Grid", tools: "VS Code, Browser" },
    { title: "Responsive Design & Media Queries", materialLink: "https://docs.google.com/presentation/d/web8", exampleProjectLink: "https://github.com/example/web8", goals: "Membuat website responsive", tools: "VS Code, Browser" },
    { title: "CSS Animations & Transitions", materialLink: "https://docs.google.com/presentation/d/web9", exampleProjectLink: "https://github.com/example/web9", goals: "Menambahkan animasi CSS", tools: "VS Code, Browser" },
    { title: "Git & GitHub Basics", materialLink: "https://docs.google.com/presentation/d/web10", exampleProjectLink: "https://github.com/example/web10", goals: "Mengenal Git untuk version control", tools: "Git, GitHub, VS Code" },
    { title: "Project: Landing Page", materialLink: "https://docs.google.com/presentation/d/web11", exampleProjectLink: "https://github.com/example/web11", goals: "Membuat landing page responsif", tools: "VS Code, Browser, Git" },
    { title: "Project Akhir: Portfolio Website", materialLink: "https://docs.google.com/presentation/d/web12", exampleProjectLink: "https://github.com/example/web12", goals: "Membuat website portfolio pribadi", tools: "VS Code, Browser, Git, GitHub Pages" },
  ];

  const curriculumJunior1 = await prisma.curriculum.create({
    data: {
      category: "JUNIOR_I",
      name: "Scratch Junior",
      topics: {
        create: scratchTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });

  const curriculumJunior2 = await prisma.curriculum.create({
    data: {
      category: "JUNIOR_II",
      name: "Python Explorer",
      topics: {
        create: pythonTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });

  const curriculumJunior3 = await prisma.curriculum.create({
    data: {
      category: "JUNIOR_III",
      name: "Web Dev Warrior",
      topics: {
        create: webTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });
  console.log("✓ Curriculums & Topics created");

  // === CLASSES ===
  const class1 = await prisma.class.create({
    data: {
      name: "Scratch Junior - Batch 4",
      category: "JUNIOR_I",
      tutorId: tutor1.id,
      curriculumId: curriculumJunior1.id,
      batch: 4,
      isActive: true,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Python Explorer - Batch 2",
      category: "JUNIOR_II",
      tutorId: tutor2.id,
      curriculumId: curriculumJunior2.id,
      batch: 2,
      isActive: true,
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: "Web Dev Warrior - Batch 1",
      category: "JUNIOR_III",
      tutorId: tutor1.id,
      curriculumId: curriculumJunior3.id,
      batch: 1,
      isActive: true,
    },
  });
  console.log("✓ Classes created");

  // === ENROLLMENTS ===
  await prisma.enrollment.createMany({
    data: [
      { studentId: student1.id, classId: class1.id, totalMeetPurchased: 4, totalMeetLeft: 4 },
      { studentId: student4.id, classId: class1.id, totalMeetPurchased: 8, totalMeetLeft: 8 },
      { studentId: student2.id, classId: class2.id, totalMeetPurchased: 4, totalMeetLeft: 4 },
      { studentId: student3.id, classId: class3.id, totalMeetPurchased: 4, totalMeetLeft: 4 },
    ],
  });
  console.log("✓ Enrollments created");

  // === REQUEST CLASS ===
  // Dito (student5) - baru daftar, belum punya kelas, status PENDING
  await prisma.requestClass.create({
    data: {
      studentId: student5.id,
      parentId: parent2.id,
      category: student5.category,
      curriculum: "Python Explorer",
      days: JSON.stringify(["TUESDAY", "THURSDAY"]),
      startTime: "15:00",
      endTime: "16:30",
      sessionCount: 2,
      preferredTutorId: tutor2.id,
      notes: "Dito pernah belajar Python dasar di sekolah, ingin melanjutkan",
      status: "PENDING",
    },
  });

  // Nisa (student4) - sudah punya kelas (class1), request ganti jadwal via prevClassId
  await prisma.requestClass.create({
    data: {
      studentId: student4.id,
      parentId: parent2.id,
      prevClassId: class1.id,
      category: student4.category,
      curriculum: "Scratch Adventurer",
      days: JSON.stringify(["SATURDAY"]),
      startTime: "13:00",
      endTime: "14:30",
      sessionCount: 1,
      notes: "Minta pindah hari Sabtu karena kegiatan sekolah hari Rabu",
      status: "PENDING",
    },
  });

  // Luna (student2) - requestnya sudah di-APPROVED & diassign ke class2
  await prisma.requestClass.create({
    data: {
      studentId: student2.id,
      parentId: parent1.id,
      category: student2.category,
      curriculum: "Python Explorer",
      days: JSON.stringify(["SATURDAY"]),
      startTime: "10:30",
      endTime: "12:00",
      sessionCount: 1,
      notes: "Luna tertarik dengan coding Python",
      status: "APPROVED",
      approvedClassId: class2.id,
      adminNotes: "Dimasukkan ke Python Explorer - Batch 2",
      reviewedAt: new Date(),
    },
  });

  // Ardhi (student3) - requestnya di-REJECTED
  await prisma.requestClass.create({
    data: {
      studentId: student3.id,
      parentId: parent2.id,
      category: student3.category,
      curriculum: "Mobile App Development",
      days: JSON.stringify(["SUNDAY"]),
      startTime: "09:00",
      endTime: "11:00",
      sessionCount: 1,
      notes: "Ardhi ingin belajar bikin aplikasi Android",
      status: "REJECTED",
      adminNotes: "Mohon maaf, kurikulum Mobile App Development belum tersedia. Silakan pilih kurikulum Web Dev Warrior atau Python Explorer",
      reviewedAt: new Date(),
    },
  });
  console.log("✓ Request classes created");

  // === SCHEDULES ===
  function nextDate(dayOfWeek: string, weeksFromNow = 0): Date {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const target = days.indexOf(dayOfWeek);
    const today = new Date();
    const current = today.getDay();
    let diff = target - current;
    if (diff <= 0) diff += 7;
    const d = new Date(today);
    d.setDate(d.getDate() + diff + weeksFromNow * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const schedule1 = await prisma.schedule.create({
    data: {
      classId: class1.id,
      dayOfWeek: "SATURDAY",
      startTime: "09:00",
      endTime: "10:30",
      meetLink: "https://meet.google.com/abc-defg-hij",
      topic: curriculumJunior1.topics[0].title,
      topicId: curriculumJunior1.topics[0].id,
      date: nextDate("SATURDAY"),
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      classId: class1.id,
      dayOfWeek: "WEDNESDAY",
      startTime: "15:00",
      endTime: "16:00",
      meetLink: "https://meet.google.com/xyz-uvwx-rst",
      topic: curriculumJunior1.topics[3].title,
      topicId: curriculumJunior1.topics[3].id,
      date: nextDate("WEDNESDAY"),
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      classId: class2.id,
      dayOfWeek: "SATURDAY",
      startTime: "10:30",
      endTime: "12:00",
      meetLink: "https://meet.google.com/jkl-mnop-qrs",
      topic: curriculumJunior2.topics[5].title,
      topicId: curriculumJunior2.topics[5].id,
      date: nextDate("SATURDAY"),
    },
  });

  const schedule4 = await prisma.schedule.create({
    data: {
      classId: class3.id,
      dayOfWeek: "SUNDAY",
      startTime: "13:00",
      endTime: "15:00",
      meetLink: "https://meet.google.com/tuv-wxya-bcd",
      topic: curriculumJunior3.topics[1].title,
      topicId: curriculumJunior3.topics[1].id,
      date: nextDate("SUNDAY"),
    },
  });
  console.log("✓ Schedules created");

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
  console.log("             ardhi.student@lms.com, nisa.student@lms.com, dito.student@lms.com");
  console.log("Curriculums: Scratch Junior - JUNIOR_I (12 topics), Python Explorer - JUNIOR_II (12 topics), Web Dev Warrior - JUNIOR_III (12 topics)");
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
