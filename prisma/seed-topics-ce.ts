import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { uploadFile } from "../src/services/minio";

interface CodeLevel {
  code: string;
  label: string;
  url: string;
}

interface CodeUnit {
  id: string;
  title: string;
  goals: string;
  tools: string;
  levels: CodeLevel[];
  quiz: {
    code: string;
    questions: {
      question: string;
      imageUrl?: string;
      choices: { content: string; isCorrect: boolean; feedback: string }[];
    }[];
  };
  capstoneLabel: string;
  capstoneUrl: string;
}

const codeExplorerUnits: CodeUnit[] = [
  {
    id: "ce1-intro",
    title: "Digital Citizenship & Algoritma",
    goals: "Belajar algoritma, urutan langkah, dan cara bersikap baik di dunia digital",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce1a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/2/levels/1?section_id=6590433",
      },
      {
        code: "ce1b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/4/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "ce1-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan algoritma?",
          choices: [
            { content: "Langkah-langkah berurutan untuk menyelesaikan masalah", isCorrect: true, feedback: "Benar! Algoritma adalah urutan langkah logis untuk menyelesaikan masalah." },
            { content: "Nama sebuah bahasa pemrograman", isCorrect: false, feedback: "Bukan. Algoritma bukan bahasa pemrograman, tapi cara berpikir." },
            { content: "Sebuah aplikasi komputer", isCorrect: false, feedback: "Algoritma bukan aplikasi." },
            { content: "Jenis perangkat keras komputer", isCorrect: false, feedback: "Algoritma bukan hardware." },
          ],
        },
        {
          question: "Manakah contoh algoritma dalam kehidupan sehari-hari?",
          choices: [
            { content: "Tidur siang", isCorrect: false, feedback: "Tidur bukan algoritma karena tidak ada langkah-langkah." },
            { content: "Resep membuat mi instan", isCorrect: true, feedback: "Benar! Resep adalah algoritma: ada urutan langkah dari awal sampai akhir." },
            { content: "Bernyanyi", isCorrect: false, feedback: "Bernyanyi bukan algoritma." },
            { content: "Melihat TV", isCorrect: false, feedback: "Bukan. Tidak ada langkah-langkah yang terstruktur." },
          ],
        },
        {
          question: "Sikap apakah yang baik saat menggunakan internet?",
          choices: [
            { content: "Membagikan kata sandi ke teman", isCorrect: false, feedback: "Tidak boleh! Kata sandi harus dirahasiakan." },
            { content: "Bersikap sopan dan bijak seperti di dunia nyata", isCorrect: true, feedback: "Benar! Kita harus bersikap baik online sama seperti offline." },
            { content: "Membuka tautan dari orang tidak dikenal", isCorrect: false, feedback: "Berbahaya! Jangan klik tautan mencurigakan." },
            { content: "Menggunakan akun orang lain", isCorrect: false, feedback: "Tidak boleh menggunakan akun milik orang lain." },
          ],
        },
        {
          question: "Urutan langkah yang benar saat mencuci tangan adalah...",
          choices: [
            { content: "Bilas → sabun → keringkan", isCorrect: false, feedback: "Urutannya kurang tepat. Basahi dulu sebelum sabun." },
            { content: "Basahi → sabun → gosok → bilas → keringkan", isCorrect: true, feedback: "Benar! Ini adalah contoh algoritma dalam kehidupan sehari-hari." },
            { content: "Sabun → bilas → keringkan", isCorrect: false, feedback: "Melewatkan langkah membasahi tangan." },
            { content: "Gosok → keringkan → bilas", isCorrect: false, feedback: "Urutannya terbalik. Gosok setelah sabun, bukan sebelum." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan digital citizenship?",
          choices: [
            { content: "Cara menggunakan komputer dengan cepat", isCorrect: false, feedback: "Bukan hanya kecepatan, tapi cara menggunakan teknologi dengan bertanggung jawab." },
            { content: "Cara bersikap baik, aman, dan bertanggung jawab saat menggunakan teknologi digital", isCorrect: true, feedback: "Benar! Digital citizenship adalah tentang etika dan keamanan di dunia digital." },
            { content: "Cara membuat website", isCorrect: false, feedback: "Itu web development, bukan digital citizenship." },
            { content: "Cara menginstall aplikasi", isCorrect: false, feedback: "Itu instalasi, bukan digital citizenship." },
          ],
        },
      ],
    },
    capstoneLabel: "Artist Lab",
    capstoneUrl: "https://studio.code.org/projects/artist_k1/",
  },
  {
    id: "ce2-debug",
    title: "Debugging & Bijak Digital",
    goals: "Belajar menemukan dan memperbaiki kesalahan, serta menggunakan perangkat digital dengan bijak",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce2a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/5/levels/2",
      },
      {
        code: "ce2b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/6/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "ce2-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan debugging?",
          choices: [
            { content: "Proses mencari dan memperbaiki kesalahan dalam program", isCorrect: true, feedback: "Benar! Debugging adalah cara menemukan bug (error) lalu memperbaikinya." },
            { content: "Proses menulis kode baru", isCorrect: false, feedback: "Menulis kode baru disebut coding, bukan debugging." },
            { content: "Proses menginstall aplikasi", isCorrect: false, feedback: "Debugging bukan instalasi." },
            { content: "Proses mendesain karakter game", isCorrect: false, feedback: "Itu desain, bukan debugging." },
          ],
        },
        {
          question: "Apa yang sebaiknya kamu lakukan saat menemukan kesalahan dalam program?",
          choices: [
            { content: "Menangis dan menyerah", isCorrect: false, feedback: "Jangan menyerah! Kesalahan adalah bagian dari belajar." },
            { content: "Mencari tahu penyebabnya lalu memperbaikinya", isCorrect: true, feedback: "Benar! Cari tahu apa yang salah, lalu perbaiki." },
            { content: "Mengabaikannya", isCorrect: false, feedback: "Kalau diabaikan, program tidak akan berjalan dengan benar." },
            { content: "Menghapus semua kode", isCorrect: false, feedback: "Tidak perlu menghapus semua. Cari bagian yang salah saja." },
          ],
        },
        {
          question: "Bagaimana cara menggunakan perangkat digital dengan bijak?",
          choices: [
            { content: "Bermain game sepanjang hari", isCorrect: false, feedback: "Terlalu lama di depan layar tidak baik untuk kesehatan." },
            { content: "Mengatur waktu penggunaan dan istirahat setiap 30 menit", isCorrect: true, feedback: "Benar! Gunakan teknologi dengan bijak dan istirahat yang cukup." },
            { content: "Menggunakan gadget sambil tiduran", isCorrect: false, feedback: "Posisi yang salah bisa merusak mata dan leher." },
            { content: "Mengakses situs sembarangan", isCorrect: false, feedback: "Tidak aman! Hanya akses situs yang sesuai usia." },
          ],
        },
        {
          question: "Apa itu bug dalam pemrograman?",
          choices: [
            { content: "Serangga kecil di komputer", isCorrect: false, feedback: "Bukan serangga sungguhan! Bug adalah istilah untuk kesalahan program." },
            { content: "Kesalahan atau masalah dalam kode program", isCorrect: true, feedback: "Benar! Bug adalah error yang membuat program tidak berjalan sesuai harapan." },
            { content: "Fitur baru dalam game", isCorrect: false, feedback: "Bukan. Bug adalah masalah, bukan fitur." },
            { content: "Tombol di keyboard", isCorrect: false, feedback: "Bukan. Bug tidak ada hubungannya dengan keyboard." },
          ],
        },
        {
          question: "Mengapa kita perlu debugging?",
          choices: [
            { content: "Agar program terlihat lebih bagus", isCorrect: false, feedback: "Debugging bukan untuk mempercantik tampilan." },
            { content: "Agar program berjalan sesuai yang kita inginkan tanpa error", isCorrect: true, feedback: "Benar! Debugging memastikan program bebas dari kesalahan." },
            { content: "Agar komputer tidak cepat panas", isCorrect: false, feedback: "Bukan. Debugging tidak terkait suhu komputer." },
            { content: "Agar game berjalan lebih cepat", isCorrect: false, feedback: "Bukan tujuan utama. Debugging untuk memperbaiki logika." },
          ],
        },
      ],
    },
    capstoneLabel: "Artist Lab",
    capstoneUrl: "https://studio.code.org/projects/artist_k1/",
  },
  {
    id: "ce3-event",
    title: "Event & Bersikap Baik",
    goals: "Belajar event dalam pemrograman dan pentingnya bersikap baik kepada orang lain",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce3a",
        label: "1",
        url: "https://studio.code.org/flappy/1?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "ce3b",
        label: "2",
        url: "https://studio.code.org/courses/hello-world-animals-2021/units/1/lessons/1/levels/1?section_id=6590433",
      },
    ],
    quiz: {
      code: "ce3-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan event dalam pemrograman?",
          choices: [
            { content: "Kejadian atau aksi yang memicu program menjalankan perintah", isCorrect: true, feedback: "Benar! Event adalah sesuatu yang terjadi dan memicu kode untuk berjalan." },
            { content: "Sebuah perlombaan coding", isCorrect: false, feedback: "Event bukan perlombaan." },
            { content: "Nama tombol di keyboard", isCorrect: false, feedback: "Tombol bisa memicu event, tapi bukan event itu sendiri." },
            { content: "Jenis virus komputer", isCorrect: false, feedback: "Bukan. Event tidak ada hubungannya dengan virus." },
          ],
        },
        {
          question: "Manakah contoh event dalam sebuah game?",
          choices: [
            { content: "Warna background", isCorrect: false, feedback: "Warna bukan event, hanya properti." },
            { content: "Pemain mengklik tombol play", isCorrect: true, feedback: "Benar! Klik adalah event yang memicu game mulai berjalan." },
            { content: "Skor yang ditampilkan", isCorrect: false, feedback: "Skor adalah data, bukan event." },
            { content: "Ukuran karakter", isCorrect: false, feedback: "Ukuran adalah properti, bukan event." },
          ],
        },
        {
          question: "Bagaimana cara bersikap baik saat bermain game online?",
          choices: [
            { content: "Mengejek pemain yang kalah", isCorrect: false, feedback: "Tidak baik! Kita harus menghormati semua pemain." },
            { content: "Membantu teman yang kesulitan dan tidak berkata kasar", isCorrect: true, feedback: "Benar! Bersikap baik adalah kunci bermain game yang menyenangkan." },
            { content: "Curang agar menang terus", isCorrect: false, feedback: "Curang tidak boleh! Bermainlah dengan jujur." },
            { content: "Mengabaikan chat dari pemain lain", isCorrect: false, feedback: "Lebih baik merespon dengan sopan daripada mengabaikan." },
          ],
        },
        {
          question: "Apa yang terjadi saat kamu menekan tombol spasi di keyboard dalam sebuah game?",
          choices: [
            { content: "Tidak terjadi apa-apa", isCorrect: false, feedback: "Pasti ada yang terjadi! Program menunggu event." },
            { content: "Event tombol terdeteksi dan program menjalankan perintah yang sudah ditentukan", isCorrect: true, feedback: "Benar! Setiap tombol bisa memicu aksi tertentu dalam program." },
            { content: "Komputer mati", isCorrect: false, feedback: "Tidak! Menekan tombol tidak akan mematikan komputer." },
            { content: "Program berhenti", isCorrect: false, feedback: "Tidak selalu. Tergantung kode yang dibuat." },
          ],
        },
        {
          question: "Event apa yang paling sering digunakan untuk memulai sebuah game Scratch?",
          choices: [
            { content: 'Event "when space pressed"', isCorrect: false, feedback: "Bisa dipakai, tapi bukan yang paling utama." },
            { content: 'Event "when green flag clicked"', isCorrect: true, feedback: "Benar! Bendera hijau adalah tombol start utama di Scratch." },
            { content: 'Event "when sprite clicked"', isCorrect: false, feedback: "Itu untuk interaksi dengan sprite, bukan untuk start." },
            { content: 'Event "when backdrop switches to"', isCorrect: false, feedback: "Itu untuk ganti background, bukan start game." },
          ],
        },
      ],
    },
    capstoneLabel: "Sprite Lab",
    capstoneUrl: "https://studio.code.org/projects/spritelab/",
  },
  {
    id: "ce4-loop",
    title: "Perulangan & Bersikap Sopan",
    goals: "Belajar konsep perulangan (loop) dan pentingnya bersikap sopan di dunia digital",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce4a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/8/levels/1?section_id=6590433",
      },
      {
        code: "ce4b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/9/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "ce4-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan perulangan (loop) dalam pemrograman?",
          choices: [
            { content: "Perintah untuk menjalankan kode berulang kali", isCorrect: true, feedback: "Benar! Loop membuat kita tidak perlu menulis kode yang sama berkali-kali." },
            { content: "Perintah untuk menghentikan program", isCorrect: false, feedback: "Itu stop, bukan loop." },
            { content: "Perintah untuk menggambar lingkaran", isCorrect: false, feedback: "Loop bisa dipakai untuk menggambar, tapi bukan itu definisinya." },
            { content: "Perintah untuk menyimpan data", isCorrect: false, feedback: "Itu variabel atau database, bukan loop." },
          ],
        },
        {
          question: "Manakah contoh perulangan dalam kehidupan sehari-hari?",
          choices: [
            { content: "Makan sekali sehari", isCorrect: false, feedback: "Makan bukan perulangan dalam konteks ini." },
            { content: "Menyikat gigi setiap pagi dan malam", isCorrect: true, feedback: "Benar! Kegiatan yang dilakukan berulang setiap hari adalah contoh loop." },
            { content: "Tidur sekali", isCorrect: false, feedback: "Sekali bukan perulangan." },
            { content: "Bernafas", isCorrect: false, feedback: "Bernafas itu otomatis, bukan perulangan yang kita program." },
          ],
        },
        {
          question: "Bagaimana cara bersikap sopan saat berkomunikasi di media sosial?",
          choices: [
            { content: "Menulis dengan huruf kapital semua", isCorrect: false, feedback: "Huruf kapital semua berarti berteriak, tidak sopan." },
            { content: "Menggunakan kata sopan dan tidak menyinggung perasaan orang lain", isCorrect: true, feedback: "Benar! Sama seperti di dunia nyata, kita harus sopan." },
            { content: "Membalas dengan emosi marah", isCorrect: false, feedback: "Menahan emosi adalah bagian dari etika digital." },
            { content: "Menyebarkan berita tanpa dicek dulu", isCorrect: false, feedback: "Cek kebenaran dulu sebelum menyebarkan informasi." },
          ],
        },
        {
          question: "Apa perbedaan blok repeat dan forever dalam Scratch?",
          choices: [
            { content: "Repeat mengulang jumlah tertentu, forever mengulang terus-menerus", isCorrect: true, feedback: "Benar! Repeat butuh jumlah, forever tidak pernah berhenti." },
            { content: "Forever lebih cepat dari repeat", isCorrect: false, feedback: "Kecepatan sama, yang beda adalah jumlah perulangannya." },
            { content: "Repeat hanya untuk angka genap", isCorrect: false, feedback: "Repeat bisa untuk angka berapa saja." },
            { content: "Tidak ada perbedaan", isCorrect: false, feedback: "Sangat berbeda! Repeat berhenti, forever terus berjalan." },
          ],
        },
        {
          question: "Apa itu etiket digital (netiquette)?",
          choices: [
            { content: "Aturan sopan santun dalam berkomunikasi di dunia digital", isCorrect: true, feedback: "Benar! Netiquette adalah etika berinternet." },
            { content: "Jenis virus komputer", isCorrect: false, feedback: "Bukan. Netiquette tentang perilaku, bukan virus." },
            { content: "Cara menginstall software", isCorrect: false, feedback: "Itu instalasi, bukan etiket." },
            { content: "Nama sebuah website", isCorrect: false, feedback: "Bukan nama website." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce5-loop2",
    title: "Puzzle Perulangan & Hidup Sehat",
    goals: "Belajar perulangan lebih kompleks dan menjaga kesehatan saat menggunakan teknologi",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce5a",
        label: "1",
        url: "https://studio.code.org/courses/courseb-2025/units/1/lessons/4/levels/2?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "ce5b",
        label: "2",
        url: "https://studio.code.org/courses/courseb-2025/units/1/lessons/7/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "ce5-quiz",
      questions: [
        {
          question: "Apa yang dimaksud dengan nested loop (perulangan bersarang)?",
          choices: [
            { content: "Perulangan di dalam perulangan lainnya", isCorrect: true, feedback: "Benar! Nested loop adalah loop di dalam loop." },
            { content: "Dua perulangan yang berjalan bersamaan", isCorrect: false, feedback: "Bukan bersamaan, tapi satu di dalam yang lain." },
            { content: "Perulangan yang tidak pernah berhenti", isCorrect: false, feedback: "Itu infinite loop, bukan nested loop." },
            { content: "Perulangan dengan angka negatif", isCorrect: false, feedback: "Bukan. Nested artinya bersarang." },
          ],
        },
        {
          question: "Berapa lama waktu ideal screen time untuk anak-anak?",
          choices: [
            { content: "Boleh seharian karena belajar", isCorrect: false, feedback: "Terlalu lama di depan layar tidak sehat." },
            { content: "Maksimal 1-2 jam per hari dengan istirahat", isCorrect: true, feedback: "Benar! Screen time perlu dibatasi dan diselingi istirahat." },
            { content: "Tidak boleh sama sekali", isCorrect: false, feedback: "Teknologi juga penting untuk belajar, asal bijak." },
            { content: "5 jam per hari", isCorrect: false, feedback: "Terlalu banyak! Mata dan tubuh perlu istirahat." },
          ],
        },
        {
          question: "Manakah pola perulangan yang benar untuk menggambar persegi?",
          choices: [
            { content: "Ulangi 4 kali: maju, belok kanan", isCorrect: true, feedback: "Benar! Persegi butuh 4 sisi, setiap sisi maju lalu belok." },
            { content: "Ulangi 3 kali: maju, belok kanan", isCorrect: false, feedback: "3 kali menghasilkan segitiga, bukan persegi." },
            { content: "Ulangi 6 kali: maju, belok kanan", isCorrect: false, feedback: "6 kali menghasilkan segi enam." },
            { content: "Majui 1 kali, belok kanan 4 kali", isCorrect: false, feedback: "Hanya bergerak sekali, tidak membentuk persegi." },
          ],
        },
        {
          question: "Apa yang harus dilakukan agar tetap sehat saat belajar coding?",
          choices: [
            { content: "Duduk membungkuk di depan laptop", isCorrect: false, feedback: "Postur yang salah bisa sakit pinggang." },
            { content: "Istirahat setiap 30 menit, regangkan badan, dan jaga jarak mata", isCorrect: true, feedback: "Benar! Terapkan aturan 20-20-20: tiap 20 menit lihat jauh 20 detik." },
            { content: "Main game semalaman", isCorrect: false, feedback: "Kurang tidur tidak baik untuk kesehatan." },
            { content: "Makan sambil coding", isCorrect: false, feedback: "Bisa bikin keyboard kotor dan kurang fokus." },
          ],
        },
        {
          question: "Apa manfaat memecah masalah besar menjadi bagian kecil (decomposition)?",
          choices: [
            { content: "Membuat masalah lebih sulit", isCorrect: false, feedback: "Justru lebih mudah." },
            { content: "Membuat masalah lebih mudah diselesaikan langkah demi langkah", isCorrect: true, feedback: "Benar! Memecah masalah besar jadi kecil memudahkan penyelesaian." },
            { content: "Tidak ada manfaatnya", isCorrect: false, feedback: "Ada manfaat besar! Ini konsep penting dalam coding." },
            { content: "Membuat komputer lebih cepat", isCorrect: false, feedback: "Bukan untuk kecepatan komputer." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce6-mc",
    title: "Minecraft Adventure",
    goals: "Belajar arah mata angin, navigasi, dan urutan langkah menggunakan Minecraft",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce6a",
        label: "1",
        url: "https://studio.code.org/courses/mc/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "ce6-quiz",
      questions: [
        {
          question: "Ke arah manakah pemain Minecraft ini akan bergerak?",
          imageUrl: "___CE6_DIR_1___",
          choices: [
            { content: "Kiri", isCorrect: true, feedback: "Benar! Pemain menghadap ke kiri." },
            { content: "Kanan", isCorrect: false, feedback: "Coba perhatikan arah hadap karakter." },
          ],
        },
        {
          question: "Ke arah manakah pemain Minecraft ini akan bergerak?",
          imageUrl: "___CE6_DIR_2___",
          choices: [
            { content: "Kiri", isCorrect: false, feedback: "Coba perhatikan arah hadap karakter." },
            { content: "Kanan", isCorrect: true, feedback: "Benar! Pemain menghadap ke kanan." },
          ],
        },
        {
          question: "Ke arah manakah pemain Minecraft ini akan bergerak?",
          imageUrl: "___CE6_DIR_3___",
          choices: [
            { content: "Kiri", isCorrect: true, feedback: "Benar! Pemain menghadap ke kiri." },
            { content: "Kanan", isCorrect: false, feedback: "Coba perhatikan arah hadap karakter." },
          ],
        },
        {
          question: "Apa urutan yang benar agar pemain sampai ke pohon?",
          imageUrl: "___CE6_DIR_4___",
          choices: [
            { content: "Maju → Hadap Kanan → Maju", isCorrect: true, feedback: "Benar! Pemain maju, belok kanan, lalu maju lagi ke pohon." },
            { content: "Maju → Hadap Kiri → Maju", isCorrect: false, feedback: "Coba perhatikan posisi pohon dari pemain." },
          ],
        },
        {
          question: "Ke arah manakah pemain Minecraft ini akan bergerak?",
          imageUrl: "___CE6_DIR_5___",
          choices: [
            { content: "Kiri", isCorrect: true, feedback: "Benar! Pemain menghadap ke kiri." },
            { content: "Kanan", isCorrect: false, feedback: "Coba perhatikan arah hadap karakter." },
          ],
        },
        {
          question: "Ke arah manakah pemain Minecraft ini akan bergerak?",
          imageUrl: "___CE6_DIR_6___",
          choices: [
            { content: "Kiri", isCorrect: true, feedback: "Benar! Pemain menghadap ke kiri." },
            { content: "Kanan", isCorrect: false, feedback: "Coba perhatikan arah hadap karakter." },
          ],
        },
      ],
    },
    capstoneLabel: "Minecraft",
    capstoneUrl: "https://studio.code.org/projects/minecraft_adventurer",
  },
  {
    id: "ce7-dance",
    title: "Dance Party & Event",
    goals: "Belajar event-driven programming melalui Dance Party dan Sports",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce7a",
        label: "1",
        url: "https://studio.code.org/courses/dance/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "ce7b",
        label: "2",
        url: "https://studio.code.org/courses/sports/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "ce7-quiz",
      questions: [
        {
          question: "Apa yang dimaksud dengan event-driven programming?",
          choices: [
            { content: "Pemrograman yang berjalan berdasarkan urutan dari atas ke bawah", isCorrect: false, feedback: "Itu pemrograman sekuensial, bukan event-driven." },
            { content: "Pemrograman dimana kode berjalan sebagai respons terhadap event/kejadian", isCorrect: true, feedback: "Benar! Program menunggu event, lalu meresponsnya." },
            { content: "Pemrograman tanpa menggunakan kode", isCorrect: false, feedback: "Event-driven tetap pakai kode." },
            { content: "Pemrograman untuk membuat game dansa", isCorrect: false, feedback: "Bukan hanya untuk dansa." },
          ],
        },
        {
          question: "Dalam Dance Party, apa yang terjadi saat kamu menekan tombol panah?",
          choices: [
            { content: "Karakter menari mengikuti instruksi yang sudah diprogram", isCorrect: true, feedback: "Benar! Tombol panah memicu event yang membuat karakter melakukan gerakan dance." },
            { content: "Karakter berhenti bergerak", isCorrect: false, feedback: "Justru bergerak sesuai kode." },
            { content: "Musik berhenti", isCorrect: false, feedback: "Musik tidak otomatis berhenti." },
            { content: "Tidak terjadi apa-apa", isCorrect: false, feedback: "Pasti ada yang terjadi! Itu namanya event." },
          ],
        },
        {
          question: "Apa perbedaan antara event click dan event key press?",
          choices: [
            { content: "Click dengan mouse, key press dengan keyboard", isCorrect: true, feedback: "Benar! Click pakai mouse, key press pakai keyboard." },
            { content: "Click lebih cepat dari key press", isCorrect: false, feedback: "Kecepatan tergantung user, bukan jenis event." },
            { content: "Key press hanya untuk game", isCorrect: false, feedback: "Key press bisa dipakai di berbagai program." },
            { content: "Tidak ada perbedaan", isCorrect: false, feedback: "Sumber inputnya berbeda: mouse vs keyboard." },
          ],
        },
        {
          question: "Mengapa event penting dalam pembuatan game?",
          choices: [
            { content: "Agar game bisa berinteraksi dengan pemain", isCorrect: true, feedback: "Benar! Event memungkinkan pemain berinteraksi dengan game." },
            { content: "Agar game terlihat bagus", isCorrect: false, feedback: "Tampilan visual, bukan fungsi event." },
            { content: "Agar game tidak membosankan", isCorrect: false, feedback: "Interaksi membuat game seru, bukan event itu sendiri." },
            { content: "Agar game berjalan otomatis", isCorrect: false, feedback: "Event justru butuh input dari pemain." },
          ],
        },
        {
          question: "Manakah yang BUKAN merupakan contoh event?",
          choices: [
            { content: "Mengklik tombol", isCorrect: false, feedback: "Klik adalah event." },
            { content: "Menekan keyboard", isCorrect: false, feedback: "Key press adalah event." },
            { content: "Warna background biru", isCorrect: true, feedback: "Benar! Warna bukan event, hanya properti." },
            { content: "Menggerakkan mouse", isCorrect: false, feedback: "Mouse move adalah event." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce8-typing",
    title: "Mengetik 10 Jari",
    goals: "Belajar dasar-dasar mengetik dengan posisi jari yang benar dan mengenal tombol keyboard",
    tools: "Browser, edclub, code.org",
    levels: [
      {
        code: "ce8a",
        label: "1",
        url: "https://www.edclub.com/sportal/program-16.game",
      },
      {
        code: "ce8b",
        label: "2",
        url: "https://studio.code.org/courses/gumball/units/1/lessons/1/levels/1",
      },
    ],
    quiz: {
      code: "ce8-quiz",
      questions: [
        {
          question: "Apa posisi jari yang benar saat mengetik?",
          choices: [
            { content: "Jari-jari diletakkan di atas tombol home row (ASDF JKL;)", isCorrect: true, feedback: "Benar! Home row adalah posisi awal jari yang benar." },
            { content: "Hanya menggunakan 2 jari telunjuk", isCorrect: false, feedback: "Mengetik 10 jari lebih cepat dan efisien." },
            { content: "Jari-jari diletakkan di sembarang tombol", isCorrect: false, feedback: "Posisi awal harus teratur untuk mengetik cepat." },
            { content: "Menggunakan satu tangan saja", isCorrect: false, feedback: "Gunakan kedua tangan untuk hasil maksimal." },
          ],
        },
        {
          question: "Mengapa kita perlu belajar mengetik dengan benar?",
          choices: [
            { content: "Agar bisa mengetik lebih cepat dan tidak melihat keyboard", isCorrect: true, feedback: "Benar! Mengetik 10 jari meningkatkan kecepatan dan efisiensi." },
            { content: "Agar jari tidak sakit", isCorrect: false, feedback: "Justru posisi salah yang bikin sakit." },
            { content: "Agar keyboard tidak cepat rusak", isCorrect: false, feedback: "Keyboard dirancang untuk dipakai." },
            { content: "Hanya untuk lomba mengetik", isCorrect: false, feedback: "Skill ini berguna sehari-hari." },
          ],
        },
        {
          question: "Tombol apakah yang disebut sebagai home row?",
          choices: [
            { content: "A S D F J K L ;", isCorrect: true, feedback: "Benar! Itu adalah baris tengah keyboard tempat jari beristirahat." },
            { content: "Q W E R T Y U I O P", isCorrect: false, feedback: "Itu baris atas, bukan home row." },
            { content: "Z X C V B N M", isCorrect: false, feedback: "Itu baris bawah." },
            { content: "1 2 3 4 5 6 7 8 9 0", isCorrect: false, feedback: "Itu baris angka." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan touch typing?",
          choices: [
            { content: "Mengetik sambil melihat keyboard", isCorrect: false, feedback: "Touch typing justru tanpa melihat keyboard." },
            { content: "Mengetik tanpa melihat keyboard, mengandalkan rasa jari", isCorrect: true, feedback: "Benar! Touch typing adalah kemampuan mengetik buta." },
            { content: "Mengetik dengan satu jari", isCorrect: false, feedback: "Bukan. Touch typing pakai 10 jari." },
            { content: "Mengetik sambil tiduran", isCorrect: false, feedback: "Bukan masalah posisi tubuh." },
          ],
        },
        {
          question: "Skill mengetik yang baik membantu dalam hal apa?",
          choices: [
            { content: "Menulis kode program lebih cepat", isCorrect: true, feedback: "Benar! Coding butuh mengetik cepat dan akurat." },
            { content: "Membuat komputer lebih pintar", isCorrect: false, feedback: "Komputer tidak terpengaruh kecepatan ketik." },
            { content: "Membuat game lebih seru", isCorrect: false, feedback: "Bukan langsung ke game." },
            { content: "Menghemat listrik", isCorrect: false, feedback: "Tidak ada hubungannya." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce9-problem",
    title: "Problem Solving dengan Algoritma",
    goals: "Belajar cara memecahkan masalah dengan langkah-langkah algoritma yang sistematis",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce9a",
        label: "1",
        url: "https://studio.code.org/courses/spelling-bee-2021/units/1/lessons/1/levels/3",
      },
      {
        code: "ce9b",
        label: "2",
        url: "https://studio.code.org/courses/hero/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "ce9-quiz",
      questions: [
        {
          question: "Langkah pertama yang harus dilakukan saat menghadapi masalah adalah...",
          choices: [
            { content: "Langsung mencoba semua solusi", isCorrect: false, feedback: "Jangan terburu-buru. Pahami dulu masalahnya." },
            { content: "Memahami masalah dengan baik", isCorrect: true, feedback: "Benar! Pahami dulu masalahnya sebelum mencari solusi." },
            { content: "Menyerah", isCorrect: false, feedback: "Jangan menyerah! Setiap masalah pasti ada solusinya." },
            { content: "Bertanya ke teman", isCorrect: false, feedback: "Boleh bertanya, tapi pahami dulu masalahnya sendiri." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan decomposition dalam problem solving?",
          choices: [
            { content: "Memecah masalah besar menjadi bagian-bagian kecil", isCorrect: true, feedback: "Benar! Masalah besar lebih mudah diselesaikan jika dipecah." },
            { content: "Menggabungkan beberapa masalah menjadi satu", isCorrect: false, feedback: "Kebalikannya. Justru dipecah, bukan digabung." },
            { content: "Mengabaikan masalah", isCorrect: false, feedback: "Tidak! Masalah harus dihadapi." },
            { content: "Mencari masalah baru", isCorrect: false, feedback: "Fokus pada masalah yang ada." },
          ],
        },
        {
          question: "Mengapa kita perlu menguji solusi setelah membuatnya?",
          choices: [
            { content: "Agar solusi terlihat keren", isCorrect: false, feedback: "Bukan untuk penampilan." },
            { content: "Untuk memastikan solusi berjalan dengan benar", isCorrect: true, feedback: "Benar! Pengujian memastikan tidak ada error." },
            { content: "Karena tutor menyuruh", isCorrect: false, feedback: "Bukan karena disuruh, tapi karena penting." },
            { content: "Tidak perlu diuji", isCorrect: false, feedback: "Pengujian penting untuk menemukan kesalahan." },
          ],
        },
        {
          question: "Apa itu pattern recognition dalam problem solving?",
          choices: [
            { content: "Mengenali pola yang sama dari masalah sebelumnya", isCorrect: true, feedback: "Benar! Jika polanya sama, solusinya mungkin mirip." },
            { content: "Membuat pola gambar", isCorrect: false, feedback: "Bukan masalah gambar." },
            { content: "Menghapal semua solusi", isCorrect: false, feedback: "Tidak perlu menghapal, cukup mengenali pola." },
            { content: "Menebak solusi secara acak", isCorrect: false, feedback: "Problem solving butuh logika, bukan tebakan." },
          ],
        },
        {
          question: "Apa yang harus dilakukan jika solusi pertama tidak berhasil?",
          choices: [
            { content: "Menyerah dan berhenti mencoba", isCorrect: false, feedback: "Jangan menyerah! Coba pendekatan lain." },
            { content: "Mencari tahu penyebabnya, lalu mencoba solusi lain", isCorrect: true, feedback: "Benar! Kegagalan adalah bagian dari proses belajar." },
            { content: "Memaksa solusi pertama tetap dipakai", isCorrect: false, feedback: "Jika tidak berhasil, cari alternatif." },
            { content: "Menyalahkan komputer", isCorrect: false, feedback: "Komputer hanya menjalankan perintah, evaluasi lagi kodenya." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce10-music",
    title: "Fungsi dengan Music",
    goals: "Belajar konsep fungsi melalui musik dan coding",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce10a",
        label: "1",
        url: "https://studio.code.org/courses/coding-with-music-2025/units/1/lessons/1/levels/2",
      },
    ],
    quiz: {
      code: "ce10-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan fungsi dalam pemrograman?",
          choices: [
            { content: "Blok kode yang bisa dipakai berulang kali dengan sekali panggil", isCorrect: true, feedback: "Benar! Fungsi membuat kode bisa dipakai lagi tanpa menulis ulang." },
            { content: "Tombol di keyboard", isCorrect: false, feedback: "Fungsi bukan tombol." },
            { content: "Jenis musik", isCorrect: false, feedback: "Bukan. Fungsi adalah konsep pemrograman." },
            { content: "Nama file program", isCorrect: false, feedback: "Fungsi bukan nama file." },
          ],
        },
        {
          question: "Dalam Coding with Music, apa gunanya membuat sebuah fungsi untuk sebuah nada?",
          choices: [
            { content: "Agar nada bisa dipakai berulang tanpa membuat ulang", isCorrect: true, feedback: "Benar! Fungsi nada bisa dipanggil kapan saja." },
            { content: "Agar nada terdengar lebih keras", isCorrect: false, feedback: "Volume diatur terpisah." },
            { content: "Agar nada berubah sendiri", isCorrect: false, feedback: "Fungsi tidak mengubah nada otomatis." },
            { content: "Tidak ada gunanya", isCorrect: false, feedback: "Fungsi sangat berguna!" },
          ],
        },
        {
          question: "Apa manfaat menggunakan fungsi dalam pembuatan program?",
          choices: [
            { content: "Kode menjadi lebih pendek dan tidak perlu ditulis berulang", isCorrect: true, feedback: "Benar! Fungsi membuat kode efisien." },
            { content: "Membuat komputer lebih mahal", isCorrect: false, feedback: "Tidak ada hubungannya dengan harga komputer." },
            { content: "Membuat program lebih lambat", isCorrect: false, feedback: "Fungsi tidak memperlambat." },
            { content: "Fungsi hanya untuk musik", isCorrect: false, feedback: "Fungsi bisa dipakai untuk semua jenis program." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan parameter dalam fungsi?",
          choices: [
            { content: "Data yang dimasukkan ke dalam fungsi untuk diproses", isCorrect: true, feedback: "Benar! Parameter adalah input bagi fungsi." },
            { content: "Nama fungsi", isCorrect: false, feedback: "Nama fungsi bukan parameter." },
            { content: "Hasil akhir fungsi", isCorrect: false, feedback: "Itu return value, bukan parameter." },
            { content: "Jenis printer", isCorrect: false, feedback: "Tidak ada hubungannya." },
          ],
        },
        {
          question: "Manakah analogi yang tepat untuk fungsi dalam kehidupan sehari-hari?",
          choices: [
            { content: "Resep masakan — sekali dihafal, bisa dipakai kapan saja", isCorrect: true, feedback: "Benar! Seperti fungsi, resep bisa dipakai berulang kali." },
            { content: "Buku tulis baru", isCorrect: false, feedback: "Buku tulis tidak bisa dipakai ulang dengan cara yang sama." },
            { content: "Pensil warna", isCorrect: false, feedback: "Pensil bukan contoh fungsi." },
            { content: "Tas sekolah", isCorrect: false, feedback: "Tas bukan fungsi." },
          ],
        },
      ],
    },
    capstoneLabel: "Music Lab",
    capstoneUrl: "https://studio.code.org/projects/music/",
  },
  {
    id: "ce11-eco",
    title: "Ekosistem Laut",
    goals: "Belajar tentang keseimbangan ekosistem laut dan dampak perubahan populasi makhluk hidup",
    tools: "Browser, code.org",
    levels: [
      {
        code: "ce11a",
        label: "1",
        url: "https://studio.code.org/courses/csc-ecosystems-2023/units/1/lessons/1/levels/1",
      },
    ],
    quiz: {
      code: "ce11-quiz",
      questions: [
        {
          question: "Apa yang akan terjadi jika terlalu banyak algae (ganggang) di laut?",
          choices: [
            { content: "Ikan-ikan akan senang karena banyak makanan", isCorrect: false, feedback: "Terlalu banyak algae justru berbahaya." },
            { content: "Keseimbangan ekosistem terganggu, oksigen berkurang di malam hari", isCorrect: true, feedback: "Benar! Algae berlebih menyebabkan eutrofikasi yang merusak ekosistem." },
            { content: "Air laut menjadi lebih bersih", isCorrect: false, feedback: "Justru sebaliknya, air bisa tercemar." },
            { content: "Tidak ada dampak apapun", isCorrect: false, feedback: "Pasti ada dampak pada ekosistem." },
          ],
        },
        {
          question: "Apa yang akan terjadi jika tidak ada algae di laut?",
          choices: [
            { content: "Ikan kehilangan sumber makanan utama", isCorrect: true, feedback: "Benar! Algae adalah dasar rantai makanan laut." },
            { content: "Ikan akan mencari makanan di darat", isCorrect: false, feedback: "Ikan tidak bisa hidup di darat." },
            { content: "Laut menjadi lebih jernih", isCorrect: false, feedback: "Mungkin iya, tapi ekosistem hancur." },
            { content: "Tidak berpengaruh", isCorrect: false, feedback: "Sangat berpengaruh! Algae adalah produsen." },
          ],
        },
        {
          question: "Apa yang terjadi jika populasi ikan terlalu banyak?",
          choices: [
            { content: "Ekosistem semakin sehat", isCorrect: false, feedback: "Terlalu banyak ikan juga tidak baik." },
            { content: "Algae akan habis dimakan, rantai makanan terganggu", isCorrect: true, feedback: "Benar! Overpopulasi ikan menguras sumber daya." },
            { content: "Ikan akan bermigrasi ke laut lain", isCorrect: false, feedback: "Bukan solusi, tetap mengganggu ekosistem." },
            { content: "Tidak ada efek samping", isCorrect: false, feedback: "Pasti ada efek pada keseimbangan." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan rantai makanan di laut?",
          choices: [
            { content: "Urutan siapa memakan siapa di ekosistem laut", isCorrect: true, feedback: "Benar! Rantai makanan menunjukkan aliran energi." },
            { content: "Jaring-jaring untuk menangkap ikan", isCorrect: false, feedback: "Itu jaring nelayan, bukan rantai makanan." },
            { content: "Daftar harga ikan di pasar", isCorrect: false, feedback: "Bukan. Rantai makanan tentang hubungan makan-dimakan." },
            { content: "Jenis-jenis ikan di laut", isCorrect: false, feedback: "Itu keanekaragaman hayati, bukan rantai makanan." },
          ],
        },
        {
          question: "Mengapa keseimbangan ekosistem laut penting?",
          choices: [
            { content: "Agar semua makhluk hidup bisa hidup berdampingan dengan baik", isCorrect: true, feedback: "Benar! Keseimbangan menjaga keberlangsungan hidup semua makhluk." },
            { content: "Agar nelayan bisa menangkap ikan sebanyak mungkin", isCorrect: false, feedback: "Eksploitasi berlebihan merusak ekosistem." },
            { content: "Agar laut terlihat indah", isCorrect: false, feedback: "Bukan hanya soal keindahan." },
            { content: "Tidak penting sama sekali", isCorrect: false, feedback: "Sangat penting! Manusia juga bergantung pada laut." },
          ],
        },
      ],
    },
    capstoneLabel: "Code JR Kids",
    capstoneUrl: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "ce12-ml",
    title: "Machine Learning",
    goals: "Belajar dasar-dasar machine learning, cara kerja AI, dan etika penggunaannya",
    tools: "Browser, code.org, Teachable Machine",
    levels: [
      {
        code: "ce12a",
        label: "1",
        url: "https://studio.code.org/courses/oceans/units/1/lessons/1/levels/1?section_id=6590433",
      },
      {
        code: "ce12b",
        label: "2",
        url: "https://teachablemachine.withgoogle.com/train/image",
      },
    ],
    quiz: {
      code: "ce12-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan Machine Learning?",
          choices: [
            { content: "Komputer belajar dari data untuk mengenali pola dan membuat keputusan", isCorrect: true, feedback: "Benar! ML adalah cara komputer belajar dari contoh." },
            { content: "Mesin yang bisa berfikir seperti manusia sempurna", isCorrect: false, feedback: "ML belum bisa berpikir sempurna seperti manusia." },
            { content: "Komputer yang bisa diperbaiki sendiri", isCorrect: false, feedback: "Itu self-repair, bukan ML." },
            { content: "Robot raksasa", isCorrect: false, feedback: "Bukan. ML adalah software, bukan robot." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan training data dalam ML?",
          choices: [
            { content: "Data contoh yang digunakan untuk mengajari komputer", isCorrect: true, feedback: "Benar! Training data adalah contoh-contoh yang dipelajari komputer." },
            { content: "Data nilai ulangan siswa", isCorrect: false, feedback: "Bukan. Training data khusus untuk ML." },
            { content: "Data yang dirahasiakan", isCorrect: false, feedback: "Training data justru harus tersedia untuk dipelajari." },
            { content: "Data kosong", isCorrect: false, feedback: "Data kosong tidak bisa dipakai untuk belajar." },
          ],
        },
        {
          question: "Manakah contoh penerapan Machine Learning dalam kehidupan sehari-hari?",
          choices: [
            { content: "Kalkulator menghitung 2+2", isCorrect: false, feedback: "Kalkulator pakai rumus, bukan ML." },
            { content: "Filter spam di email yang bisa mengenali email sampah", isCorrect: true, feedback: "Benar! Filter spam belajar dari pola email sebelumnya." },
            { content: "Lampu menyala saat ditekan", isCorrect: false, feedback: "Itu saklar, bukan ML." },
            { content: "Komputer yang menyala", isCorrect: false, feedback: "Itu hardware, bukan ML." },
          ],
        },
        {
          question: "Bagaimana cara Teachable Machine belajar mengenali gambar?",
          choices: [
            { content: "Dengan diberi kode program yang panjang", isCorrect: false, feedback: "Teachable Machine belajar dari contoh gambar, bukan dari kode." },
            { content: "Dengan diberi banyak contoh gambar lalu komputer mencari pola", isCorrect: true, feedback: "Benar! Semakin banyak contoh, semakin pintar ML-nya." },
            { content: "Dengan menebak secara acak", isCorrect: false, feedback: "ML tidak menebak acak, tapi belajar dari pola." },
            { content: "Dengan diinstal software khusus", isCorrect: false, feedback: "Software sudah ada, yang dibutuhkan adalah data latih." },
          ],
        },
        {
          question: "Apa yang harus diperhatikan agar AI/ML digunakan secara bertanggung jawab?",
          choices: [
            { content: "AI boleh menggantikan semua pekerjaan manusia", isCorrect: false, feedback: "AI harus membantu, bukan menggantikan manusia sepenuhnya." },
            { content: "Data yang digunakan harus adil, tidak bias, dan dijaga privasinya", isCorrect: true, feedback: "Benar! Etika AI sangat penting." },
            { content: "AI tidak perlu diawasi", isCorrect: false, feedback: "AI tetap perlu pengawasan manusia." },
            { content: "Semua keputusan bisa diserahkan ke AI", isCorrect: false, feedback: "Keputusan penting tetap harus melibatkan manusia." },
          ],
        },
      ],
    },
    capstoneLabel: "PictoBlox",
    capstoneUrl: "https://pictoblox.ai/",
  },
];

async function getOrUploadImage(
  prisma: PrismaClient,
  filePath: string,
  filename: string,
  mimeType: string,
  entityType: string,
  entityId: string,
): Promise<string | null> {
  const existing = await prisma.image.findFirst({
    where: { entityType, entityId },
  });
  if (existing) return existing.url;

  const resolvedPath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.warn(`  ⚠ Image file not found: ${resolvedPath}, skipping`);
    return null;
  }
  const buffer = fs.readFileSync(resolvedPath);
  const url = await uploadFile(buffer, filename, mimeType);

  await prisma.image.create({
    data: { url, filename, mimeType, size: buffer.length, entityType, entityId },
  });

  return url;
}

async function resolveQuizImages(
  prisma: PrismaClient,
  questions: CodeUnit["quiz"]["questions"],
): Promise<CodeUnit["quiz"]["questions"]> {
  return Promise.all(
    questions.map(async (q) => {
      if (!q.imageUrl || !q.imageUrl.startsWith("___CE6_DIR_")) return q;

      const num = q.imageUrl.replace("___CE6_DIR_", "").replace("___", "");
      const filePath = `../uploadSeed/quiz image/topics-6-code-exploler/${num}.jpg`;
      const entityId = `ce6-dir-${num}`;
      const url = await getOrUploadImage(prisma, filePath, `ce6-dir-${num}.jpg`, "image/jpeg", "quiz", entityId);

      if (!url) return { ...q, imageUrl: undefined };

      return { ...q, imageUrl: url };
    }),
  );
}

async function uploadSampleProjects(prisma: PrismaClient): Promise<void> {
  const samples: { file: string; entityId: string }[] = [
    { file: "4.project.sjr", entityId: "ce-sample-4" },
    { file: "5.project.sjr", entityId: "ce-sample-5" },
    { file: "7 project.sjr", entityId: "ce-sample-7" },
    { file: "8 project.sjr", entityId: "ce-sample-8" },
    { file: "9project.sjr", entityId: "ce-sample-9" },
    { file: "11 project.sjr", entityId: "ce-sample-11" },
  ];

  for (const sample of samples) {
    const existing = await prisma.image.findFirst({
      where: { entityType: "general", entityId: sample.entityId },
    });
    if (existing) continue;

    const filePath = path.resolve(__dirname, `../uploadSeed/code-exploler-projecr/${sample.file}`);

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ Sample project file not found: ${filePath}, skipping`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);
    const url = await uploadFile(buffer, sample.file, "application/octet-stream");

    await prisma.image.create({
      data: { url, filename: sample.file, mimeType: "application/octet-stream", size: buffer.length, entityType: "general", entityId: sample.entityId },
    });

    console.log(`  ✓ Uploaded sample project: ${sample.file}`);
  }
}

export async function seedCodeExplorer(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const name = "Code-Explorer";

  await prisma.studentTopicProgress.deleteMany({
    where: { topicTask: { topic: { curriculum: { name } } } },
  });
  await prisma.curriculum.deleteMany({ where: { name } });

  const curriculum = await prisma.curriculum.create({
    data: {
      name,
      assessmentSetId: defaultAssessment.id,
      ...(categoryIds?.length ? {
        categories: { create: categoryIds.map((cat) => ({ categoryId: cat.id })) },
      } : {}),
      topics: {
        create: codeExplorerUnits.map((unit, i) => ({
          title: unit.title,
          order: i,
          goals: unit.goals,
          tools: unit.tools,
        })),
      },
    },
    include: { topics: true },
  });

  for (const [unitIdx, unit] of codeExplorerUnits.entries()) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: lvl.code,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: "SCRATCH" as const,
        autoComplete: true,
      })),
      {
        topicId: topicRow.id,
        code: unit.quiz.code,
        label: "Q",
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
      {
        topicId: topicRow.id,
        code: `capstone-${unit.id}`,
        label: unit.capstoneLabel,
        url: unit.capstoneUrl,
        order: unit.levels.length + 1,
        isCapstone: true,
        type: "SCRATCH" as const,
        autoComplete: true,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const unit of codeExplorerUnits) {
    const quizTask = await prisma.topicTask.findFirst({
      where: { code: unit.quiz.code },
    });
    if (!quizTask) continue;

    const questions = await resolveQuizImages(prisma, unit.quiz.questions);

    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            imageUrl: q.imageUrl ?? null,
            choices: q.choices,
          })),
        },
      },
    });
  }

  await uploadSampleProjects(prisma);

  const sampleTopicMap: Record<string, number> = {
    "ce-sample-4": 3,
    "ce-sample-5": 4,
    "ce-sample-7": 6,
    "ce-sample-8": 7,
    "ce-sample-9": 8,
    "ce-sample-11": 10,
  };

  for (const [entityId, topicIdx] of Object.entries(sampleTopicMap)) {
    const image = await prisma.image.findFirst({
      where: { entityType: "general", entityId },
    });
    if (image && curriculum.topics[topicIdx]) {
      await prisma.topic.update({
        where: { id: curriculum.topics[topicIdx].id },
        data: { exampleProjectLink: image.url },
      });
    }
  }

  const totalTasks = codeExplorerUnits.reduce(
    (sum, u) => sum + u.levels.length + 2,
    0,
  );
  console.log(`✓ Code Explorer curriculum seeded (12 topics, ${totalTasks} tasks, 60 quiz questions)`);
}
