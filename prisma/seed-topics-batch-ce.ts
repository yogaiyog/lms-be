import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { uploadFile } from "../src/services/minio";

interface BatchCodeLevel {
  code: string;
  label: string;
  url: string;
}

interface BatchCodeUnit {
  id: string;
  title: string;
  goals: string;
  tools: string;
  materialLink: string | null;
  levels: BatchCodeLevel[];
  quiz: {
    code: string;
    questions: {
      question: string;
      imageUrl?: string;
      choices: { content: string; isCorrect: boolean; feedback: string }[];
    }[];
  };
}

interface BatchCodeCapstone {
  id: string;
  title: string;
  label: string;
  url: string;
  exampleProjectLink?: string;
}

const batchCodeUnits: BatchCodeUnit[] = [
  {
    id: "intro",
    title: "Digital Citizenship & Algoritma",
    goals: "Belajar algoritma, urutan langkah, dan cara bersikap baik di dunia digital",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/fc8zlah8tjyfj00",
    levels: [
      {
        code: "1a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/2/levels/1?section_id=6590433",
      },
      {
        code: "1b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/4/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "1-quiz",
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
  },
  {
    id: "debug",
    title: "Debugging & Bijak Digital",
    goals: "Belajar menemukan dan memperbaiki kesalahan, serta menggunakan perangkat digital dengan bijak",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/3ksn5eo03tjbl7m",
    levels: [
      {
        code: "2a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/5/levels/2",
      },
      {
        code: "2b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/6/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "2-quiz",
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
  },
  {
    id: "event",
    title: "Event & Bersikap Baik",
    goals: "Belajar event dalam pemrograman dan pentingnya bersikap baik kepada orang lain",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/efclkck17cdmlq6",
    levels: [
      {
        code: "3a",
        label: "1",
        url: "https://studio.code.org/flappy/1?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "3b",
        label: "2",
        url: "https://studio.code.org/courses/hello-world-animals-2021/units/1/lessons/1/levels/1?section_id=6590433",
      },
    ],
    quiz: {
      code: "3-quiz",
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
  },
  {
    id: "loop",
    title: "Perulangan & Bersikap Sopan",
    goals: "Belajar konsep perulangan (loop) dan pentingnya bersikap sopan di dunia digital",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/7tfaffe2wp6p3ev",
    levels: [
      {
        code: "4a",
        label: "1",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/8/levels/1?section_id=6590433",
      },
      {
        code: "4b",
        label: "2",
        url: "https://studio.code.org/courses/coursea-2025/units/1/lessons/9/levels/2?section_id=6590433",
      },
    ],
    quiz: {
      code: "4-quiz",
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
  },
  {
    id: "loop2",
    title: "Puzzle Perulangan & Hidup Sehat",
    goals: "Belajar perulangan lebih kompleks dan menjaga kesehatan saat menggunakan teknologi",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/mfnjn8ap8eo6lts",
    levels: [
      {
        code: "5a",
        label: "1",
        url: "https://studio.code.org/courses/courseb-2025/units/1/lessons/4/levels/2?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "5b",
        label: "2",
        url: "https://studio.code.org/courses/courseb-2025/units/1/lessons/7/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "5-quiz",
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
  },
  {
    id: "mc",
    title: "Minecraft Adventure",
    goals: "Belajar arah mata angin, navigasi, dan urutan langkah menggunakan Minecraft",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/lclf0uy85ogn0x8",
    levels: [
      {
        code: "6a",
        label: "1",
        url: "https://studio.code.org/courses/mc/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "6-quiz",
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
  },
];

const batchCodeCapstones: BatchCodeCapstone[] = [
  {
    id: "intro",
    title: "Digital Citizenship & Algoritma Capstone",
    label: "Artist Lab",
    url: "https://studio.code.org/projects/artist_k1/",
    exampleProjectLink: "https://studio.code.org/projects/artist_k1/9c91bfa4-790f-4a33-a3b0-55ac50fcad15",
  },
  {
    id: "debug",
    title: "Debugging & Bijak Digital Capstone",
    label: "Artist Lab",
    url: "https://studio.code.org/projects/artist_k1/",
    exampleProjectLink: "https://studio.code.org/projects/artist_k1/0f22237a-36c1-405b-8c66-7de5f547605c",
  },
  {
    id: "event",
    title: "Event & Bersikap Baik Capstone",
    label: "Sprite Lab",
    url: "https://studio.code.org/projects/spritelab/",
    exampleProjectLink: "https://studio.code.org/projects/spritelab/0baa23bb-fa1c-45fc-bf7a-71d8cb67f431",
  },
  {
    id: "loop",
    title: "Loop & Sopan Santun Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "loop2",
    title: "Puzzle Loop 2 & Hidup Sehat Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
  },
  {
    id: "mc",
    title: "Minecraft Adventure Capstone",
    label: "Minecraft",
    url: "https://studio.code.org/projects/minecraft_adventurer",
    exampleProjectLink: "https://studio.code.org/projects/minecraft_adventurer/3f981bd5-9788-470d-bc4c-a7ff9eb83bb3",
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
  questions: BatchCodeUnit["quiz"]["questions"],
): Promise<BatchCodeUnit["quiz"]["questions"]> {
  return Promise.all(
    questions.map(async (q) => {
      if (!q.imageUrl || !q.imageUrl.startsWith("___CE6_DIR_")) return q;

      const num = q.imageUrl.replace("___CE6_DIR_", "").replace("___", "");
      const filePath = `../uploadSeed/quiz image/topics-6-code-exploler/${num}.jpg`;
      const entityId = `bce6-dir-${num}`;
      const url = await getOrUploadImage(prisma, filePath, `bce6-dir-${num}.jpg`, "image/jpeg", "quiz", entityId);

      if (!url) return { ...q, imageUrl: undefined };

      return { ...q, imageUrl: url };
    }),
  );
}

export async function seedBatchCodeExplorer(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const name = "Batch-Code-Explorer";

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

  for (let i = 0; i < batchCodeUnits.length; i++) {
    const unit = batchCodeUnits[i];
    const cap = batchCodeCapstones[i];

    allTopics.push({
      title: unit.title,
      order: i * 2,
      materialLink: unit.materialLink ?? null,
      goals: unit.goals,
      tools: unit.tools,
    });

    if (cap) {
      allTopics.push({
        title: cap.title,
        order: i * 2 + 1,
        materialLink: null,
        goals: `Proyek akhir: ${cap.title}`,
        tools: unit.tools,
        exampleProjectLink: cap.exampleProjectLink,
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

  for (const unit of batchCodeUnits) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: `bce${lvl.code}`,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: "SCRATCH" as const,
        autoComplete: true,
      })),
      {
        topicId: topicRow.id,
        code: `bce${unit.quiz.code}`,
        label: "Q",
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const cap of batchCodeCapstones) {
    const topicRow = curriculum.topics.find((t) => t.title === cap.title);
    if (!topicRow) continue;

    await prisma.topicTask.create({
      data: {
        topicId: topicRow.id,
        code: `bcecap-${cap.id}`,
        label: "Capstone",
        url: cap.url,
        order: 0,
        isCapstone: true,
        type: "SCRATCH",
        autoComplete: true,
      },
    });
  }

  for (const unit of batchCodeUnits) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const quizTask = await prisma.topicTask.findFirst({
      where: { code: `bce${unit.quiz.code}`, topicId: topicRow.id },
    });
    if (!quizTask) continue;

    const resolvedQuestions = await resolveQuizImages(prisma, unit.quiz.questions);

    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: resolvedQuestions.map((q) => ({
            question: q.question,
            imageUrl: q.imageUrl ?? null,
            choices: q.choices,
          })),
        },
      },
    });
  }

  const totalTasks =
    batchCodeUnits.reduce((sum, u) => sum + u.levels.length + 1, 0) +
    batchCodeCapstones.length;
  console.log(
    `✓ Batch-Code-Explorer curriculum seeded (${batchCodeUnits.length + batchCodeCapstones.length} topics, ${totalTasks} tasks, ${batchCodeUnits.length} quizzes)`,
  );
}
