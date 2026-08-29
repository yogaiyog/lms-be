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

const batchScratchUnits: BatchScratchUnit[] = [
  {
    id: "motion",
    title: "Motion Fundamental",
    projectId: "scratch-motion",
    materialLink: "https://canva.link/x0yr2fhd5di4ac3",
    levels: [
      { code: "m1", label: "1", url: `${SCRATCH_GUI_URL}/motion-tutorial.html` },
      { code: "m2", label: "2", url: `${SCRATCH_GUI_URL}/motion-turn.html` },
      { code: "m3", label: "3", url: `${SCRATCH_GUI_URL}/motion-move-turn.html` },
      { code: "m4", label: "4", url: `${SCRATCH_GUI_URL}/motion-goto.html` },
      { code: "m5", label: "5", url: `${SCRATCH_GUI_URL}/motion-glide.html` },
      { code: "m6", label: "6", url: `${SCRATCH_GUI_URL}/motion-direction.html` },
      { code: "m7", label: "7", url: `${SCRATCH_GUI_URL}/motion-complete.html` },
    ],
    quiz: {
      code: "m-quiz",
      questions: [
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
  {
    id: "looks",
    title: "Looks Fundamental",
    projectId: "scratch-looks",
    materialLink: "https://canva.link/xivq43w0u1d39ni",
    levels: [
      { code: "l1", label: "1", url: `${SCRATCH_GUI_URL}/looks-say.html` },
      { code: "l2", label: "2", url: `${SCRATCH_GUI_URL}/looks-costume.html` },
      { code: "l3", label: "3", url: `${SCRATCH_GUI_URL}/looks-size.html` },
      { code: "l4", label: "4", url: `${SCRATCH_GUI_URL}/looks-effect.html` },
      { code: "l5", label: "5", url: `${SCRATCH_GUI_URL}/looks-layer.html` },
      { code: "l6", label: "6", url: `${SCRATCH_GUI_URL}/sound-basic.html` },
      { code: "l7", label: "7", url: `${SCRATCH_GUI_URL}/looks-sound-complete.html` },
    ],
    quiz: {
      code: "l-quiz",
      questions: [
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
  {
    id: "event",
    title: "Event Driven Programming",
    projectId: "scratch-event",
    materialLink: "https://canva.link/sceg1ywo9srdpcy",
    levels: [
      { code: "e1", label: "1", url: `${SCRATCH_GUI_URL}/event-flag.html` },
      { code: "e2", label: "2", url: `${SCRATCH_GUI_URL}/event-click.html` },
      { code: "e3", label: "3", url: `${SCRATCH_GUI_URL}/event-keyboard.html` },
      { code: "e4", label: "4", url: `${SCRATCH_GUI_URL}/event-backdrop.html` },
      { code: "e5", label: "5", url: `${SCRATCH_GUI_URL}/event-broadcast.html` },
      { code: "e6", label: "6", url: `${SCRATCH_GUI_URL}/event-broadcastwait.html` },
      { code: "e7", label: "7", url: `${SCRATCH_GUI_URL}/event-complete.html` },
    ],
    quiz: {
      code: "e-quiz",
      questions: [
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
  {
    id: "variable",
    title: "Variable & List",
    projectId: "scratch-variable",
    materialLink: "https://canva.link/9bhf0nmavat0ks7",
    levels: [
      { code: "v1", label: "1", url: `${SCRATCH_GUI_URL}/variable-basic.html` },
      { code: "v2", label: "2", url: `${SCRATCH_GUI_URL}/variable-score.html` },
      { code: "v3", label: "3", url: `${SCRATCH_GUI_URL}/variable-health.html` },
      { code: "v4", label: "4", url: `${SCRATCH_GUI_URL}/variable-speed.html` },
      { code: "v5", label: "5", url: `${SCRATCH_GUI_URL}/variable-multivar.html` },
      { code: "v6", label: "6", url: `${SCRATCH_GUI_URL}/variable-list.html` },
      { code: "v7", label: "7", url: `${SCRATCH_GUI_URL}/variable-quiz.html` },
    ],
    quiz: {
      code: "v-quiz",
      questions: [
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
  {
    id: "control",
    title: "Control Loops",
    projectId: "scratch-control-loops",
    materialLink: "https://canva.link/9so0cvzxqyyughd",
    levels: [
      { code: "c1", label: "1", url: `${SCRATCH_GUI_URL}/control-repeat.html` },
      { code: "c2", label: "2", url: `${SCRATCH_GUI_URL}/control-forever.html` },
      { code: "c3", label: "3", url: `${SCRATCH_GUI_URL}/control-pattern.html` },
      { code: "c4", label: "4", url: `${SCRATCH_GUI_URL}/control-countdown.html` },
      { code: "c5", label: "5", url: `${SCRATCH_GUI_URL}/control-repeatuntil.html` },
      { code: "c6", label: "6", url: `${SCRATCH_GUI_URL}/control-foreverstop.html` },
      { code: "c7", label: "7", url: `${SCRATCH_GUI_URL}/control-complete.html` },
    ],
    quiz: {
      code: "c-quiz",
      questions: [
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
  {
    id: "debug",
    title: "Debugging",
    projectId: "scratch-debug",
    materialLink: "https://canva.link/bur63t7zpk5hiv7",
    levels: [
      { code: "d1", label: "1", url: `${SCRATCH_GUI_URL}/debug-motion.html` },
      { code: "d2", label: "2", url: `${SCRATCH_GUI_URL}/debug-looks-sound.html` },
      { code: "d3", label: "3", url: `${SCRATCH_GUI_URL}/debug-event.html` },
      { code: "d4", label: "4", url: `${SCRATCH_GUI_URL}/debug-loop.html` },
      { code: "d5", label: "5", url: `${SCRATCH_GUI_URL}/debug-conditional.html` },
      { code: "d6", label: "6", url: `${SCRATCH_GUI_URL}/debug-mixed.html` },
      { code: "d7", label: "7", url: `${SCRATCH_GUI_URL}/debug-complete.html` },
    ],
    quiz: {
      code: "d-quiz",
      questions: [
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
];

const batchScratchCapstones: BatchScratchCapstone[] = [
  { id: "motion", title: "Motion Capstone", url: "https://juaraku-neon.vercel.app/catch-the-bus" },
  { id: "looks", title: "Looks Capstone", url: "https://juaraku-neon.vercel.app/space-talk" },
  { id: "event", title: "Event Capstone", url: "https://juaraku-neon.vercel.app/broadcasting-spells" },
  { id: "variable", title: "Variable Capstone", url: FALLBACK_EDITOR },
  { id: "control", title: "Control Capstone", url: "https://juaraku-neon.vercel.app/find-the-bug" },
  { id: "debug", title: "Debugging Capstone", url: "https://juaraku-neon.vercel.app/next-customer-please" },
];

export async function seedBatchScratchExplorer(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const name = "Batch-Scratch-Explorer";

  await prisma.studentTopicProgress.deleteMany({
    where: { topicTask: { topic: { curriculum: { name } } } },
  });
  await prisma.curriculum.deleteMany({ where: { name } });

  const learningTopics = batchScratchUnits.map((unit, i) => ({
    title: unit.title,
    order: i,
    materialLink: unit.materialLink,
    goals: `Pembelajaran ${unit.title} via Scratch GUI tutorial`,
    tools: "Scratch Editor",
  }));

  const capstoneTopics = batchScratchCapstones.map((cap, i) => ({
    title: cap.title,
    order: batchScratchUnits.length + i,
    materialLink: null,
    goals: `Proyek akhir: ${cap.title}`,
    tools: "Scratch Editor",
    exampleProjectLink: cap.url,
  }));

  const curriculum = await prisma.curriculum.create({
    data: {
      name,
      assessmentSetId: defaultAssessment.id,
      ...(categoryIds?.length
        ? {
            categories: {
              create: categoryIds.map((cat) => ({ categoryId: cat.id })),
            },
          }
        : {}),
      topics: {
        create: [...learningTopics, ...capstoneTopics],
      },
    },
    include: { topics: true },
  });

  for (const unit of batchScratchUnits) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: `b${lvl.code}`,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: lvl.type ?? ("SCRATCH" as const),
      })),
      {
        topicId: topicRow.id,
        code: `b${unit.quiz.code}`,
        label: "Q",
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const cap of batchScratchCapstones) {
    const topicRow = curriculum.topics.find((t) => t.title === cap.title);
    if (!topicRow) continue;

    await prisma.topicTask.create({
      data: {
        topicId: topicRow.id,
        code: `bcap-${cap.id}`,
        label: "Capstone",
        url: cap.url,
        order: 0,
        isCapstone: true,
        type: "SCRATCH",
      },
    });
  }

  for (const unit of batchScratchUnits) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const quizTask = await prisma.topicTask.findFirst({
      where: { code: `b${unit.quiz.code}`, topicId: topicRow.id },
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
    batchScratchUnits.reduce((sum, u) => sum + u.levels.length + 1, 0) +
    batchScratchCapstones.length;
  console.log(
    `✓ Batch-Scratch-Explorer curriculum seeded (${batchScratchUnits.length + batchScratchCapstones.length} topics, ${totalTasks} tasks, ${batchScratchUnits.length} quizzes)`,
  );
}