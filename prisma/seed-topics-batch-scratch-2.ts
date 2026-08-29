import { PrismaClient } from "@prisma/client";

interface BatchScratchLevel {
  code: string;
  label: string;
  url: string | null;
  type?: "SCRATCH" | "QUIZ";
}

interface BatchScratchQuiz {
  code: string;
  questions: {
    question: string;
    choices: { content: string; isCorrect: boolean; feedback: string }[];
  }[];
}

interface BatchScratchUnit {
  id: string;
  title: string;
  projectId: string;
  materialLink: string | null;
  levels: BatchScratchLevel[];
  quiz: BatchScratchQuiz;
}

interface BatchScratchCapstone {
  id: string;
  title: string;
  url: string;
}

const SCRATCH_GUI_URL =
  process.env.SCRATCH_GUI_URL ?? "http://localhost:8601";

const FALLBACK_EDITOR = "https://scratch.mit.edu/projects/editor/";

const batchScratch2Units: BatchScratchUnit[] = [
  {
    id: "control-conditional",
    title: "Control Conditional",
    projectId: "scratch-control-conditional",
    materialLink: "https://canva.link/r2dfl6rd26tjr9a",
    levels: [
      { code: "cc1", label: "1", url: `${SCRATCH_GUI_URL}/control-if.html` },
      { code: "cc2", label: "2", url: `${SCRATCH_GUI_URL}/control-ifelse.html` },
      { code: "cc3", label: "3", url: `${SCRATCH_GUI_URL}/control-waituntil.html` },
      { code: "cc4", label: "4", url: `${SCRATCH_GUI_URL}/control-condition.html` },
      { code: "cc5", label: "5", url: `${SCRATCH_GUI_URL}/control-clonebasic.html` },
      { code: "cc6", label: "6", url: `${SCRATCH_GUI_URL}/control-clonelifecycle.html` },
      { code: "cc7", label: "7", url: `${SCRATCH_GUI_URL}/control-conditional-complete.html` },
    ],
    quiz: {
      code: "cc-quiz",
      questions: [
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
  {
    id: "control-mix",
    title: "Control Mix",
    projectId: "scratch-control-mix",
    materialLink: null,
    levels: [
      { code: "cm1", label: "1", url: `${SCRATCH_GUI_URL}/control-loopif.html` },
      { code: "cm2", label: "2", url: `${SCRATCH_GUI_URL}/control-foreverifelse.html` },
      { code: "cm3", label: "3", url: `${SCRATCH_GUI_URL}/control-start.html` },
      { code: "cm4", label: "4", url: `${SCRATCH_GUI_URL}/control-clonerepeat.html` },
      { code: "cm5", label: "5", url: `${SCRATCH_GUI_URL}/control-cloneifelse.html` },
      { code: "cm6", label: "6", url: `${SCRATCH_GUI_URL}/control-counter.html` },
      { code: "cm7", label: "7", url: `${SCRATCH_GUI_URL}/control-mixcomplete.html` },
    ],
    quiz: {
      code: "cm-quiz",
      questions: [
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
  {
    id: "operator",
    title: "Operator - Matematika & Logika",
    projectId: "scratch-operator",
    materialLink: "https://canva.link/tx4ah3as1dgrveb",
    levels: [
      { code: "o1", label: "1", url: `${SCRATCH_GUI_URL}/operator-arithmetic.html` },
      { code: "o2", label: "2", url: `${SCRATCH_GUI_URL}/operator-comparison.html` },
      { code: "o3", label: "3", url: `${SCRATCH_GUI_URL}/operator-logic.html` },
      { code: "o4", label: "4", url: `${SCRATCH_GUI_URL}/operator-string.html` },
      { code: "o5", label: "5", url: `${SCRATCH_GUI_URL}/operator-math.html` },
      { code: "o6", label: "6", url: `${SCRATCH_GUI_URL}/operator-mixed.html` },
      { code: "o7", label: "7", url: `${SCRATCH_GUI_URL}/operator-complete.html` },
    ],
    quiz: {
      code: "o-quiz",
      questions: [
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
  {
    id: "clone",
    title: "Clone - Object Instancing",
    projectId: "scratch-clone",
    materialLink: "https://canva.link/rybbgio94k2i4si",
    levels: [
      { code: "cl1", label: "1", url: `${SCRATCH_GUI_URL}/clone-basic.html` },
      { code: "cl2", label: "2", url: `${SCRATCH_GUI_URL}/clone-lifecycle.html` },
      { code: "cl3", label: "3", url: `${SCRATCH_GUI_URL}/clone-position.html` },
      { code: "cl4", label: "4", url: `${SCRATCH_GUI_URL}/clone-spawn.html` },
      { code: "cl5", label: "5", url: `${SCRATCH_GUI_URL}/clone-click.html` },
      { code: "cl6", label: "6", url: `${SCRATCH_GUI_URL}/clone-broadcast.html` },
      { code: "cl7", label: "7", url: `${SCRATCH_GUI_URL}/clone-complete.html` },
    ],
    quiz: {
      code: "cl-quiz",
      questions: [
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
  {
    id: "sensing",
    title: "Sensing - IPO (Input Process Output)",
    projectId: "scratch-sensing",
    materialLink: "https://canva.link/z8lrmibi1yq6rq9",
    levels: [
      { code: "s1", label: "1", url: `${SCRATCH_GUI_URL}/sensing-keyboard.html` },
      { code: "s2", label: "2", url: `${SCRATCH_GUI_URL}/sensing-mouse.html` },
      { code: "s3", label: "3", url: `${SCRATCH_GUI_URL}/sensing-touch.html` },
      { code: "s4", label: "4", url: `${SCRATCH_GUI_URL}/sensing-ask.html` },
      { code: "s5", label: "5", url: `${SCRATCH_GUI_URL}/sensing-timer.html` },
      { code: "s6", label: "6", url: `${SCRATCH_GUI_URL}/sensing-multi.html` },
      { code: "s7", label: "7", url: `${SCRATCH_GUI_URL}/sensing-capstone.html` },
    ],
    quiz: {
      code: "s-quiz",
      questions: [
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
  {
    id: "algorithm",
    title: "Algoritma - Computational Thinking",
    projectId: "scratch-algorithm",
    materialLink: "https://canva.link/qqxvrcidq7o9vmi",
    levels: [
      { code: "a1", label: "1", url: `${SCRATCH_GUI_URL}/algorithm-basic.html` },
      { code: "a2", label: "2", url: `${SCRATCH_GUI_URL}/algorithm-flowchart.html` },
      { code: "a3", label: "3", url: `${SCRATCH_GUI_URL}/algorithm-decompose.html` },
      { code: "a4", label: "4", url: `${SCRATCH_GUI_URL}/algorithm-pattern.html` },
      { code: "a5", label: "5", url: `${SCRATCH_GUI_URL}/algorithm-branch.html` },
      { code: "a6", label: "6", url: `${SCRATCH_GUI_URL}/algorithm-efficient.html` },
      { code: "a7", label: "7", url: `${SCRATCH_GUI_URL}/algorithm-capstone.html` },
    ],
    quiz: {
      code: "a-quiz",
      questions: [
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
];

const batchScratch2Capstones: BatchScratchCapstone[] = [
  { id: "control-conditional", title: "Control Conditional Capstone", url: "https://juaraku-neon.vercel.app/silly-eyes" },
  { id: "control-mix", title: "Control Mix Capstone", url: "https://juaraku-neon.vercel.app/grow-a-dragonfly" },
  { id: "operator", title: "Operator Capstone", url: FALLBACK_EDITOR },
  { id: "clone", title: "Clone Capstone", url: FALLBACK_EDITOR },
  { id: "sensing", title: "Sensing Capstone", url: FALLBACK_EDITOR },
  { id: "algorithm", title: "Algoritma Capstone", url: FALLBACK_EDITOR },
];

export async function seedBatchScratchExplorer2(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const name = "Batch-Scratch-Explorer-2";

  await prisma.studentTopicProgress.deleteMany({
    where: { topicTask: { topic: { curriculum: { name } } } },
  });
  await prisma.curriculum.deleteMany({ where: { name } });

  const allTopics: {
    title: string;
    order: number;
    materialLink: string | null;
    goals: string;
    tools: string;
    exampleProjectLink?: string;
  }[] = [];

  for (let i = 0; i < batchScratch2Units.length; i++) {
    const unit = batchScratch2Units[i];
    const cap = batchScratch2Capstones[i];

    allTopics.push({
      title: unit.title,
      order: i * 2,
      materialLink: unit.materialLink,
      goals: `Pembelajaran ${unit.title} via Scratch GUI tutorial`,
      tools: "Scratch Editor",
    });

    if (cap) {
      allTopics.push({
        title: cap.title,
        order: i * 2 + 1,
        materialLink: null,
        goals: `Proyek akhir: ${cap.title}`,
        tools: "Scratch Editor",
        exampleProjectLink: cap.url,
      });
    }
  }

  const curriculum = await prisma.curriculum.create({
    data: {
      name,
      assessmentSetId: defaultAssessment.id,
      priceBatch810: 49750,
      priceBatch35: 62250,
      pricePrivate: null,
      ...(categoryIds?.length
        ? {
            categories: {
              create: categoryIds.map((cat) => ({ categoryId: cat.id })),
            },
          }
        : {}),
      topics: {
        create: allTopics,
      },
    },
    include: { topics: true },
  });

  for (const unit of batchScratch2Units) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: `b2${lvl.code}`,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: lvl.type ?? ("SCRATCH" as const),
      })),
      {
        topicId: topicRow.id,
        code: `b2${unit.quiz.code}`,
        label: "Q",
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const cap of batchScratch2Capstones) {
    const topicRow = curriculum.topics.find((t) => t.title === cap.title);
    if (!topicRow) continue;

    await prisma.topicTask.create({
      data: {
        topicId: topicRow.id,
        code: `b2cap-${cap.id}`,
        label: "Capstone",
        url: cap.url,
        order: 0,
        isCapstone: true,
        type: "SCRATCH",
      },
    });
  }

  for (const unit of batchScratch2Units) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const quizTask = await prisma.topicTask.findFirst({
      where: { code: `b2${unit.quiz.code}`, topicId: topicRow.id },
    });
    if (!quizTask) continue;

    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: unit.quiz.questions.map((q) => ({
            question: q.question,
            choices: q.choices,
          })),
        },
      },
    });
  }

  const totalTasks =
    batchScratch2Units.reduce((sum, u) => sum + u.levels.length + 1, 0) +
    batchScratch2Capstones.length;
  console.log(
    `✓ Batch-Scratch-Explorer-2 curriculum seeded (${batchScratch2Units.length + batchScratch2Capstones.length} topics, ${totalTasks} tasks, ${batchScratch2Units.length} quizzes)`,
  );
}
