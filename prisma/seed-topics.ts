import { PrismaClient } from "@prisma/client";

export async function seedTopics(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
) {
  const SCRATCH_GUI_URL =
    process.env.SCRATCH_GUI_URL ?? "http://localhost:8601";
  const scratchFundamentalUnits = [
    {
      id: "motion",
      title: "Motion Fundamental",
      projectId: "scratch-motion",
      materialLink: "https://canva.link/x0yr2fhd5di4ac3",
      levels: [
        { id: "m1", label: "1", url: `${SCRATCH_GUI_URL}/motion-tutorial.html`, type: "SCRATCH" as const },
        { id: "m2", label: "2", url: `${SCRATCH_GUI_URL}/motion-turn.html`, type: "SCRATCH" as const },
        { id: "m3", label: "3", url: `${SCRATCH_GUI_URL}/motion-move-turn.html`, type: "SCRATCH" as const },
        { id: "m-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "m4", label: "4", url: `${SCRATCH_GUI_URL}/motion-goto.html`, type: "SCRATCH" as const },
        { id: "m5", label: "5", url: `${SCRATCH_GUI_URL}/motion-glide.html`, type: "SCRATCH" as const },
        { id: "m6", label: "6", url: `${SCRATCH_GUI_URL}/motion-direction.html`, type: "SCRATCH" as const },
        { id: "m7", label: "7", url: `${SCRATCH_GUI_URL}/motion-complete.html`, type: "SCRATCH" as const },
      ],
      capstone: { id: "capstone-motion", url: "https://juaraku-neon.vercel.app/catch-the-bus" },
    },
    {
      id: "looks",
      title: "Looks Fundamental",
      projectId: "scratch-looks",
      materialLink: "https://canva.link/xivq43w0u1d39ni",
      levels: [
        { id: "l1", label: "1", url: `${SCRATCH_GUI_URL}/looks-say.html` },
        { id: "l2", label: "2", url: `${SCRATCH_GUI_URL}/looks-costume.html` },
        { id: "l3", label: "3", url: `${SCRATCH_GUI_URL}/looks-size.html` },
        { id: "l-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "l4", label: "4", url: `${SCRATCH_GUI_URL}/looks-effect.html` },
        { id: "l5", label: "5", url: `${SCRATCH_GUI_URL}/looks-layer.html` },
        { id: "l6", label: "6", url: `${SCRATCH_GUI_URL}/sound-basic.html` },
        { id: "l7", label: "7", url: `${SCRATCH_GUI_URL}/looks-sound-complete.html` },
      ],
      capstone: { id: "capstone-looks", url: "https://juaraku-neon.vercel.app/space-talk" },
    },
    {
      id: "event",
      title: "Event Driven Programming",
      projectId: "scratch-event",
      materialLink: "https://canva.link/sceg1ywo9srdpcy",
      levels: [
        { id: "e1", label: "1", url: `${SCRATCH_GUI_URL}/event-flag.html` },
        { id: "e2", label: "2", url: `${SCRATCH_GUI_URL}/event-click.html` },
        { id: "e3", label: "3", url: `${SCRATCH_GUI_URL}/event-keyboard.html` },
        { id: "e-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "e4", label: "4", url: `${SCRATCH_GUI_URL}/event-backdrop.html` },
        { id: "e5", label: "5", url: `${SCRATCH_GUI_URL}/event-broadcast.html` },
        { id: "e6", label: "6", url: `${SCRATCH_GUI_URL}/event-broadcastwait.html` },
        { id: "e7", label: "7", url: `${SCRATCH_GUI_URL}/event-complete.html` },
      ],
      capstone: { id: "capstone-event", url: "https://juaraku-neon.vercel.app/broadcasting-spells" },
    },
    {
      id: "variable",
      title: "Variable & List",
      projectId: "scratch-variable",
      materialLink: "https://canva.link/9bhf0nmavat0ks7",
      levels: [
        { id: "v1", label: "1", url: `${SCRATCH_GUI_URL}/variable-basic.html` },
        { id: "v2", label: "2", url: `${SCRATCH_GUI_URL}/variable-score.html` },
        { id: "v3", label: "3", url: `${SCRATCH_GUI_URL}/variable-health.html` },
        { id: "v-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "v4", label: "4", url: `${SCRATCH_GUI_URL}/variable-speed.html` },
        { id: "v5", label: "5", url: `${SCRATCH_GUI_URL}/variable-multivar.html` },
        { id: "v6", label: "6", url: `${SCRATCH_GUI_URL}/variable-list.html` },
        { id: "v7", label: "7", url: `${SCRATCH_GUI_URL}/variable-quiz.html` },
      ],
      capstone: { id: "capstone-variable", url: null },
    },
    {
      id: "control",
      title: "Control Loops",
      projectId: "scratch-control-loops",
      materialLink: "https://canva.link/9so0cvzxqyyughd",
      levels: [
        { id: "c1", label: "1", url: `${SCRATCH_GUI_URL}/control-repeat.html` },
        { id: "c2", label: "2", url: `${SCRATCH_GUI_URL}/control-forever.html` },
        { id: "c3", label: "3", url: `${SCRATCH_GUI_URL}/control-pattern.html` },
        { id: "c-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "c4", label: "4", url: `${SCRATCH_GUI_URL}/control-countdown.html` },
        { id: "c5", label: "5", url: `${SCRATCH_GUI_URL}/control-repeatuntil.html` },
        { id: "c6", label: "6", url: `${SCRATCH_GUI_URL}/control-foreverstop.html` },
        { id: "c7", label: "7", url: `${SCRATCH_GUI_URL}/control-complete.html` },
      ],
      capstone: { id: "capstone-control", url: "https://juaraku-neon.vercel.app/find-the-bug" },
    },
    {
      id: "debug",
      title: "Debugging",
      projectId: "scratch-debug",
      materialLink: "https://canva.link/bur63t7zpk5hiv7",
      levels: [
        { id: "d1", label: "1", url: `${SCRATCH_GUI_URL}/debug-motion.html` },
        { id: "d2", label: "2", url: `${SCRATCH_GUI_URL}/debug-looks-sound.html` },
        { id: "d3", label: "3", url: `${SCRATCH_GUI_URL}/debug-event.html` },
        { id: "d-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "d4", label: "4", url: `${SCRATCH_GUI_URL}/debug-loop.html` },
        { id: "d5", label: "5", url: `${SCRATCH_GUI_URL}/debug-conditional.html` },
        { id: "d6", label: "6", url: `${SCRATCH_GUI_URL}/debug-mixed.html` },
        { id: "d7", label: "7", url: `${SCRATCH_GUI_URL}/debug-complete.html` },
      ],
      capstone: { id: "capstone-debug", url: "https://juaraku-neon.vercel.app/next-customer-please" },
    },
    {
      id: "control-conditional",
      title: "Control Conditional",
      projectId: "scratch-control-conditional",
      materialLink: "https://canva.link/r2dfl6rd26tjr9a",
      levels: [
        { id: "cc1", label: "1", url: `${SCRATCH_GUI_URL}/control-if.html` },
        { id: "cc2", label: "2", url: `${SCRATCH_GUI_URL}/control-ifelse.html` },
        { id: "cc3", label: "3", url: `${SCRATCH_GUI_URL}/control-waituntil.html` },
        { id: "cc-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "cc4", label: "4", url: `${SCRATCH_GUI_URL}/control-condition.html` },
        { id: "cc5", label: "5", url: `${SCRATCH_GUI_URL}/control-clonebasic.html` },
        { id: "cc6", label: "6", url: `${SCRATCH_GUI_URL}/control-clonelifecycle.html` },
        { id: "cc7", label: "7", url: `${SCRATCH_GUI_URL}/control-conditional-complete.html` },
      ],
      capstone: { id: "capstone-control-conditional", url: "https://juaraku-neon.vercel.app/silly-eyes" },
    },
    {
      id: "control-mix",
      title: "Control Mix",
      projectId: "scratch-control-mix",
      materialLink: null,
      levels: [
        { id: "cm1", label: "1", url: `${SCRATCH_GUI_URL}/control-loopif.html` },
        { id: "cm2", label: "2", url: `${SCRATCH_GUI_URL}/control-foreverifelse.html` },
        { id: "cm3", label: "3", url: `${SCRATCH_GUI_URL}/control-start.html` },
        { id: "cm-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "cm4", label: "4", url: `${SCRATCH_GUI_URL}/control-clonerepeat.html` },
        { id: "cm5", label: "5", url: `${SCRATCH_GUI_URL}/control-cloneifelse.html` },
        { id: "cm6", label: "6", url: `${SCRATCH_GUI_URL}/control-counter.html` },
        { id: "cm7", label: "7", url: `${SCRATCH_GUI_URL}/control-mixcomplete.html` },
      ],
      capstone: { id: "capstone-control-mix", url: "https://juaraku-neon.vercel.app/grow-a-dragonfly" },
    },
    {
      id: "operator",
      title: "Operator - Matematika & Logika",
      projectId: "scratch-operator",
      materialLink: "https://canva.link/tx4ah3as1dgrveb",
      levels: [
        { id: "o1", label: "1", url: `${SCRATCH_GUI_URL}/operator-arithmetic.html` },
        { id: "o2", label: "2", url: `${SCRATCH_GUI_URL}/operator-comparison.html` },
        { id: "o3", label: "3", url: `${SCRATCH_GUI_URL}/operator-logic.html` },
        { id: "o-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "o4", label: "4", url: `${SCRATCH_GUI_URL}/operator-string.html` },
        { id: "o5", label: "5", url: `${SCRATCH_GUI_URL}/operator-math.html` },
        { id: "o6", label: "6", url: `${SCRATCH_GUI_URL}/operator-mixed.html` },
        { id: "o7", label: "7", url: `${SCRATCH_GUI_URL}/operator-complete.html` },
      ],
      capstone: { id: "capstone-operator", url: null },
    },
    {
      id: "clone",
      title: "Clone - Object Instancing",
      projectId: "scratch-clone",
      materialLink: "https://canva.link/rybbgio94k2i4si",
      levels: [
        { id: "cl1", label: "1", url: `${SCRATCH_GUI_URL}/clone-basic.html` },
        { id: "cl2", label: "2", url: `${SCRATCH_GUI_URL}/clone-lifecycle.html` },
        { id: "cl3", label: "3", url: `${SCRATCH_GUI_URL}/clone-position.html` },
        { id: "cl-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "cl4", label: "4", url: `${SCRATCH_GUI_URL}/clone-spawn.html` },
        { id: "cl5", label: "5", url: `${SCRATCH_GUI_URL}/clone-click.html` },
        { id: "cl6", label: "6", url: `${SCRATCH_GUI_URL}/clone-broadcast.html` },
        { id: "cl7", label: "7", url: `${SCRATCH_GUI_URL}/clone-complete.html` },
      ],
      capstone: { id: "capstone-clone", url: null },
    },
    {
      id: "sensing",
      title: "Sensing - IPO (Input Process Output)",
      projectId: "scratch-sensing",
      materialLink: "https://canva.link/z8lrmibi1yq6rq9",
      levels: [
        { id: "s1", label: "1", url: `${SCRATCH_GUI_URL}/sensing-keyboard.html` },
        { id: "s2", label: "2", url: `${SCRATCH_GUI_URL}/sensing-mouse.html` },
        { id: "s3", label: "3", url: `${SCRATCH_GUI_URL}/sensing-touch.html` },
        { id: "s-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "s4", label: "4", url: `${SCRATCH_GUI_URL}/sensing-ask.html` },
        { id: "s5", label: "5", url: `${SCRATCH_GUI_URL}/sensing-timer.html` },
        { id: "s6", label: "6", url: `${SCRATCH_GUI_URL}/sensing-multi.html` },
        { id: "s7", label: "7", url: `${SCRATCH_GUI_URL}/sensing-capstone.html` },
      ],
      capstone: { id: "capstone-sensing", url: null },
    },
    {
      id: "algorithm",
      title: "Algoritma - Computational Thinking",
      projectId: "scratch-algorithm",
      materialLink: "https://canva.link/qqxvrcidq7o9vmi",
      levels: [
        { id: "a1", label: "1", url: `${SCRATCH_GUI_URL}/algorithm-basic.html` },
        { id: "a2", label: "2", url: `${SCRATCH_GUI_URL}/algorithm-flowchart.html` },
        { id: "a3", label: "3", url: `${SCRATCH_GUI_URL}/algorithm-decompose.html` },
        { id: "a-quiz", label: "Q", url: null, type: "QUIZ" as const },
        { id: "a4", label: "4", url: `${SCRATCH_GUI_URL}/algorithm-pattern.html` },
        { id: "a5", label: "5", url: `${SCRATCH_GUI_URL}/algorithm-branch.html` },
        { id: "a6", label: "6", url: `${SCRATCH_GUI_URL}/algorithm-efficient.html` },
        { id: "a7", label: "7", url: `${SCRATCH_GUI_URL}/algorithm-capstone.html` },
      ],
      capstone: { id: "capstone-algorithm", url: null },
    },
  ];

  // Clean slate for roadmap-related tables (idempotent re-seed)
  await prisma.studentTopicProgress.deleteMany();
  // Cascade: deleting curriculum triggers Topic cascade → TopicTask cascade
  const existingSF = await prisma.curriculum.findMany({
    where: { name: "Scratch Fundamental" },
    select: { id: true },
  });
  if (existingSF.length > 0) {
    await prisma.curriculum.deleteMany({
      where: { id: { in: existingSF.map((c) => c.id) } },
    });
  }

  const scratchFundamental = await prisma.curriculum.create({
    data: {
      name: "Scratch Fundamental",
      assessmentSetId: defaultAssessment.id,
      topics: {
          create: scratchFundamentalUnits.map((unit, i) => ({
            title: unit.title,
            order: i,
            materialLink: unit.materialLink,
          goals: `Pembelajaran ${unit.title} via Scratch GUI tutorial`,
          tools: "Scratch Editor",
        })),
      },
    },
    include: { topics: true },
  });

  for (const [unitIdx, unit] of scratchFundamentalUnits.entries()) {
    const topicRow = scratchFundamental.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: lvl.id,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: lvl.type ?? ("SCRATCH" as const),
      })),
      {
        topicId: topicRow.id,
        code: unit.capstone.id,
        label: "Capstone",
        url: unit.capstone.url,
        order: unit.levels.length,
        isCapstone: true,
        type: "SCRATCH" as const,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  // Seed Mock Quiz for m-quiz
  const mQuizTask = await prisma.topicTask.findFirst({
    where: { code: "m-quiz" },
  });

  if (mQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: mQuizTask.id,
        questions: {
          create: [
            {
              question: "Blok {move (10) steps} membuat sprite bergerak sejauh 10 langkah ke arah mana?",
              choices: [
                { content: "Ke arah hadap sprite saat itu", isCorrect: true, feedback: "Benar! Move steps menggerakkan sprite maju sesuai arah hadapnya (direction)." },
                { content: "Ke kanan layar (sumbu X positif) tanpa peduli arah hadap", isCorrect: false, feedback: "Move tidak selalu ke kanan. Coba putar sprite dulu dengan turn, lalu move — sprite akan bergerak ke arah yang berbeda." },
                { content: "Ke kiri layar (sumbu X negatif)", isCorrect: false, feedback: "Move bergerak sesuai arah hadap, bukan selalu ke kiri." },
              ],
            },
            {
              question: "Apa perbedaan {move (10) steps} dengan {set x to (100)}?",
              choices: [
                { content: "{move (10) steps} menggerakkan sprite maju sesuai arah hadap, {set x to (100)} memindahkan sprite ke koordinat X tertentu tanpa peduli arah", isCorrect: true, feedback: "Benar! Move relatif terhadap arah sprite, set x adalah posisi absolut di sumbu X." },
                { content: "{move (10) steps} lebih cepat daripada {set x to (100)}", isCorrect: false, feedback: "Kecepatan eksekusi sama, yang membedakan adalah cara kerjanya." },
                { content: "Tidak ada perbedaan, keduanya melakukan hal yang sama", isCorrect: false, feedback: "Sangat berbeda! Coba project 1: move untuk gerak maju, set x untuk loncat ke posisi tertentu." },
              ],
            },
            {
              question: "Jika sprite menghadap ke kanan (direction 90), lalu dijalankan {turn right (90) degrees}, ke mana arah sprite sekarang?",
              choices: [
                { content: "Menghadap ke bawah (direction 180)", isCorrect: true, feedback: "Benar! Turn right 90° dari kanan (90°) = 180° = menghadap ke bawah." },
                { content: "Menghadap ke kiri (direction -90)", isCorrect: false, feedback: "Itu kalau turn right 180° atau turn left 90°." },
                { content: "Masih menghadap ke kanan (direction 90)", isCorrect: false, feedback: "Turn right 90° memutar sprite seperempat putaran, arahnya berubah." },
              ],
            },
            {
              question: "Manakah contoh Sequence yang benar saat mencuci tangan?",
              choices: [
                {
                  content: `A.\n
                          \nBilas tangan
                          \nPakai sabun
                          \nGosok tangan`,
                  isCorrect: false, feedback: "Salah urutan.",
                },
                { content: `B.
                        \nPakai sabun
                        \nGosok tangan
                        \nBilas tangan ✅`,
                isCorrect: true, feedback: "Benar! Urutan logis: sabun → gosok → bilas.",
                },
                { content: `C.
                            \nGosok tangan
                            \nBilas tangan
                            \nPakai sabun`, isCorrect: false, feedback: "Urutan tidak benar." },
              ],
            },
            {
              question: "Untuk membuat sprite bergerak membentuk persegi, kombinasi blok apa yang tepat?",
              choices: [
                { content: "Ulangi 4 kali: {move (100) steps}, {turn right (90) degrees}, wait 1 detik", isCorrect: true, feedback: "Benar! Persegi butuh 4 sisi, tiap sisi move lalu belok 90°." },
                { content: "Ulangi 3 kali: {move (100) steps}, {turn right (120) degrees}", isCorrect: false, feedback: "Itu untuk membuat segitiga, bukan persegi." },
                { content: "{move (100) steps}, {turn right (90) degrees} (tanpa repeat)", isCorrect: false, feedback: "Itu hanya satu sisi. Butuh repeat (4) agar keempat sisi terbentuk." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for m-quiz");
  }

  // Seed Mock Quiz for l-quiz (Looks & Sound)
  const lQuizTask = await prisma.topicTask.findFirst({
    where: { code: "l-quiz" },
  });

  if (lQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: lQuizTask.id,
        questions: {
          create: [
            {
              question: "Apa perbedaan blok {say [Hello!] for (2) secs} dengan {say [Hello!]}?",
              choices: [
                { content: "{say [Hello!] for (2) secs} otomatis menghilangkan bubble setelah 2 detik, sedangkan {say [Hello!]} bubble-nya tetap sampai diganti atau dikosongkan", isCorrect: true, feedback: "Benar! 'say for secs' punya timer otomatis, 'say' biasa butuh blok lain untuk menghilangkan bubble." },
                { content: "{say [Hello!] for (2) secs} hanya bisa dipakai sekali, sedangkan {say [Hello!]} bisa dipakai berulang", isCorrect: false, feedback: "Tidak tepat. Keduanya bisa dipakai berulang." },
                { content: "Tidak ada perbedaan, keduanya sama saja", isCorrect: false, feedback: "Salah. Coba perhatikan bahwa 'say' tanpa timer tidak akan hilang sendiri." },
              ],
            },
            {
              question: "Blok apa yang dipakai untuk mengganti costume sprite ke costume berikutnya secara berurutan?",
              choices: [
                { content: "{next costume}", isCorrect: true, feedback: "Benar! 'next costume' otomatis berpindah ke costume berikutnya sesuai urutan di panel Costumes." },
                { content: "{switch costume to [costume v]}", isCorrect: false, feedback: "Blok ini memang mengganti costume, tapi ke costume tertentu, bukan otomatis ke berikutnya." },
                { content: "{change size by (10)}", isCorrect: false, feedback: "Blok ini mengubah ukuran, bukan costume." },
              ],
            },
            {
              question: "Jika {set [ghost v] effect to (100)} dijalankan, apa yang terjadi pada sprite?",
              choices: [
                { content: "Sprite menjadi transparan/hilang dari stage", isCorrect: true, feedback: "Benar! Efek ghost 100% membuat sprite sepenuhnya transparan." },
                { content: "Sprite berubah warna menjadi terang", isCorrect: false, feedback: "Itu efek brightness atau color, bukan ghost." },
                { content: "Sprite berukuran lebih kecil", isCorrect: false, feedback: "Ukuran diatur dengan 'set size', bukan graphic effects." },
              ],
            },
            {
              question: "Apa fungsi blok {go to front layer}?",
              choices: [
                { content: "Memindahkan sprite ke lapisan paling depan supaya tidak tertutup sprite lain", isCorrect: true, feedback: "Benar! 'go to front layer' membuat sprite berada di atas semua sprite lain." },
                { content: "Memindahkan sprite ke posisi X:0 Y:0", isCorrect: false, feedback: "Itu 'go to x:0 y:0', bukan layer." },
                { content: "Menyembunyikan sprite", isCorrect: false, feedback: "'hide' yang menyembunyikan sprite." },
              ],
            },
            {
              question: "Apa perbedaan {start sound [v]} dengan {play sound [v] until done}?",
              choices: [
                { content: "{play sound [v] until done} menunggu suara selesai sebelum lanjut ke blok berikutnya, sedangkan {start sound [v]} langsung lanjut", isCorrect: true, feedback: "Benar! 'start sound' non-blocking (suara jalan di background), 'play sound until done' blocking (menahan script)." },
                { content: "{start sound [v]} suaranya lebih pelan", isCorrect: false, feedback: "Volume diatur oleh blok volume, bukan jenis play." },
                { content: "Tidak ada perbedaan, keduanya sama", isCorrect: false, feedback: "Ada perbedaan penting: blocking vs non-blocking." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for l-quiz");
  }

  // Seed Mock Quiz for c-quiz (Control Loops)
  const cQuizTask = await prisma.topicTask.findFirst({
    where: { code: "c-quiz" },
  });

  if (cQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: cQuizTask.id,
        questions: {
          create: [
            {
              question: "Blok {repeat (10)} akan menjalankan isi di dalamnya sebanyak berapa kali?",
              choices: [
                { content: "10 kali", isCorrect: true, feedback: "Benar! Repeat (10) mengulang sebanyak 10 kali." },
                { content: "9 kali", isCorrect: false, feedback: "Hampir, tetapi repeat (10) menghitung dari 1 sampai 10, jadi 10 kali." },
                { content: "Terus-menerus sampai dihentikan", isCorrect: false, feedback: "Itu 'forever', bukan 'repeat'." },
              ],
            },
            {
              question: "Apa perbedaan utama {repeat (10)} dengan {forever}?",
              choices: [
                { content: "{repeat (10)} berhenti setelah jumlah tertentu, {forever} berjalan terus tanpa henti", isCorrect: true, feedback: "Benar! Repeat untuk jumlah tetap, forever untuk pengulangan tanpa batas." },
                { content: "{forever} hanya bisa dipakai di sprite, {repeat (10)} di stage", isCorrect: false, feedback: "Keduanya bisa dipakai di sprite maupun stage." },
                { content: "Tidak ada perbedaan", isCorrect: false, feedback: "Sangat berbeda! Repeat butuh angka, forever tidak punya kondisi berhenti." },
              ],
            },
            {
              question: "Kapan blok {repeat until <>} berhenti mengulang?",
              choices: [
                { content: "Saat kondisi di dalam <> menjadi benar (true)", isCorrect: true, feedback: "Benar! Repeat until berhenti ketika kondisi terpenuhi." },
                { content: "Setelah 10 kali pengulangan", isCorrect: false, feedback: "Itu 'repeat (10)', bukan 'repeat until'." },
                { content: "Tidak pernah berhenti", isCorrect: false, feedback: "'repeat until' punya kondisi berhenti, jadi pasti berhenti suatu saat." },
              ],
            },
            {
              question: "Apa efek dari blok {stop [all]}?",
              choices: [
                { content: "Menghentikan semua script yang berjalan di semua sprite", isCorrect: true, feedback: "Benar! 'stop all' menghentikan seluruh program." },
                { content: "Hanya menghentikan script yang sedang berjalan di sprite tersebut", isCorrect: false, feedback: "Itu 'stop [this script]', bukan 'stop [all]'." },
                { content: "Menghapus semua clone", isCorrect: false, feedback: "'stop [all]' menghentikan semua script, termasuk clone." },
              ],
            },
            {
              question: "Dalam repeat bersarang (nested repeat), apa fungsi repeat yang di luar?",
              choices: [
                { content: "Mengulang keseluruhan pola yang dibentuk repeat dalam", isCorrect: true, feedback: "Benar! Repeat luar mengulang pola utuh, repeat dalam membentuk satu unit pola." },
                { content: "Tidak berpengaruh, hanya repeat dalam yang penting", isCorrect: false, feedback: "Keduanya penting. Repeat luar menentukan berapa kali pola diulang." },
                { content: "Menentukan kecepatan gerak sprite", isCorrect: false, feedback: "Kecepatan diatur oleh wait atau nilai move, bukan jumlah repeat." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for c-quiz");
  }

  // Seed Mock Quiz for cc-quiz (Control Conditional)
  const ccQuizTask = await prisma.topicTask.findFirst({
    where: { code: "cc-quiz" },
  });

  if (ccQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: ccQuizTask.id,
        questions: {
          create: [
            {
              question: "Kapan blok di dalam cabang 'else' pada {if <> then [v] else [v]} akan dijalankan?",
              choices: [
                { content: "Saat kondisi di 'if' bernilai salah (false)", isCorrect: true, feedback: "Benar! If-else selalu menjalankan salah satu cabang: if jika benar, else jika salah." },
                { content: "Saat kondisi di 'if' bernilai benar (true)", isCorrect: false, feedback: "Itu kebalikannya. Else jalan saat kondisi if salah." },
                { content: "Tidak pernah dijalankan", isCorrect: false, feedback: "Else pasti dijalankan kalau kondisi if tidak terpenuhi." },
              ],
            },
            {
              question: "Apa perbedaan {wait (1) secs} dengan {wait until <>}?",
              choices: [
                { content: "{wait (1) secs} menunggu durasi tetap, {wait until <>} menunggu sampai kondisi jadi benar", isCorrect: true, feedback: "Benar! Wait menunggu berdasarkan waktu, wait until menunggu berdasarkan kondisi." },
                { content: "{wait until <>} hanya bisa dipakai di dalam forever", isCorrect: false, feedback: "Wait until bisa dipakai di mana saja." },
                { content: "Keduanya sama, cuma beda penulisan", isCorrect: false, feedback: "Cara kerjanya berbeda: waktu vs kondisi." },
              ],
            },
            {
              question: "Operator {<> and <>} vs {<> or <>}: mana yang lebih mudah dipenuhi kondisinya?",
              choices: [
                { content: "{<> or <>} lebih mudah karena salah satu benar sudah cukup", isCorrect: true, feedback: "Benar! Or: cukup satu kondisi benar. And: semua harus benar." },
                { content: "{<> and <>} lebih mudah karena duanya harus benar", isCorrect: false, feedback: "And lebih sulit karena semua kondisi harus terpenuhi." },
                { content: "Sama sulitnya", isCorrect: false, feedback: "'or' lebih longgar, 'and' lebih ketat." },
              ],
            },
            {
              question: "Apa yang dibuat oleh blok {create clone of [myself v]}?",
              choices: [
                { content: "Salinan sprite yang bisa punya perilaku sendiri lewat {when I start as a clone}", isCorrect: true, feedback: "Benar! Clone adalah salinan independen yang bisa diatur dengan event khusus clone." },
                { content: "Sprite baru yang persis sama dan akan mengikuti semua gerakan sprite asli", isCorrect: false, feedback: "Clone tidak mengikuti sprite asli. Clone punya perilaku sendiri." },
                { content: "Menggandakan backdrop stage", isCorrect: false, feedback: "Bukan. Clone bekerja pada sprite, bukan backdrop." },
              ],
            },
            {
              question: "Mengapa clone perlu dihapus dengan {delete this clone}?",
              choices: [
                { content: "Agar clone tidak menumpuk selamanya dan membebani stage", isCorrect: true, feedback: "Benar! Clone yang tidak dihapus akan terus bertambah dan bisa memperlambat program." },
                { content: "Karena clone tidak bisa bergerak tanpa dihapus dulu", isCorrect: false, feedback: "Clone bisa bergerak seperti sprite biasa." },
                { content: "Tidak perlu dihapus, clone otomatis hilang sendiri", isCorrect: false, feedback: "Clone tidak otomatis hilang. Harus dihapus manual dengan 'delete this clone'." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for cc-quiz");
  }

  // Seed Mock Quiz for cm-quiz (Control Mix)
  const cmQuizTask = await prisma.topicTask.findFirst({
    where: { code: "cm-quiz" },
  });

  if (cmQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: cmQuizTask.id,
        questions: {
          create: [
            {
              question: "Dalam kombinasi {repeat (10)} + {if <> then [v]} + {stop [all]}, apa yang dihentikan oleh blok {stop [all]}?",
              choices: [
                { content: "Script yang sedang berjalan, sehingga repeat berhenti lebih awal", isCorrect: true, feedback: "Benar! 'stop this script' di dalam repeat akan menghentikan seluruh script, termasuk repeat yang masih berjalan." },
                { content: "Hanya iterasi repeat saat itu, lalu lanjut ke iterasi berikutnya", isCorrect: false, feedback: "'stop' tidak melanjutkan ke iterasi berikutnya. Ia menghentikan seluruh script." },
                { content: "Semua script di semua sprite", isCorrect: false, feedback: "'stop [all]' memang menghentikan semua, tapi di sini biasanya pakai 'stop [this script]'." },
              ],
            },
            {
              question: "Dalam urutan {wait until [space pressed v]} lalu {repeat until [touching edge v]}, kapan repeat mulai berjalan?",
              choices: [
                { content: "Setelah tombol spasi ditekan (kondisi wait until terpenuhi)", isCorrect: true, feedback: "Benar! Wait until menahan script sampai kondisi terpenuhi, baru lanjut ke repeat." },
                { content: "Segera setelah green flag diklik", isCorrect: false, feedback: "Wait until di awal akan menahan dulu sampai tombol ditekan." },
                { content: "Setelah sprite menyentuh tepi", isCorrect: false, feedback: "Itu kondisi berhenti repeat, bukan kondisi mulai." },
              ],
            },
            {
              question: "Apa fungsi blok {change [counter v] by (1)}?",
              choices: [
                { content: "Menambah nilai counter sebesar 1, berguna untuk menghitung skor atau jumlah kejadian", isCorrect: true, feedback: "Benar! Counter adalah penghitung bawaan Scratch yang bisa ditambah atau dikurangi." },
                { content: "Mengganti costume sprite", isCorrect: false, feedback: "Costume diubah dengan 'next costume' atau 'switch costume to'." },
                { content: "Mengubah warna sprite", isCorrect: false, feedback: "Warna diubah dengan 'change color effect'." },
              ],
            },
            {
              question: "Kapan tepatnya {forever} + {if <> then [v] else [v]} digunakan?",
              choices: [
                { content: "Saat sprite perlu bereaksi real-time terhadap perubahan kondisi yang dicek terus-menerus", isCorrect: true, feedback: "Benar! Forever + if-else memungkinkan sprite 'memantau' kondisi dan bereaksi secara real-time." },
                { content: "Saat ingin mengulang sesuatu sebanyak 10 kali", isCorrect: false, feedback: "Itu pakai 'repeat (10)', bukan forever." },
                { content: "Saat ingin membuat clone", isCorrect: false, feedback: "Clone pakai 'create clone of', bukan forever + if-else." },
              ],
            },
            {
              question: "Dalam capstone game 'Tangkap Bintang', apa urutan alur game yang benar?",
              choices: [
                { content: "Reset counter → tunggu sinyal mulai → spawn clone berkala → clone jatuh → jika kena klik tambah skor → stop saat target tercapai", isCorrect: true, feedback: "Benar! Itu alur lengkap game Tangkap Bintang yang menggabungkan counter, wait until, repeat, clone, if-else, dan stop." },
                { content: "Langsung spawn clone → clone jalan sendiri → selesai", isCorrect: false, feedback: "Game yang baik punya awal (reset), proses (spawn + klik), dan akhir (target skor tercapai)." },
                { content: "Buat clone → hapus clone → ulangi", isCorrect: false, feedback: "Itu terlalu sederhana. Capstone menggabungkan semua konsep control." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for cm-quiz");
  }

  // Seed Mock Quiz for e-quiz (Event Driven Programming)
  const eQuizTask = await prisma.topicTask.findFirst({
    where: { code: "e-quiz" },
  });

  if (eQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: eQuizTask.id,
        questions: {
          create: [
            {
              question: "Manakah contoh Event di kehidupan sehari-hari?",
              choices: [
                { content: "Lampu menyala", isCorrect: false, feedback: "Itu adalah hasil/akibat, bukan event." },
                { content: "Menekan saklar lampu", isCorrect: true, feedback: "Benar! Event adalah kejadian yang memicu sesuatu terjadi. Menekan saklar adalah event, lampu menyala adalah reaksinya." },
                { content: "Cahaya lampu", isCorrect: false, feedback: "Cahaya adalah output, bukan event pemicu." },
              ],
            },
            {
              question: "Apa perbedaan blok {broadcast [v]} dengan {broadcast [v] and wait}?",
              choices: [
                { content: "{broadcast [v]} langsung lanjut ke blok berikutnya tanpa menunggu, sedangkan {broadcast [v] and wait} menunggu semua penerima selesai menjalankan script-nya", isCorrect: true, feedback: "Benar! Broadcast non-blocking — pengirim lanjut terus. Broadcast and wait blocking — pengirim menunggu penerima selesai." },
                { content: "{broadcast [v]} hanya bisa dipakai di sprite, {broadcast [v] and wait} di stage", isCorrect: false, feedback: "Keduanya bisa dipakai di sprite maupun stage." },
                { content: "Tidak ada perbedaan, keduanya sama saja", isCorrect: false, feedback: "Sangat berbeda! Coba project 6: broadcast langsung lanjut, broadcast and wait menunggu." },
              ],
            },
            {
              question: "Jika sprite ingin bereaksi saat tombol spasi ditekan, blok event apa yang dipakai?",
              choices: [
                { content: "{when [space v] key pressed}", isCorrect: true, feedback: "Benar! 'when key pressed' bisa diatur ke tombol apa pun, termasuk spasi." },
                { content: "{when this sprite clicked}", isCorrect: false, feedback: "Itu event klik mouse, bukan keyboard." },
                { content: "{when green flag clicked}", isCorrect: false, feedback: "Green flag adalah tombol start di Scratch, bukan tombol keyboard." },
              ],
            },
            {
              question: "Saat {broadcast [mulai v]} dijalankan, apa yang terjadi pada script {when I receive [mulai v]} di sprite lain?",
              choices: [
                { content: "Semua script dengan {when I receive [mulai v]} di sprite mana pun akan berjalan", isCorrect: true, feedback: "Benar! Broadcast menjangkau semua sprite. Semua yang menerima pesan yang sama akan bereaksi." },
                { content: "Hanya satu script yang terpilih secara acak yang berjalan", isCorrect: false, feedback: "Tidak acak. Semua penerima dengan pesan yang cocok akan berjalan." },
                { content: "Tidak ada yang terjadi karena broadcast hanya untuk sprite pengirim", isCorrect: false, feedback: "Broadcast bisa diterima sprite mana pun, termasuk sprite pengirim itu sendiri." },
              ],
            },
            {
              question: "Apa fungsi blok {when backdrop switches to [v]}?",
              choices: [
                { content: "Menjalankan script saat backdrop tertentu tampil di stage", isCorrect: true, feedback: "Benar! Event ini dipicu saat Scratch mengganti backdrop ke yang ditentukan." },
                { content: "Mengganti costume sprite dengan backdrop", isCorrect: false, feedback: "Costume sprite diganti dengan 'next costume' atau 'switch costume to'." },
                { content: "Memutar suara setiap kali backdrop berganti", isCorrect: false, feedback: "Tidak otomatis memutar suara. Itu harus ditambahkan sendiri di bawah hat block." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for e-quiz");
  }

  // Seed Mock Quiz for d-quiz (Debugging)
  const dQuizTask = await prisma.topicTask.findFirst({
    where: { code: "d-quiz" },
  });

  if (dQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: dQuizTask.id,
        questions: {
          create: [
            {
              question: "Apa yang dimaksud dengan 'bug' dalam pemrograman?",
              choices: [
                { content: "Kesalahan pada kode yang menyebabkan program tidak berjalan sesuai harapan", isCorrect: true, feedback: "Benar! Bug adalah error/logic mistake yang bikin program salah." },
                { content: "Fitur baru yang ditambahkan ke program", isCorrect: false, feedback: "Itu fitur, bukan bug." },
                { content: "Cara mempercepat program", isCorrect: false, feedback: "Bug bikin program salah, bukan lebih cepat." },
              ],
            },
            {
              question: "Di Scratch, sprite tidak bergerak saat green flag diklik. Apa yang harus dicek pertama kali?",
              choices: [
                { content: "Apakah ada blok {when green flag clicked} di sprite tersebut", isCorrect: true, feedback: "Benar! Tanpa hat block 'when green flag clicked', script tidak akan pernah jalan." },
                { content: "Ganti sprite dengan sprite lain", isCorrect: false, feedback: "Bukan sprite-nya yang salah, tapi kode atau trigger-nya." },
                { content: "Hapus semua blok dan mulai lagi", isCorrect: false, feedback: "Terlalu ekstrem. Cek dulu trigger event-nya." },
              ],
            },
            {
              question: "Sebuah script menggunakan {broadcast [mulai v]} tetapi sprite lain tidak bereaksi. Apa kemungkinan penyebabnya?",
              choices: [
                { content: "Sprite lain menggunakan {when I receive [go v]} — pesan tidak cocok", isCorrect: true, feedback: "Benar! Broadcast 'mulai' hanya diterima oleh yang mendengar 'mulai'." },
                { content: "Broadcast hanya bisa diterima oleh sprite yang sama", isCorrect: false, feedback: "Broadcast bisa diterima sprite mana pun, termasuk stage." },
                { content: "Sprite penerima harus lebih besar dari pengirim", isCorrect: false, feedback: "Ukuran sprite tidak memengaruhi broadcast." },
              ],
            },
            {
              question: "Sprite bergerak terlalu cepat dalam {repeat (10)}. Bagaimana cara memperlambatnya?",
              choices: [
                { content: "Tambahkan {wait (0.5) secs} di dalam repeat", isCorrect: true, feedback: "Benar! Wait memberikan jeda antar iterasi sehingga gerakan terlihat." },
                { content: "Ganti repeat (10) menjadi repeat (100)", isCorrect: false, feedback: "Itu memperbanyak, bukan memperlambat." },
                { content: "Gunakan sprite yang berbeda", isCorrect: false, feedback: "Sprite tidak memengaruhi kecepatan eksekusi." },
              ],
            },
            {
              question: "Program berjalan terus tanpa henti meskipun pemain sudah menang. Blok apa yang kemungkinan kurang?",
              choices: [
                { content: "{stop [all v]} atau {stop [this script v]} saat kondisi menang tercapai", isCorrect: true, feedback: "Benar! Stop block menghentikan script yang berjalan." },
                { content: "{wait (1) secs}", isCorrect: false, feedback: "Wait hanya menunda, tidak menghentikan program." },
                { content: "{broadcast [v]}", isCorrect: false, feedback: "Broadcast tidak menghentikan apa pun." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for d-quiz");
  }

  // Seed Mock Quiz for cl-quiz (Clone - Object Instancing)
  const clQuizTask = await prisma.topicTask.findFirst({
    where: { code: "cl-quiz" },
  });

  if (clQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: clQuizTask.id,
        questions: {
          create: [
            {
              question: "Manakah contoh Clone di kehidupan sehari-hari?",
              choices: [
                { content: "Fotokopi buku", isCorrect: true, feedback: "Benar! Clone adalah salinan identik dari objek asli, seperti fotokopi." },
                { content: "Menghapus gambar", isCorrect: false, feedback: "Menghapus adalah kebalikan dari clone." },
                { content: "Menggambar lingkaran", isCorrect: false, feedback: "Menggambar adalah kreasi baru, bukan salinan." },
              ],
            },
            {
              question: "Blok apa yang digunakan untuk membuat salinan sprite di Scratch?",
              choices: [
                { content: "{create clone of [myself v]}", isCorrect: true, feedback: "Benar! Blok ini membuat clone dari sprite yang dipilih." },
                { content: "{broadcast [v]}", isCorrect: false, feedback: "Broadcast untuk mengirim pesan, bukan membuat salinan." },
                { content: "{repeat (10)}", isCorrect: false, feedback: "Repeat untuk mengulang perintah, bukan membuat clone." },
              ],
            },
            {
              question: "Apa yang terjadi saat {delete this clone} dijalankan?",
              choices: [
                { content: "Clone langsung dihapus dari stage", isCorrect: true, feedback: "Benar! Clone menghapus dirinya sendiri dari stage." },
                { content: "Sprite asli ikut terhapus", isCorrect: false, feedback: "'delete this clone' hanya menghapus clone, bukan sprite asli." },
                { content: "Clone berhenti bergerak tapi tetap di stage", isCorrect: false, feedback: "Clone tidak hanya berhenti — ia dihapus sepenuhnya." },
              ],
            },
            {
              question: "Saat clone dibuat, script mana yang otomatis berjalan di clone tersebut?",
              choices: [
                { content: "{when I start as a clone}", isCorrect: true, feedback: "Benar! Hat block ini khusus untuk clone dan otomatis berjalan saat clone lahir." },
                { content: "{when green flag clicked}", isCorrect: false, feedback: "'when green flag clicked' hanya berjalan di parent, tidak otomatis di clone." },
                { content: "{when this sprite clicked}", isCorrect: false, feedback: "Itu butuh interaksi klik, tidak otomatis jalan saat clone dibuat." },
              ],
            },
            {
              question: "Dalam {repeat (10)} + {create clone}, berapa total clone yang dibuat?",
              choices: [
                { content: "10 clone", isCorrect: true, feedback: "Benar! Repeat 10 = clone dibuat 10 kali." },
                { content: "1 clone", isCorrect: false, feedback: "Repeat mengulang 10 kali, jadi clone dibuat 10 kali." },
                { content: "Clone dibuat terus tanpa henti", isCorrect: false, feedback: "Repeat (10) berhenti setelah 10 kali, bukan forever." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for cl-quiz");
  }

  // Seed Mock Quiz for o-quiz (Operator - Matematika & Logika)
  const oQuizTask = await prisma.topicTask.findFirst({
    where: { code: "o-quiz" },
  });

  if (oQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: oQuizTask.id,
        questions: {
          create: [
            {
              question: "Manakah yang merupakan operator perhitungan?",
              choices: [
                { content: "+", isCorrect: true, feedback: "Benar! + adalah operator penjumlahan." },
                { content: "Sprite", isCorrect: false, feedback: "Sprite adalah objek, bukan operator." },
                { content: "Costume", isCorrect: false, feedback: "Costume adalah tampilan sprite, bukan operator." },
              ],
            },
            {
              question: "Blok operator apa yang menghasilkan nilai acak antara 1 sampai 10?",
              choices: [
                { content: "{pick random (1) to (10)}", isCorrect: true, feedback: "Benar! 'pick random' menghasilkan angka acak dalam rentang yang ditentukan." },
                { content: "{() + ()}", isCorrect: false, feedback: "Penjumlahan menggabungkan dua nilai, bukan acak." },
                { content: "{() > ()}", isCorrect: false, feedback: "Perbandingan menghasilkan true/false, bukan angka acak." },
              ],
            },
            {
              question: "Hasil dari blok {join [Halo] [Dunia]} adalah...",
              choices: [
                { content: "HaloDunia", isCorrect: true, feedback: "Benar! 'join' menggabungkan teks tanpa spasi: Halo + Dunia = HaloDunia." },
                { content: "Halo Dunia", isCorrect: false, feedback: "'join' tidak menambahkan spasi otomatis." },
                { content: "Halo + Dunia", isCorrect: false, feedback: "'join' menggabungkan teks, bukan menampilkan operatornya." },
              ],
            },
            {
              question: "Operator {() and ()} bernilai benar (true) saat...",
              choices: [
                { content: "Kedua kondisi bernilai benar", isCorrect: true, feedback: "Benar! 'and' hanya true jika semua kondisi true." },
                { content: "Salah satu kondisi bernilai benar", isCorrect: false, feedback: "Itu 'or', bukan 'and'." },
                { content: "Kedua kondisi bernilai salah", isCorrect: false, feedback: "Jika keduanya false, hasilnya false." },
              ],
            },
            {
              question: "Manakah yang menghasilkan nilai 2 dari operator {() mod ()}?",
              choices: [
                { content: "{10 mod 3}", isCorrect: false, feedback: "10 mod 3 = 1 (sisa bagi 10/3 = 3 sisa 1)." },
                { content: "{11 mod 3}", isCorrect: true, feedback: "Benar! 11 mod 3 = 2 (11/3 = 3 sisa 2)." },
                { content: "{12 mod 3}", isCorrect: false, feedback: "12 mod 3 = 0 (12 habis dibagi 3)." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for o-quiz");
  }

  // Seed Mock Quiz for v-quiz (Variable & List)
  const vQuizTask = await prisma.topicTask.findFirst({
    where: { code: "v-quiz" },
  });

  if (vQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: vQuizTask.id,
        questions: {
          create: [
            {
              question: "Manakah contoh tempat menyimpan?",
              choices: [
                { content: "Dompet", isCorrect: true, feedback: "Benar! Dompet adalah tempat menyimpan uang, seperti variable adalah tempat menyimpan data." },
                { content: "Sepeda", isCorrect: false, feedback: "Sepeda adalah alat transportasi, bukan tempat menyimpan." },
                { content: "Bola", isCorrect: false, feedback: "Bola adalah mainan, bukan tempat menyimpan data." },
              ],
            },
            {
              question: "Blok apa yang digunakan untuk menyimpan nilai ke variable?",
              choices: [
                { content: "{set [v] to []}", isCorrect: true, feedback: "Benar! 'set variable to' menyimpan nilai ke dalam variable." },
                { content: "{change [v] by []}", isCorrect: false, feedback: "'change by' mengubah nilai, bukan menyimpan nilai baru." },
                { content: "{show variable [v]}", isCorrect: false, feedback: "'show variable' hanya menampilkan monitor, tidak menyimpan nilai." },
              ],
            },
            {
              question: "Apa fungsi blok {change [v] by []}?",
              choices: [
                { content: "Menambah atau mengurangi nilai variable", isCorrect: true, feedback: "Benar! 'change by' menambah (positif) atau mengurangi (negatif) nilai variable." },
                { content: "Mengganti nama variable", isCorrect: false, feedback: "Nama variable tidak bisa diubah lewat blok." },
                { content: "Menyembunyikan variable dari stage", isCorrect: false, feedback: "Itu 'hide variable', bukan 'change by'." },
              ],
            },
            {
              question: "Apa perbedaan variable dengan list?",
              choices: [
                { content: "List bisa menyimpan banyak item sekaligus, variable hanya satu nilai", isCorrect: true, feedback: "Benar! List adalah kumpulan data, variable adalah satu nilai tunggal." },
                { content: "Variable bisa menyimpan banyak item, list hanya satu", isCorrect: false, feedback: "Kebalikannya. List untuk banyak data, variable untuk satu nilai." },
                { content: "Tidak ada perbedaan, keduanya sama", isCorrect: false, feedback: "Sangat berbeda! List memiliki item, panjang, dan operasi tambah/hapus." },
              ],
            },
            {
              question: "Blok apa untuk menampilkan monitor variable di stage?",
              choices: [
                { content: "{show variable [v]}", isCorrect: true, feedback: "Benar! 'show variable' menampilkan monitor variable di stage." },
                { content: "{set [v] to []}", isCorrect: false, feedback: "'set variable to' menyimpan nilai, bukan menampilkan." },
                { content: "{hide variable [v]}", isCorrect: false, feedback: "Itu kebalikannya — 'hide variable' menyembunyikan monitor." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for v-quiz");
  }

  // Seed Mock Quiz for s-quiz (Sensing - IPO)
  const sQuizTask = await prisma.topicTask.findFirst({
    where: { code: "s-quiz" },
  });

  if (sQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: sQuizTask.id,
        questions: {
          create: [
            {
              question: "Dalam IPO, apa yang dilakukan pada tahap Process?",
              choices: [
                { content: "Menampilkan hasil", isCorrect: false, feedback: "Itu Output, bukan Process." },
                { content: "Mengolah informasi dan mengambil keputusan", isCorrect: true, feedback: "Benar! Process adalah tahap mengolah input dan menentukan tindakan." },
                { content: "Menerima input dari pengguna", isCorrect: false, feedback: "Itu Input, bukan Process." },
              ],
            },
            {
              question: "Saat pemain menekan tombol Spasi, karakter melompat. Bagian Process adalah...",
              choices: [
                { content: "Tombol Spasi ditekan", isCorrect: false, feedback: "Itu Input, bukan Process." },
                { content: "Scratch mendeteksi tombol ditekan lalu menjalankan perintah", isCorrect: true, feedback: "Benar! Process adalah tahap di mana komputer memproses input dan memutuskan tindakan." },
                { content: "Karakter melompat", isCorrect: false, feedback: "Itu Output, bukan Process." },
              ],
            },
            {
              question: "Blok apa yang membaca posisi mouse di Scratch?",
              choices: [
                { content: "{mouse x} / {mouse y}", isCorrect: true, feedback: "Benar! 'mouse x' dan 'mouse y' adalah reporter yang membaca posisi kursor mouse." },
                { content: "{key [space v] pressed?}", isCorrect: false, feedback: "Itu untuk deteksi keyboard, bukan posisi mouse." },
                { content: "{move (10) steps}", isCorrect: false, feedback: "Itu blok motion untuk menggerakkan sprite, bukan membaca input." },
              ],
            },
            {
              question: "Fungsi blok {touching [mouse-pointer v]} adalah...",
              choices: [
                { content: "Mendeteksi apakah sprite menyentuh mouse-pointer", isCorrect: true, feedback: "Benar! 'touching' mendeteksi collision antara sprite dengan objek yang dipilih." },
                { content: "Mendeteksi warna tertentu di stage", isCorrect: false, feedback: "Itu 'touching color', bukan 'touching object'." },
                { content: "Membaca input keyboard", isCorrect: false, feedback: "Input keyboard pakai 'key pressed', bukan 'touching'." },
              ],
            },
            {
              question: "Perbedaan {ask [] and wait} dengan {key [space v] pressed?} adalah...",
              choices: [
                { content: "{ask} menunggu input teks dari pengguna, {key pressed} mendeteksi tombol ditekan", isCorrect: true, feedback: "Benar! Ask untuk input teks (jawaban panjang), key pressed untuk deteksi tombol." },
                { content: "Sama saja, keduanya membaca keyboard", isCorrect: false, feedback: "Ask membaca teks (string), key pressed hanya mendeteksi apakah tombol ditekan." },
                { content: "{ask} hanya bisa dipakai sekali, {key pressed} berulang", isCorrect: false, feedback: "Keduanya bisa dipakai berulang — ask di dalam loop atau forever." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for s-quiz");
  }

  // Seed Mock Quiz for a-quiz (Algoritma - Computational Thinking)
  const aQuizTask = await prisma.topicTask.findFirst({
    where: { code: "a-quiz" },
  });

  if (aQuizTask) {
    await prisma.quiz.create({
      data: {
        taskId: aQuizTask.id,
        questions: {
          create: [
            {
              question: "Apa tujuan algoritma?",
              choices: [
                { content: "Menggambar Sprite", isCorrect: false, feedback: "Sprite digambar dengan paint editor, bukan algoritma." },
                { content: "Membuat rencana untuk menyelesaikan masalah", isCorrect: true, feedback: "Benar! Algoritma adalah urutan langkah logis untuk menyelesaikan masalah." },
                { content: "Mengubah warna Stage", isCorrect: false, feedback: "Warna stage diubah dengan backdrop atau blok looks, bukan algoritma." },
              ],
            },
            {
              question: "Manakah yang benar tentang Algoritma dan Sequence?",
              choices: [
                { content: "Sequence membuat rencana, algoritma menjalankan program", isCorrect: false, feedback: "Terbalik. Algoritma adalah rencananya, sequence adalah eksekusinya." },
                { content: "Algoritma adalah rencana, Sequence menjalankan langkah sesuai urutan", isCorrect: true, feedback: "Benar! Algoritma = rencana, Sequence = eksekusi langkah demi langkah." },
                { content: "Algoritma dan Sequence adalah hal yang berbeda tanpa hubungan", isCorrect: false, feedback: "Keduanya terkait erat. Sequence adalah cara menjalankan algoritma." },
              ],
            },
            {
              question: "Manakah contoh Decomposition (memecah masalah)?",
              choices: [
                { content: "Memecah 'Buat kue' menjadi: siapkan bahan → campur → panggang → sajikan", isCorrect: true, feedback: "Benar! Decomposition memecah masalah besar jadi langkah-langkah kecil yang lebih mudah dikelola." },
                { content: "Membuat kue langsung tanpa resep", isCorrect: false, feedback: "Tanpa resep = tanpa decomposition. Hasilnya tidak terstruktur." },
                { content: "Mengulang langkah yang sama 10 kali", isCorrect: false, feedback: "Itu loop/repetition, bukan decomposition." },
              ],
            },
            {
              question: "Algoritma mana yang lebih efisien untuk mencari nomor telepon di buku telepon?",
              choices: [
                { content: "Buka halaman tengah, cari berdasarkan huruf (seperti binary search)", isCorrect: true, feedback: "Benar! Binary search jauh lebih efisien daripada linear search untuk data terurut." },
                { content: "Baca dari halaman 1 sampai ketemu (linear search)", isCorrect: false, feedback: "Linear search bisa dipakai, tapi tidak efisien untuk buku telepon yang tebal." },
                { content: "Acak halaman sampai ketemu", isCorrect: false, feedback: "Acak tidak menjamin ketemu dan sangat tidak efisien." },
              ],
            },
            {
              question: "Dalam flowchart, bentuk wajik (diamond) digunakan untuk...",
              choices: [
                { content: "Menunjukkan keputusan (decision)", isCorrect: true, feedback: "Benar! Wajik = decision/percabangan dalam flowchart." },
                { content: "Menunjukkan mulai/selesai", isCorrect: false, feedback: "Mulai/selesai pakai oval/rounded rectangle." },
                { content: "Menunjukkan proses/aksi", isCorrect: false, feedback: "Proses/aksi pakai persegi panjang." },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for a-quiz");
  }

  console.log(
    `✓ Scratch Fundamental curriculum created (${scratchFundamentalUnits.length} units, ${scratchFundamentalUnits.length * 9} tasks)`,
  );
}