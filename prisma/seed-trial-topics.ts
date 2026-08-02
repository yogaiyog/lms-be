import { PrismaClient } from "@prisma/client";

export async function seedTrialClass(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const SCRATCH_GUI_URL =
    process.env.SCRATCH_GUI_URL ?? "http://localhost:8601";

  const trialTasks = [
    { code: "trial-1", label: "1", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-tutorial.html` },
    { code: "trial-2", label: "2", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-turn.html` },
    { code: "trial-3", label: "3", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-move-turn.html` },
    { code: "trial-4", label: "4", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/control-repeat.html` },
    { code: "trial-quiz", label: "Quiz", type: "QUIZ" as const, url: null },
    { code: "trial-capstone", label: "Capstone", type: "SCRATCH" as const, url: "https://scratch.mit.edu/projects/editor/", isCapstone: true },
  ];

  await prisma.studentTopicProgress.deleteMany();
  const existing = await prisma.curriculum.findMany({
    where: { name: "Trial Class K-2" },
    select: { id: true },
  });
  if (existing.length > 0) {
    await prisma.curriculum.deleteMany({
      where: { id: { in: existing.map((c) => c.id) } },
    });
  }

  const curriculum = await prisma.curriculum.create({
    data: {
      name: "Trial Class K-2",
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
          title: "Trial Topic",
          order: 0,
          goals: "Pengenalan dasar Scratch — motion, control, dan coding concept",
          tools: "Scratch Editor",
          exampleProjectLink: "https://scratch.mit.edu/projects/1365857435/",
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
      isCapstone: (task as { isCapstone?: boolean }).isCapstone ?? false,
    })),
  });

  const quizTask = await prisma.topicTask.findFirst({
    where: { code: "trial-quiz", topicId: topicRow.id },
  });

  if (quizTask) {
    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: [
            {
              question:
                "Blok {move (10) steps} membuat sprite bergerak sejauh 10 langkah ke arah mana?",
              choices: [
                {
                  content: "Ke arah hadap sprite saat itu",
                  isCorrect: true,
                  feedback:
                    "Benar! Move steps menggerakkan sprite maju sesuai arah hadapnya (direction).",
                },
                {
                  content:
                    "Ke kanan layar (sumbu X positif) tanpa peduli arah hadap",
                  isCorrect: false,
                  feedback:
                    "Move tidak selalu ke kanan. Coba putar sprite dulu dengan turn, lalu move — sprite akan bergerak ke arah yang berbeda.",
                },
                {
                  content: "Ke kiri layar (sumbu X negatif)",
                  isCorrect: false,
                  feedback:
                    "Move bergerak sesuai arah hadap, bukan selalu ke kiri.",
                },
              ],
            },
            {
              question:
                "Blok {repeat (10)} akan menjalankan isi di dalamnya sebanyak berapa kali?",
              choices: [
                {
                  content: "10 kali",
                  isCorrect: true,
                  feedback:
                    "Benar! Repeat (10) mengulang sebanyak 10 kali.",
                },
                {
                  content: "9 kali",
                  isCorrect: false,
                  feedback:
                    "Hampir, tetapi repeat (10) menghitung dari 1 sampai 10, jadi 10 kali.",
                },
                {
                  content: "Terus-menerus sampai dihentikan",
                  isCorrect: false,
                  feedback: "Itu 'forever', bukan 'repeat'.",
                },
              ],
            },
            {
              question: "Apa itu coding di Scratch?",
              choices: [
                {
                  content:
                    "Instruksi yang kita susun dari blok-blok warna-warni supaya sprite bisa bergerak, berbicara, atau bermain",
                  isCorrect: true,
                  feedback:
                    "Benar! Coding itu kayak memberi perintah ke sprite. Kamu tukang perintah, sprite pelaksana tugasnya!",
                },
                {
                  content: "Menggambar sprite dan background di canvas",
                  isCorrect: false,
                  feedback:
                    "Menggambar itu bagian dari desain, bukan coding. Coding itu blok-blok yang dikasih ke sprite.",
                },
                {
                  content:
                    "Menekan tombol hijau (green flag) berkali-kali",
                  isCorrect: false,
                  feedback:
                    "Green flag cuma untuk menjalankan program. Coding-nya sendiri adalah blok-blok yang sudah disusun.",
                },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for trial-quiz");
  }

  console.log(`✓ Trial Class K-2 curriculum seeded (${trialTasks.length} tasks, 1 quiz)`);
}
