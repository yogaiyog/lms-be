/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  const designAssessment = await prisma.assessmentSet.create({
    data: {
      name: "Design & Creativity Assessment",
      description: "Penilaian kreativitas dan desain untuk siswa design course",
      aspects: {
        create: [
          { title: "Kreativitas", description: "Originalitas dan ide kreatif dalam karya", minScore: 1, maxScore: 5, order: 1 },
          { title: "Pemahaman Konsep Desain", description: "Memahami elemen dan prinsip desain", minScore: 1, maxScore: 5, order: 2 },
          { title: "Penggunaan Warna", description: "Kemampuan memilih dan mengombinasikan warna", minScore: 1, maxScore: 5, order: 3 },
          { title: "Komposisi & Tata Letak", description: "Penataan elemen dalam halaman/karya", minScore: 1, maxScore: 5, order: 4 },
          { title: "Kerapian & Detail", description: "Ketelitian dan kerapian dalam pengerjaan", minScore: 1, maxScore: 5, order: 5 },
          { title: "Kemandirian", description: "Mampu mengerjakan tanpa banyak bantuan", minScore: 1, maxScore: 5, order: 6 },
          { title: "Kelengkapan Project", description: "Project diselesaikan sesuai ketentuan", minScore: 1, maxScore: 5, order: 7 },
          { title: "Presentasi", description: "Kemampuan mempresentasikan hasil karya", minScore: 1, maxScore: 5, order: 8 },
        ],
      },
    },
    include: { aspects: true },
  });
  console.log(`✓ Assessment set created: ${designAssessment.name} (${designAssessment.aspects.length} aspects)`);

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
      name: "Scratch Junior",
      assessmentSetId: defaultAssessment.id,
      categories: {
        create: [
          { categoryId: kelas1.id },
          { categoryId: kelas2.id },
          { categoryId: kelas3.id },
        ],
      },
      topics: {
        create: scratchTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });

  const curriculumJunior2 = await prisma.curriculum.create({
    data: {
      name: "Python Explorer",
      assessmentSetId: defaultAssessment.id,
      categories: {
        create: [
          { categoryId: kelas4.id },
          { categoryId: kelas5.id },
          { categoryId: kelas6.id },
        ],
      },
      topics: {
        create: pythonTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });

  const curriculumJunior3 = await prisma.curriculum.create({
    data: {
      name: "Web Dev Warrior",
      assessmentSetId: defaultAssessment.id,
      categories: {
        create: [
          { categoryId: kelas7.id },
          { categoryId: kelas8.id },
          { categoryId: kelas9.id },
        ],
      },
      topics: {
        create: webTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });
  console.log("✓ Curriculums & Topics created (Scratch, Python, Web)");

  const designTopics = [
    { title: "Apa itu Desain? & Pengenalan Warna", materialLink: "https://docs.google.com/presentation/d/des1", exampleProjectLink: "https://www.figma.com/community/file/example1", goals: "Memahami konsep dasar desain dan mengenal warna primer", tools: "Kertas, Pensil Warna, Canva" },
    { title: "Bentuk & Geometri Dasar", materialLink: "https://docs.google.com/presentation/d/des2", exampleProjectLink: "https://www.figma.com/community/file/example2", goals: "Mengenal bentuk dasar (lingkaran, segitiga, persegi) dalam desain", tools: "Kertas, Penggaris, Canva" },
    { title: "Warna-warni: Color Wheel & Harmoni", materialLink: "https://docs.google.com/presentation/d/des3", exampleProjectLink: "https://www.figma.com/community/file/example3", goals: "Memahami color wheel dan harmoni warna (analog, komplementer)", tools: "Canva, Color Picker" },
    { title: "Tipografi: Seni Menulis", materialLink: "https://docs.google.com/presentation/d/des4", exampleProjectLink: "https://www.figma.com/community/file/example4", goals: "Mengenal jenis-jenis font dan cara memadukannya", tools: "Canva, Google Fonts" },
    { title: "Komposisi & Tata Letak", materialLink: "https://docs.google.com/presentation/d/des5", exampleProjectLink: "https://www.figma.com/community/file/example5", goals: "Memahami rule of thirds, keseimbangan, dan hierarki visual", tools: "Canva, Figma" },
    { title: "Gambar Digital: Tools Dasar", materialLink: "https://docs.google.com/presentation/d/des6", exampleProjectLink: "https://www.figma.com/community/file/example6", goals: "Mengenal tools menggambar digital dan basic shapes", tools: "Figma, Canva" },
    { title: "Layering & Grouping", materialLink: "https://docs.google.com/presentation/d/des7", exampleProjectLink: "https://www.figma.com/community/file/example7", goals: "Memahami konsep layer, grouping, dan ordering", tools: "Figma, Canva" },
    { title: "Bayangan & Efek", materialLink: "https://docs.google.com/presentation/d/des8", exampleProjectLink: "https://www.figma.com/community/file/example8", goals: "Menambahkan shadow, gradient, dan efek visual", tools: "Figma, Canva" },
    { title: "Desain Karakter Sederhana", materialLink: "https://docs.google.com/presentation/d/des9", exampleProjectLink: "https://www.figma.com/community/file/example9", goals: "Membuat karakter kartun sederhana dengan bentuk dasar", tools: "Figma, Kertas" },
    { title: "Desain Poster & Flyer", materialLink: "https://docs.google.com/presentation/d/des10", exampleProjectLink: "https://www.figma.com/community/file/example10", goals: "Membuat poster digital dengan komposisi yang baik", tools: "Canva, Figma" },
    { title: "Project: Kartu Ucapan Digital", materialLink: "https://docs.google.com/presentation/d/des11", exampleProjectLink: "https://www.figma.com/community/file/example11", goals: "Membuat kartu ucapan interaktif untuk hari spesial", tools: "Canva, Figma" },
    { title: "Presentasi Portfolio Design", materialLink: "https://docs.google.com/presentation/d/des12", exampleProjectLink: null, goals: "Menyusun dan mempresentasikan portfolio karya desain", tools: "Canva, Figma, Zoom" },
  ];

  const curriculumJuniorDesign = await prisma.curriculum.create({
    data: {
      name: "Design & Kreativitas",
      assessmentSetId: designAssessment.id,
      categories: {
        create: [
          { categoryId: kelas1.id },
          { categoryId: kelas2.id },
          { categoryId: kelas3.id },
        ],
      },
      topics: {
        create: designTopics.map((t, i) => ({ ...t, order: i })),
      },
    },
    include: { topics: true },
  });
  console.log("✓ Curriculum created: Design & Kreativitas (Kelas 1-3, 12 topics, with dedicated assessment set)");

  // === CLASSES ===
  function classStartDate(dayOfWeek: string, weeksAgo: number): Date {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const target = days.indexOf(dayOfWeek);
    const today = new Date();
    const current = today.getDay();
    let diff = target - current;
    if (diff <= 0) diff += 7;
    const d = new Date(today);
    d.setDate(d.getDate() + diff - weeksAgo * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const class1 = await prisma.class.create({
    data: {
      name: "Scratch Junior - Batch 4",
      categoryId: kelas1.id,
      tutors: { connect: [{ id: tutor1.id }] },
      curriculumId: curriculumJunior1.id,
      batch: 4,
      startDate: classStartDate("SATURDAY", 4),
      isActive: true,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Python Explorer - Batch 2",
      categoryId: kelas4.id,
      tutors: { connect: [{ id: tutor2.id }] },
      curriculumId: curriculumJunior2.id,
      batch: 2,
      startDate: classStartDate("SATURDAY", 4),
      isActive: true,
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: "Web Dev Warrior - Batch 1",
      categoryId: kelas7.id,
      tutors: { connect: [{ id: tutor1.id }] },
      curriculumId: curriculumJunior3.id,
      batch: 1,
      startDate: classStartDate("SUNDAY", 4),
      isActive: true,
    },
  });
  console.log("✓ Classes created (Scratch, Python, Web)");

  const classDesign = await prisma.class.create({
    data: {
      name: "Design & Kreativitas - Batch 1",
      categoryId: kelas1.id,
      tutors: { connect: [{ id: tutor2.id }] },
      curriculumId: curriculumJuniorDesign.id,
      batch: 1,
      startDate: classStartDate("WEDNESDAY", 3),
      isActive: true,
    },
  });
  console.log("✓ Class created: Design & Kreativitas - Batch 1");

  // === REQUEST CLASS ===
  // Dito (student5) - baru daftar, belum punya kelas, status PENDING
  await prisma.requestClass.create({
    data: {
      studentId: student5.id,
      parentId: parent2.id,
      category: "JUNIOR_II",
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
      category: "JUNIOR_I",
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
      category: "JUNIOR_II",
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
      category: "JUNIOR_III",
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
  async function createFullSchedules(
    cls: { id: string; startDate: Date },
    curriculum: { topics: { id: string; title: string; order: number }[] },
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    meetLink: string,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sorted = [...curriculum.topics].sort((a, b) => a.order - b.order);
    const schedules: Awaited<ReturnType<typeof prisma.schedule.create>>[] = [];
    for (const [i, topic] of sorted.entries()) {
      const date = new Date(cls.startDate);
      date.setDate(date.getDate() + i * 7);
      const isDone = date < today;
      const sched = await prisma.schedule.create({
        data: {
          classId: cls.id,
          dayOfWeek,
          startTime,
          endTime,
          meetLink,
          topic: topic.title,
          topicId: topic.id,
          date,
          isDone,
        },
      });
      schedules.push(sched);
    }
    return schedules;
  }

  const schedules1 = await createFullSchedules(class1, curriculumJunior1, "SATURDAY", "09:00", "09:55", "https://meet.google.com/abc-defg-hij");
  const schedules2 = await createFullSchedules(class2, curriculumJunior2, "SATURDAY", "10:30", "11:25", "https://meet.google.com/jkl-mnop-qrs");
  const schedules3 = await createFullSchedules(class3, curriculumJunior3, "SUNDAY", "13:00", "13:55", "https://meet.google.com/tuv-wxya-bcd");
  const schedulesDesign = await createFullSchedules(classDesign, curriculumJuniorDesign, "WEDNESDAY", "15:00", "15:55", "https://meet.google.com/des-abc-def");

  const doneTotal = schedules1.filter(s => s.isDone).length
    + schedules2.filter(s => s.isDone).length
    + schedules3.filter(s => s.isDone).length
    + schedulesDesign.filter(s => s.isDone).length;
  const futureTotal = (12 * 4) - doneTotal;
  console.log(`✓ Schedules created (${doneTotal} past ✅, ${futureTotal} future ⏳)`);

  // === ENROLLMENTS (berdasar done count aktual) ===
  const doneCount1 = schedules1.filter(s => s.isDone).length;
  const doneCount2 = schedules2.filter(s => s.isDone).length;
  const doneCount3 = schedules3.filter(s => s.isDone).length;
  const doneCountDesign = schedulesDesign.filter(s => s.isDone).length;

  await prisma.enrollment.createMany({
    data: [
      { studentId: student1.id, classId: class1.id, curriculumId: curriculumJunior1.id, totalMeetPurchased: 12, totalMeetLeft: 12 - doneCount1, verified: true },
      { studentId: student4.id, classId: class1.id, curriculumId: curriculumJunior1.id, totalMeetPurchased: 12, totalMeetLeft: 12 - doneCount1, verified: true },
      { studentId: student2.id, classId: class2.id, curriculumId: curriculumJunior2.id, totalMeetPurchased: 12, totalMeetLeft: 12 - doneCount2, verified: true },
      { studentId: student3.id, classId: class3.id, curriculumId: curriculumJunior3.id, totalMeetPurchased: 12, totalMeetLeft: 12 - doneCount3, verified: true },
      { studentId: student1.id, classId: classDesign.id, curriculumId: curriculumJuniorDesign.id, totalMeetPurchased: 12, totalMeetLeft: 12 - doneCountDesign, verified: true },
    ],
  });
  console.log("✓ Enrollments created");

  await prisma.enrollment.createMany({
    data: [
      { studentId: student5.id, curriculumId: curriculumJunior2.id, totalMeetPurchased: 0, totalMeetLeft: 0 },
      { studentId: student4.id, curriculumId: curriculumJuniorDesign.id, totalMeetPurchased: 0, totalMeetLeft: 0 },
    ],
  });
  console.log("✓ Unassigned enrollments created (waiting for class assignment)");

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

  // === ATTENDANCES & ASSESSMENTS ===
  function pickScores(guaranteedTotal: number, min = 1, max = 5): number[] {
    const aspects = defaultAssessment.aspects.sort((a, b) => a.order - b.order);
    const count = aspects.length;
    let scores = aspects.map(() => Math.floor(Math.random() * (max - min + 1)) + min);
    const current = scores.reduce((s, v) => s + v, 0);
    let diff = guaranteedTotal - current;
    while (diff !== 0) {
      for (let i = 0; i < count && diff !== 0; i++) {
        if (diff > 0 && scores[i] < max) { scores[i]++; diff--; }
        else if (diff < 0 && scores[i] > min) { scores[i]--; diff++; }
      }
      if (diff > 0) { scores[0] = Math.min(max, scores[0] + diff); break; }
      if (diff < 0) { scores[0] = Math.max(min, scores[0] + diff); break; }
    }
    return scores;
  }

  async function createAssessment(attendanceId: string, totalScore: number, mentorComment: string) {
    const scores = pickScores(totalScore);
    const assessment = await prisma.attendanceAssessment.create({
      data: {
        attendanceId,
        totalScore,
        percentage: Math.round((totalScore / (defaultAssessment.aspects.length * 5)) * 100),
        mentorComment,
        scores: {
          create: defaultAssessment.aspects.map((a, i) => ({
            aspectId: a.id,
            score: scores[i],
          })),
        },
      },
    });
    return assessment;
  }

  // ===== Past sessions (isDone: true) — all enrolled students have attendances =====

  // --- Class1 (Scratch Junior): 4 past sessions ---
  const class1Students = [
    { id: student1.id, name: "Rafa" },
    { id: student4.id, name: "Nisa" },
  ];
  const pastClass1Seed = [
    { statusRafa: "PRESENT" as const, notesRafa: "Sangat aktif di kelas!", scoreRafa: 45, commentRafa: "Rafa sangat antusias dan aktif. Kode cukup rapi, perlu lebih teliti di bagian koordinat.", statusNisa: "ABSENT" as const, notesNisa: null, scoreNisa: null, commentNisa: null },
    { statusRafa: "PRESENT" as const, notesRafa: "Berhasil menyelesaikan challenge", scoreRafa: 43, commentRafa: "Challenge selesai dengan baik. Kreativitas bagus, kemandirian meningkat.", statusNisa: "LATE" as const, notesNisa: "Terlambat 5 menit, ketinggalan instruksi awal", scoreNisa: 30, commentNisa: "Nisa terlambat dan ketinggalan penjelasan awal. Perlu disemangati untuk datang tepat waktu." },
    { statusRafa: "PRESENT" as const, notesRafa: "Mengerjakan dengan antusias", scoreRafa: 44, commentRafa: "Progres bagus, pemahaman variable meningkat.", statusNisa: "PRESENT" as const, notesNisa: "Mulai percaya diri", scoreNisa: 32, commentNisa: "Nisa mulai percaya diri, perlu lebih banyak latihan." },
    { statusRafa: "PRESENT" as const, notesRafa: "Game maze selesai!", scoreRafa: 46, commentRafa: "Game maze Rafa sangat kreatif. Logic looping sudah dipahami dengan baik.", statusNisa: "SICK" as const, notesNisa: "Sakit pilek", scoreNisa: null, commentNisa: null },
  ];
  for (let i = 0; i < doneCount1; i++) {
    const s = pastClass1Seed[i];
    const attRafa = await prisma.attendance.create({
      data: { scheduleId: schedules1[i].id, studentId: student1.id, date: schedules1[i].date, status: s.statusRafa, notes: s.notesRafa },
    });
    await createAssessment(attRafa.id, s.scoreRafa, s.commentRafa);

    const attNisa = await prisma.attendance.create({
      data: { scheduleId: schedules1[i].id, studentId: student4.id, date: schedules1[i].date, status: s.statusNisa, notes: s.notesNisa },
    });
    if (s.scoreNisa !== null) {
      await createAssessment(attNisa.id, s.scoreNisa, s.commentNisa!);
    }
  }

  // --- Class2 (Python Explorer): 4 past sessions ---
  const pastClass2Seed = [
    { status: "PRESENT" as const, notes: null, score: 47, comment: "Luna menunjukkan pemahaman yang sangat baik. Kode rapi dan terstruktur." },
    { status: "PRESENT" as const, notes: "Kode sangat rapi", score: 48, comment: "Kode sangat rapi, konsep dikuasai dengan baik. Kolaborasi dengan teman juga bagus." },
    { status: "PRESENT" as const, notes: "Mulai menguasai list", score: 45, comment: "Pemahaman tentang list dan tuple mulai kuat. Perlu lebih banyak latihan dictionary." },
    { status: "PRESENT" as const, notes: "Looping dikuasai", score: 46, comment: "Konsep looping sudah dikuasai. Project kalkulator berjalan dengan baik." },
  ];
  for (let i = 0; i < doneCount2; i++) {
    const s = pastClass2Seed[i];
    const att = await prisma.attendance.create({
      data: { scheduleId: schedules2[i].id, studentId: student2.id, date: schedules2[i].date, status: s.status, notes: s.notes },
    });
    await createAssessment(att.id, s.score, s.comment);
  }

  // --- Class3 (Web Dev Warrior): 4 past sessions ---
  const pastClass3Seed = [
    { status: "PRESENT" as const, notes: null, score: 42, comment: "Pemahaman konsep HTML/CSS cukup baik. Project landing page mulai rapi." },
    { status: "SICK" as const, notes: "Sakit flu", score: 30, comment: "Tidak hadir karena sakit. Tugas dikirim via WhatsApp dengan hasil cukup baik." },
    { status: "PRESENT" as const, notes: "CSS layout mulai dipahami", score: 40, comment: "Flexbox sudah mulai dipahami. Layout halaman mulai rapi." },
    { status: "PRESENT" as const, notes: "Responsive design selesai", score: 44, comment: "Media queries sudah diterapkan dengan baik. Website mulai responsif." },
  ];
  for (let i = 0; i < doneCount3; i++) {
    const s = pastClass3Seed[i];
    const att = await prisma.attendance.create({
      data: { scheduleId: schedules3[i].id, studentId: student3.id, date: schedules3[i].date, status: s.status, notes: s.notes },
    });
    await createAssessment(att.id, s.score, s.comment);
  }

  console.log(`✓ Attendances created for ${doneCount1 + doneCount2 + doneCount3} past sessions`);

  // --- Class Design: 3 past sessions for Rafa ---
  const pastDesignSeed = [
    { status: "PRESENT" as const, notes: "Rafa sangat suka menggambar karakter", score: 35, comment: "Rafa punya imajinasi bagus. Kombinasi warnanya cerah dan menarik. Perlu belajar rapi dalam membuat garis." },
    { status: "PRESENT" as const, notes: "Berhasil membuat kartu ucapan pertama", score: 38, comment: "Kartu ucapan Rafa kreatif dan penuh warna. Komposisi sudah cukup baik, typography perlu diperbaiki." },
    { status: "PRESENT" as const, notes: "Layering mulai dipahami", score: 36, comment: "Konsep layering dan grouping mulai dipahami. Desain karakter sederhana sudah lumayan." },
  ];
  for (let i = 0; i < doneCountDesign; i++) {
    const s = pastDesignSeed[i];
    const att = await prisma.attendance.create({
      data: { scheduleId: schedulesDesign[i].id, studentId: student1.id, date: schedulesDesign[i].date, status: s.status, notes: s.notes },
    });
    // Pakai assessment set design untuk class design
    const designAspects = designAssessment.aspects.sort((a, b) => a.order - b.order);
    const scores = pickScores(s.score);
    await prisma.attendanceAssessment.create({
      data: {
        attendanceId: att.id,
        totalScore: s.score,
        percentage: Math.round((s.score / (designAspects.length * 5)) * 100),
        mentorComment: s.comment,
        scores: {
          create: designAspects.map((a, i) => ({
            aspectId: a.id,
            score: scores[i],
          })),
        },
      },
    });
  }
  console.log(`✓ Design assessments created for ${doneCountDesign} past sessions`);

  // === MEET USAGES (track meet consumption) ===
  const pastAttendances = await prisma.attendance.findMany({
    where: { schedule: { isDone: true } },
    include: { schedule: { select: { date: true } } },
  });
  for (const att of pastAttendances) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: att.studentId, class: { schedules: { some: { id: att.scheduleId } } } },
    });
    if (enrollment) {
      await prisma.meetUsage.create({
        data: {
          enrollmentId: enrollment.id,
          scheduleId: att.scheduleId,
          studentId: att.studentId,
          attendanceId: att.id,
          date: att.schedule.date,
        },
      });
    }
  }
  console.log(`✓ Meet usages created for ${pastAttendances.length} attendances`);

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
      {
        classId: classDesign.id,
        tutorId: tutor2.id,
        title: "Selamat Datang di Design & Kreativitas!",
        content:
          "Halo semuanya! Selamat datang di kelas Design & Kreativitas Batch 1. Kita akan belajar tentang warna, bentuk, dan membuat karya desain keren. Siapkan alat gambar dan imajinasimu!",
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
  console.log("Curriculums: Scratch Junior - Kelas 1-3 (12 topics), Design & Kreativitas - Kelas 1-3 (12 topics), Python Explorer - Kelas 4-6 (12 topics), Web Dev Warrior - Kelas 7-9 (12 topics)");
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
