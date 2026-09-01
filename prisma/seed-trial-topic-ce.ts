import { PrismaClient } from "@prisma/client";

export async function seedTrialCodeExplorer(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const trialTasks = [
    {
      code: "trial-ce-1",
      label: "1",
      type: "SCRATCH" as const,
      url: "https://studio.code.org/courses/pre-express-2025/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      isCapstone: false,
      autoComplete: true,
    },
    {
      code: "trial-ce-2",
      label: "2",
      type: "SCRATCH" as const,
      url: "https://studio.code.org/courses/pre-express-2025/units/1/lessons/2/levels/2?section_id=6590433&viewAs=Instructor",
      isCapstone: false,
      autoComplete: true,
    },
    {
      code: "trial-ce-quiz",
      label: "Quiz",
      type: "QUIZ" as const,
      url: null,
      isCapstone: false,
    },
  ];

  await prisma.studentTopicProgress.deleteMany();
  const existing = await prisma.curriculum.findMany({
    where: { name: "Trial Code Explorer K-3" },
    select: { id: true },
  });
  if (existing.length > 0) {
    await prisma.curriculum.deleteMany({
      where: { id: { in: existing.map((c) => c.id) } },
    });
  }

  const curriculum = await prisma.curriculum.create({
    data: {
      name: "Trial Code Explorer K-3",
      assessmentSetId: defaultAssessment.id,
      ...(categoryIds?.length
        ? {
            categories: {
              create: categoryIds.map((cat) => ({ categoryId: cat.id })),
            },
          }
        : {}),
      topics: {
        create: {
          title: "Trial Code Explorer Topic",
          order: 0,
          goals: "Pengenalan dasar logika drag-and-drop dan urutan langkah (sequencing) dengan Code.org",
          tools: "Browser, Code.org",
          exampleProjectLink: null,
        },
      },
    },
    include: { topics: true },
  });

  const topicRow = curriculum.topics[0];
  if (!topicRow) return;

  await prisma.topicTask.createMany({
    data: trialTasks.map((task, i) => ({
      topicId: topicRow.id,
      code: task.code,
      label: task.label,
      url: task.url,
      order: i,
      type: task.type,
      isCapstone: task.isCapstone ?? false,
      autoComplete: (task as { autoComplete?: boolean }).autoComplete ?? false,
    })),
  });

  const quizTask = await prisma.topicTask.findFirst({
    where: { code: "trial-ce-quiz", topicId: topicRow.id },
  });

  if (quizTask) {
    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: [
            {
              question: "Bagaimana cara menyusun balok perintah di Code.org?",
              choices: [
                {
                  content: "Tarik (drag) balok lalu tempelkan di bawah balok 'when run'",
                  isCorrect: true,
                  feedback: "Benar! Tarik balok perintah lalu tempelkan sampai menyatu.",
                },
                {
                  content: "Ketik teks yang panjang menggunakan keyboard",
                  isCorrect: false,
                  feedback: "Di Code.org kita menyusun balok visual dengan cara ditarik (drag & drop).",
                },
                {
                  content: "Hapus semua balok yang ada di layar",
                  isCorrect: false,
                  feedback: "Balok perintah harus dipasang agar karakter bisa bergerak.",
                },
              ],
            },
            {
              question: "Jika karakter perlu melangkah 2 kotak ke arah kanan, balok apa yang harus kita pasang?",
              choices: [
                {
                  content: "Pasang 2 balok panah kanan (East / Timur)",
                  isCorrect: true,
                  feedback: "Hebat! Setiap 1 balok panah kanan memajukan karakter 1 kotak ke arah kanan.",
                },
                {
                  content: "Pasang 1 balok panah atas (North / Utara)",
                  isCorrect: false,
                  feedback: "Panah atas membuat karakter bergerak ke atas, bukan ke kanan.",
                },
                {
                  content: "Pasang 2 balok panah kiri (West / Barat)",
                  isCorrect: false,
                  feedback: "Panah kiri membuat karakter melangkah mundur ke kiri.",
                },
              ],
            },
            {
              question: "Tombol apa yang kita klik untuk mencoba dan melihat apakah kode yang kita susun berhasil?",
              choices: [
                {
                  content: "Tombol 'Run' (Jalankan)",
                  isCorrect: true,
                  feedback: "Tepat sekali! Tombol Run akan menjalankan semua balok perintah yang sudah kamu pasang.",
                },
                {
                  content: "Tombol 'Reset' (Ulangi)",
                  isCorrect: false,
                  feedback: "Tombol Reset digunakan untuk mengembalikan posisi karakter kembali ke awal.",
                },
                {
                  content: "Tombol 'Tutup Browser'",
                  isCorrect: false,
                  feedback: "Jangan ditutup, klik tombol Run untuk mencoba programmu!",
                },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for trial-ce-quiz");
  }

  console.log(`✓ Trial Code Explorer K-3 curriculum seeded (${trialTasks.length} tasks, 1 quiz)`);
}
