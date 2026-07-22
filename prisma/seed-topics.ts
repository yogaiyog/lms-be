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
      id: "control",
      title: "Control Loops",
      projectId: "scratch-control-loops",
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
      id: "control-conditional",
      title: "Control Conditional",
      projectId: "scratch-control-conditional",
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
          materialLink: null,
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
              question: "Blok {point in direction (0)} membuat sprite menghadap ke mana?",
              choices: [
                { content: "Ke atas (arah 0 derajat)", isCorrect: true, feedback: "Benar! 0° = atas, 90° = kanan, 180° = bawah, -90°/270° = kiri." },
                { content: "Ke kanan", isCorrect: false, feedback: "Arah kanan adalah 90°, bukan 0°." },
                { content: "Ke kiri", isCorrect: false, feedback: "Arah kiri adalah -90° atau 270°." },
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

  console.log(
    `✓ Scratch Fundamental curriculum created (${scratchFundamentalUnits.length} units, ${scratchFundamentalUnits.length * 9} tasks)`,
  );
}