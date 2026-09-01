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
    { code: "trial-2", label: "2", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-tutorial-2.html` },
    { code: "trial-3", label: "3", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-tutorial-3.html` },
    { code: "trial-4", label: "4", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-move-turn.html` },
    { code: "trial-5", label: "5", type: "SCRATCH" as const, url: `${SCRATCH_GUI_URL}/motion-tutorial-4.html` },
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
                "Jika kita memasukkan blok gerakan ke dalam blok {forever}, apa yang akan terjadi pada sprite?",
              choices: [
                {
                  content:
                    "Sprite akan bergerak terus-menerus tanpa berhenti sampai tombol stop ditekan",
                  isCorrect: true,
                  feedback:
                    "Benar! Blok forever akan mengulang perintah di dalamnya selamanya sampai program dihentikan.",
                },
                {
                  content:
                    "Sprite hanya bergerak satu kali lalu langsung berhenti",
                  isCorrect: false,
                  feedback:
                    "Bukan satu kali. Blok forever membuat aksi diulang terus-menerus tanpa henti.",
                },
                {
                  content: "Sprite akan langsung menghilang dari panggung",
                  isCorrect: false,
                  feedback:
                    "Forever tidak menyembunyikan sprite, melainkan mengulang instruksi gerakan di dalamnya.",
                },
              ],
            },
            {
              question:
                "Apa fungsi dari blok {if on edge, bounce} saat sprite sedang bergerak?",
              choices: [
                {
                  content:
                    "Membuat sprite memantul kembali ke dalam panggung saat menyentuh tepi layar",
                  isCorrect: true,
                  feedback:
                    "Tepat sekali! Blok if on edge bounce mencegah sprite keluar atau tembus dari layar panggung.",
                },
                {
                  content:
                    "Membuat sprite berhenti total ketika sampai di tepi layar",
                  isCorrect: false,
                  feedback:
                    "Bukan berhenti, melainkan memantul (bounce) dan berbalik arah kembali ke layar.",
                },
                {
                  content: "Mengubah warna sprite saat menabrak dinding",
                  isCorrect: false,
                  feedback:
                    "Blok ini hanya mengatur arah pantulan sprite, bukan mengganti warna kostum.",
                },
              ],
            },
            {
              question:
                "Bagaimana cara membuat arah sprite selalu mengikuti posisi kursor mouse pemain?",
              choices: [
                {
                  content:
                    "Menggunakan blok {point towards (mouse-pointer)} di dalam loop {forever}",
                  isCorrect: true,
                  feedback:
                    "Keren! Dengan point towards mouse-pointer di dalam forever, arah sprite akan terus memperbarui diri mengikuti mouse.",
                },
                {
                  content:
                    "Menggunakan blok {when space key pressed}",
                  isCorrect: false,
                  feedback:
                    "Blok tersebut hanya bereaksi ketika tombol spasi di keyboard ditekan, bukan mengikuti mouse.",
                },
                {
                  content:
                    "Mengubah ukuran sprite menjadi 200%",
                  isCorrect: false,
                  feedback:
                    "Mengubah ukuran hanya membuat sprite lebih besar, bukan mengarahkan sprite ke mouse.",
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
